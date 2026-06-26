from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from registration.models import RegistrationForm, RegistrationField, Registration, Payment
from registration.services import process_successful_payment
import decimal
import json

User = get_user_model()

class RegistrationSystemTests(TestCase):
    def setUp(self):
        # Create a form
        self.form = RegistrationForm.objects.create(
            title="Test Form",
            fee_amount=decimal.Decimal('100.00'),
            tax_percentage=decimal.Decimal('10.00'),
            is_active=True
        )
        
        # Create fields
        self.field_name = RegistrationField.objects.create(
            form=self.form,
            label="Name",
            field_type="text",
            is_required=True,
            order=1
        )
        self.field_email = RegistrationField.objects.create(
            form=self.form,
            label="Email",
            field_type="email",
            is_required=True,
            order=2
        )

    def test_registration_creation_and_payment_flow(self):
        """
        Verify that a pending registration can be created, a payment logged, 
        and upon success, a sequential ID is assigned.
        """
        # 1. Create a pending registration
        reg1 = Registration.objects.create(
            form=self.form,
            participant_name="Alice Smith",
            participant_email="alice@test.com",
            participant_phone="+919876543210",
            field_data={
                str(self.field_name.id): "Alice Smith",
                str(self.field_email.id): "alice@test.com"
            }
        )
        
        # Verify it has no registration ID yet
        self.assertNil = self.assertIsNone(reg1.registration_id)

        # 2. Create a pending payment
        pay1 = Payment.objects.create(
            registration=reg1,
            transaction_id="TXNTEST001",
            amount=decimal.Decimal('110.00'),
            currency="INR",
            payment_status="PENDING"
        )
        
        # 3. Simulate successful payment processing
        process_successful_payment(pay1, gateway_response={"status": "success", "txnid": "TXNTEST001"})
        
        # Refresh from database
        reg1.refresh_from_db()
        pay1.refresh_from_db()
        
        # Assertions
        self.assertEqual(reg1.registration_id, "TOXIQ0001")
        self.assertEqual(pay1.payment_status, "SUCCESS")

        # 4. Process a second registration to verify sequential numbering
        reg2 = Registration.objects.create(
            form=self.form,
            participant_name="Bob Jones",
            participant_email="bob@test.com",
            field_data={
                str(self.field_name.id): "Bob Jones",
                str(self.field_email.id): "bob@test.com"
            }
        )
        pay2 = Payment.objects.create(
            registration=reg2,
            transaction_id="TXNTEST002",
            amount=decimal.Decimal('110.00'),
            currency="INR",
            payment_status="PENDING"
        )
        
        process_successful_payment(pay2, gateway_response={"status": "success", "txnid": "TXNTEST002"})
        
        reg2.refresh_from_db()
        self.assertEqual(reg2.registration_id, "TOXIQ0002")

    def test_registration_with_custom_category_fees(self):
        """
        Verify that selecting an option with a custom price calculates
        and persists the correct amount on the backend.
        """
        # Create a field with custom price options
        field_category = RegistrationField.objects.create(
            form=self.form,
            label="Registration Category",
            field_type="checkbox",
            options=[
                {"value": "Invited speakers", "price": 0.00},
                {"value": "Specialist/Consultant", "price": 500.00},
                {"value": "Residents/General Practitioners", "price": 400.00}
            ],
            is_required=True,
            order=3
        )
        
        # Test case 1: Specialist/Consultant (price = 500.00, tax = 10%)
        # Total expected amount = 500.00 + 10% = 550.00
        response = self.client.post('/api/registration/submit/', {
            'form_id': self.form.id,
            'field_data': json.dumps({
                str(self.field_name.id): "Alice Smith",
                str(self.field_email.id): "alice@test.com",
                str(field_category.id): ["Specialist/Consultant"]
            })
        })
        
        self.assertEqual(response.status_code, 201)
        data = response.json()
        payment_data = data['payment']
        self.assertEqual(float(payment_data['amount']), 550.00)
        
        # Test case 2: Invited speakers (price = 0.00, tax = 10%)
        # Total expected amount = 0.00 + 10% = 0.00
        response2 = self.client.post('/api/registration/submit/', {
            'form_id': self.form.id,
            'field_data': json.dumps({
                str(self.field_name.id): "Bob Jones",
                str(self.field_email.id): "bob@test.com",
                str(field_category.id): ["Invited speakers"]
            })
        })
        
        self.assertEqual(response2.status_code, 201)
        data2 = response2.json()
        payment_data2 = data2['payment']
        self.assertEqual(float(payment_data2['amount']), 0.00)
        self.assertEqual(payment_data2['payment_status'], 'SUCCESS')
        self.assertTrue(data2.get('free'))
        
        # Test case 3: Option without custom price (should fallback to default fee_amount = 100.00)
        # Total expected amount = 100.00 + 10% = 110.00
        field_category_no_price = RegistrationField.objects.create(
            form=self.form,
            label="Practice",
            field_type="dropdown",
            options=["General"],
            is_required=True,
            order=4
        )
        
        # Delete field_category first to test pure fallback
        field_category.delete()
        
        response3 = self.client.post('/api/registration/submit/', {
            'form_id': self.form.id,
            'field_data': json.dumps({
                str(self.field_name.id): "Charlie Brown",
                str(self.field_email.id): "charlie@test.com",
                str(field_category_no_price.id): "General"
            })
        })
        self.assertEqual(response3.status_code, 201)
        data3 = response3.json()
        payment_data3 = data3['payment']
        self.assertEqual(float(payment_data3['amount']), 110.00)
