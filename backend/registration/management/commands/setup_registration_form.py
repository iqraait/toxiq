from django.core.management.base import BaseCommand
from registration.models import RegistrationForm, RegistrationField

class Command(BaseCommand):
    help = 'Setup/reset the active registration form fields to match the required schema'

    def handle(self, *args, **options):
        form = RegistrationForm.objects.filter(is_active=True).first()
        if not form:
            form = RegistrationForm.objects.create(
                title='TOXIQ Program Registration Form',
                fee_amount=500.00,
                currency='INR',
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS('Created active registration form.'))
        
        # Clear existing fields
        form.fields.all().delete()
        
        # New field definitions
        fields_config = [
            {'label': 'Prefix', 'field_type': 'dropdown', 'options': ['Mr.', 'Ms.', 'Mrs.', 'Dr.'], 'is_required': True, 'order': 1},
            {'label': 'Full Name', 'field_type': 'text', 'is_required': True, 'order': 2},
            {'label': 'Email Address', 'field_type': 'email', 'is_required': True, 'order': 3},
            {'label': 'Phone Number (WhatsApp)', 'field_type': 'phone', 'is_required': True, 'order': 4},
            {'label': 'Designation', 'field_type': 'text', 'is_required': True, 'order': 5},
            {'label': 'Institute / Hospital', 'field_type': 'text', 'is_required': True, 'order': 6},
            {
                'label': 'Specialty / Department of Practice', 
                'field_type': 'checkbox', 
                'options': [
                    'Emergency Medicine', 'Clinical Pharmacy', 'Critical Care', 
                    'General Medicine', 'Pediatrics', 'Forensic Medicine', 
                    'Family Medicine', 'General practitioner', 'Others'
                ], 
                'is_required': True, 
                'order': 7
            },
            {
                'label': 'Registration Category', 
                'field_type': 'checkbox', 
                'options': [
                    {'value': 'Invited Speakers', 'price': 0.00, 'link': 'https://ease.buzz/26064ARm0a'},
                    {'value': 'Specialist/Consultant', 'price': 3000.00, 'link': 'https://ease.buzz/2606sGmUAe'},
                    {'value': 'Residents/General Practitioners', 'price': 2000.00, 'link': 'https://ease.buzz/2606srntA0'},
                    {'value': 'Students/Interns/Nurses/Clinical Pharmacists/Paramedics', 'price': 1000.00, 'link': 'https://ease.buzz/26069HKtYU'}
                ], 
                'is_required': True, 
                'order': 8
            },
            {'label': 'Medical Council Name', 'field_type': 'text', 'is_required': False, 'order': 9},
            {'label': 'Registration No:', 'field_type': 'number', 'is_required': False, 'order': 10},
            {'label': 'Food Preference', 'field_type': 'radio', 'options': ['Veg', 'Non-Veg'], 'is_required': True, 'order': 11}
        ]

        for config in fields_config:
            RegistrationField.objects.create(form=form, **config)
            
        self.stdout.write(self.style.SUCCESS('Registration form fields successfully set up.'))
