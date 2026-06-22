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
            ('Prefix', 'dropdown', True, 'Select title', ['Mr.', 'Ms.', 'Mrs.', 'Dr.'], None, 1),
            ('Full Name', 'text', True, 'Enter your full name', None, None, 2),
            ('Email Address', 'email', True, 'Enter your email address', None, None, 3),
            ('Phone Number (WhatsApp)', 'phone', True, 'e.g. +91 9876543210', None, None, 4),
            ('Designation', 'text', True, 'Enter your designation', None, None, 5),
            ('Institute / Hospital', 'text', True, 'Enter your workplace/college name', None, None, 6),
            ('Department', 'text', True, 'Enter department name', None, None, 7),
            ('Specialty / Department of Practice', 'checkbox', True, None, [
                'Emergency Medicine', 'Clinical Pharmacy', 'Critical Care', 
                'General Medicine', 'Pediatrics', 'Forensic Medicine', 
                'Family Medicine', 'General practitioner', 'Others'
            ], None, 8),
            ('Medical Council Name', 'text', True, 'Enter Medical Council Name', None, None, 9),
            ('Registration Number', 'text', True, 'Enter Registration Number', None, None, 10),
            ('Registration Category', 'radio', True, None, [
                {'value': 'Invited speakers (FREE)', 'price': 0.00, 'link': 'https://ease.buzz/26064ARm0a'},
                {'value': 'Specialist/Consultant (INR 3000)', 'price': 3000.00, 'link': 'https://ease.buzz/2606sGmUAe'},
                {'value': 'Residents/General Practitioners (INR 2000)', 'price': 2000.00, 'link': 'https://ease.buzz/2606srntA0'},
                {'value': 'Students/Interns/Nurses/Clinical Pharmacist/ Paramedics (INR 1000)', 'price': 1000.00, 'link': 'https://ease.buzz/26069HKtYU'}
            ], None, 11),
            ('Food Preference', 'radio', True, None, ['Veg', 'Non-Veg'], None, 12),
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
        if not ProgramContent.objects.filter(key=key).exists():
            ProgramContent.objects.create(key=key, value=val)
            print(f"Seeded default CMS text block for '{key}'.")
        else:
            print(f"CMS text block for '{key}' already exists, skipping.")
    print("Seeded default CMS text blocks.")

    # 4. Create Banners
    if not Banner.objects.exists():
        Banner.objects.create(
            title='12th Annual Clinical Toxicology Symposium',
            subtitle='TOXIQ 2026: Navigating Complex Poisoning & Venomous Bites',
            image='banners/media__1782138882664.jpg',
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
