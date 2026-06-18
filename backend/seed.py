import os
import django
import sys

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toxiq_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from cms.models import ProgramContent, Banner, Speaker, Sponsor, GalleryImage
from registration.models import RegistrationForm, RegistrationField

User = get_user_model()

def seed_db():
    print("Starting database seeding...")

    # 1. Create Super Admin User
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@hospital.com',
            password='admin123',
            role='SUPER_ADMIN',
            phone='+91 99999 88888',
            first_name='TOXIQ',
            last_name='Admin'
        )
        print("Created Super Admin: admin / admin123")
    else:
        print("Super Admin 'admin' already exists.")

    # 2. Create Active Registration Form
    form, created = RegistrationForm.objects.get_or_create(
        is_active=True,
        defaults={
            'title': 'TOXIQ 2026 Registration Form',
            'instructions': 'Please read all instructions carefully. Upload proof of identity and select your registration category.',
            'fee_amount': 500.00,
            'currency': 'INR',
            'tax_percentage': 18.00  # 18% GST standard
        }
    )
    if created:
        print("Created dynamic Registration Form.")
        
        # Add Fields
        fields = [
            ('Full Name', 'text', True, 'Enter your full name', None, None, 1),
            ('Email Address', 'email', True, 'Enter your email address', None, None, 2),
            ('Phone Number', 'phone', True, 'e.g. +91 9876543210', None, None, 3),
            ('Institution/Hospital', 'text', True, 'Enter your workplace/college name', None, None, 4),
            ('Designation', 'dropdown', True, None, ['Doctor', 'Nurse', 'Medical Student', 'Researcher', 'Other'], None, 5),
            ('Registration Category', 'radio', True, None, ['Regular Delegate', 'Presenter', 'International Delegate'], None, 6),
            ('Upload Medical Registration Certificate (Optional)', 'file', False, None, None, {'allowed_types': ['.pdf', '.jpg', '.jpeg'], 'max_size_mb': 5}, 7),
        ]
        
        for label, ftype, req, placeholder, options, rules, order in fields:
            RegistrationField.objects.create(
                form=form,
                label=label,
                field_type=ftype,
                is_required=req,
                placeholder=placeholder,
                options=options,
                validation_rules=rules,
                order=order
            )
        print("Seeded dynamic registration fields.")
    else:
        print("Active Registration Form already exists.")

    # 3. Create Default CMS ProgramContent Blocks
    cms_contents = {
        'about_content': {
            'title': 'About TOXIQ 2026',
            'text': '<h3>Leading the Way in Clinical Toxicology</h3><p>The annual TOXIQ Program is India\'s premier clinical toxicology conference. Organized by the Apex Multi-Specialty Hospital, this three-day event brings together leading critical care doctors, emergency specialists, clinical pharmacologists, and researchers to deliberate on the latest paradigms in poisoning management, venomous bites treatment, and emergency overdose care.</p><p>Participate in hands-on workshops, case studies panel discussions, and scientific paper presentations curated by academic pioneers.</p>'
        },
        'important_dates': {
            'registration_open': '2026-06-01',
            'registration_close': '2026-07-31',
            'article_deadline': '2026-08-15'
        },
        'contact_details': {
            'address': 'Apex Hospital Complex, Senate Building, Sector 4, MG Road, New Delhi, India - 110001',
            'email': 'contact@toxiq2026.com',
            'phone': '+91 11 4455 6677'
        },
        'registration_instructions': 'Ensure that you input valid registration licensing credentials if registering under the Practitioner category. Registration fee covers conference kit, lunches, and certificate of credit hours.',
        'article_instructions': 'Abstract and article submissions must follow the official TOXIQ structure template. Files must be under 10MB and in PDF or DOCX formats only. Selected articles will be published in the Special Toxicology Journal edition.'
    }

    for key, val in cms_contents.items():
        ProgramContent.objects.update_or_create(key=key, defaults={'value': val})
    print("Seeded default CMS text blocks.")

    # 4. Create Banners
    if not Banner.objects.exists():
        Banner.objects.create(
            title='12th Annual Clinical Toxicology Symposium',
            subtitle='TOXIQ 2026: Navigating Complex Poisoning & Venomous Bites',
            cta_text='Register Now',
            cta_link='#registration',
            is_active=True
        )
        print("Seeded default Hero banner.")

    # 5. Create Speakers
    if not Speaker.objects.exists():
        speakers = [
            ('Dr. Rajesh V. Iyer', 'Professor & Head of Critical Care, Apex Hospital', 'Renowned emergency medical pioneer with over 25 years of experience in managing pesticide exposure and snakebite cases.'),
            ('Dr. Sarah Sterling', 'Lead Toxicologist, London Forensic Unit', 'Expert in clinical pharmacology and designer of national antidote registry guidelines. Visiting lecturer at Oxford.'),
            ('Prof. Amit Kumar', 'Director of Clinical Pharmacology, IMS', 'Researcher of novel chelating agents and author of the Clinical Toxicology Handbook for Emergency Doctors.')
        ]
        for name, des, desc in speakers:
            Speaker.objects.create(name=name, designation=des, description=desc)
        print("Seeded default speakers list.")

    # 6. Create Sponsors
    if not Sponsor.objects.exists():
        sponsors = ['Lumina Pharma', 'Biomed Antidotes', 'CareFirst Diagnostics']
        for name in sponsors:
            # Note: image fields will be blank but the UI can show nice logo text/fallbacks
            Sponsor.objects.create(name=name)
        print("Seeded default sponsors list.")

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_db()
