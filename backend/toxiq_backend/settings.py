import os
from pathlib import Path
import environ

# Initialize environment variables
env = environ.Env(
    DEBUG=(bool, True),
    DATABASE_URL=(str, ''),
    EMAIL_BACKEND=(str, 'django.core.mail.backends.console.EmailBackend'),
    EMAIL_HOST=(str, ''),
    EMAIL_PORT=(int, 587),
    EMAIL_HOST_USER=(str, ''),
    EMAIL_HOST_PASSWORD=(str, ''),
    EMAIL_USE_TLS=(bool, True),
    PAYU_MERCHANT_KEY=(str, 'MOCK_KEY'),
    PAYU_SALT=(str, 'MOCK_SALT'),
    PAYU_SANDBOX=(bool, True),
    FRONTEND_URL=(str, 'http://localhost:5173'),
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Read .env file if it exists
env_file = os.path.join(BASE_DIR, '.env')
if os.path.exists(env_file):
    environ.Env.read_env(env_file)

# Quick-start development settings - unsuitable for production
SECRET_KEY = env('SECRET_KEY', default='django-insecure-t!v!51xl$@*(1$%i2rew*z_73=c)igjk55v(iamnauf(&p9q4y')

DEBUG = env('DEBUG')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['*'])

# Application definition
INSTALLED_APPS = [
    'unfold',  # Unfold must be first!
    'unfold.contrib.filters',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    
    # Third party packages
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'cloudinary',
    
    # Project apps
    'authentication',
    'cms',
    'registration',
    'articles',
    'reports',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Cors middleware must come before common
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'toxiq_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'toxiq_backend.wsgi.application'

# Database configuration with PostgreSQL default & SQLite fallback
# If DATABASE_URL is defined, use it, else try standard individual PG settings.
DATABASES = {}
pg_db_url = env('DATABASE_URL')
if pg_db_url:
    DATABASES['default'] = env.db_url('DATABASE_URL')
    # Render PostgreSQL requires SSL mode
    if 'postgresql' in DATABASES['default'].get('ENGINE', ''):
        DATABASES['default'].setdefault('OPTIONS', {})
        DATABASES['default']['OPTIONS']['sslmode'] = 'require'

if not pg_db_url:
    db_name = env('DB_NAME', default='')
    db_user = env('DB_USER', default='')
    db_password = env('DB_PASSWORD', default='')
    db_host = env('DB_HOST', default='localhost')
    db_port = env('DB_PORT', default='5432')

    if db_name and db_user:
        DATABASES['default'] = {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_name,
            'USER': db_user,
            'PASSWORD': db_password,
            'HOST': db_host,
            'PORT': db_port,
        }
    else:
        # Default fallback to SQLite
        print("Warning: PostgreSQL credentials not found. Falling back to SQLite database.")
        sqlite_path = env('SQLITE_PATH', default=str(BASE_DIR / 'db.sqlite3'))
        DATABASES['default'] = {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': Path(sqlite_path),
        }

# Custom User Model
AUTH_USER_MODEL = 'authentication.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'  # Setting local time zone
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Enable WhiteNoise compression and caching support
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Media Files (User uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = Path(env('MEDIA_ROOT', default=str(BASE_DIR / 'media')))

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME = env('CLOUDINARY_CLOUD_NAME', default='')
CLOUDINARY_API_KEY = env('CLOUDINARY_API_KEY', default='')
CLOUDINARY_API_SECRET = env('CLOUDINARY_API_SECRET', default='')

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': CLOUDINARY_CLOUD_NAME,
        'API_KEY': CLOUDINARY_API_KEY,
        'API_SECRET': CLOUDINARY_API_SECRET,
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True  # In production, restrict this to specific origins

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}

# Simple JWT configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# Email Settings
DEFAULT_FROM_EMAIL = 'toxiq26@iqraahospital.in'
EMAIL_HOST = env('EMAIL_HOST')
if EMAIL_HOST:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_PORT = env('EMAIL_PORT')
    EMAIL_HOST_USER = env('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
    EMAIL_USE_TLS = env('EMAIL_USE_TLS')
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# PayU Credentials settings
PAYU_MERCHANT_KEY = env('PAYU_MERCHANT_KEY')
PAYU_SALT = env('PAYU_SALT')
PAYU_SANDBOX = env.bool('PAYU_SANDBOX', default=False)
FRONTEND_URL = env('FRONTEND_URL')

import logging
logger = logging.getLogger(__name__)
logger.warning(f"PAYU_KEY={PAYU_MERCHANT_KEY}")
logger.warning(f"PAYU_SANDBOX={PAYU_SANDBOX}")


# Unfold Theme custom settings matching TOXIQ healthcare conference branding
UNFOLD = {
    "SITE_HEADER": "TOXIQ Program Management",
    "SITE_TITLE": "TOXIQ Admin",
    "SITE_SYMBOL": "local_hospital",  
    "SHOW_HISTORY": True,
    "COLORS": {
        "primary": {
            "50": "239, 246, 255",
            "100": "219, 234, 254",
            "200": "191, 219, 254",
            "300": "147, 197, 253",
            "400": "96, 165, 250",
            "500": "30, 58, 138",  
            "600": "37, 99, 235",
            "700": "29, 78, 216",
            "800": "30, 58, 138",
            "900": "23, 37, 84",
        },
    },
}

