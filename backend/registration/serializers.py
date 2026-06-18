from rest_framework import serializers
from .models import RegistrationForm, RegistrationField, Registration, Payment
from django.core.files.storage import default_storage
import re

class RegistrationFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationField
        fields = ('id', 'label', 'field_type', 'is_required', 'placeholder', 'help_text', 'options', 'validation_rules', 'order')

class RegistrationFormSerializer(serializers.ModelSerializer):
    fields = RegistrationFieldSerializer(many=True, read_only=True)
    
    class Meta:
        model = RegistrationForm
        fields = ('id', 'title', 'instructions', 'fee_amount', 'currency', 'tax_percentage', 'is_active', 'fields')

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'transaction_id', 'amount', 'currency', 'payment_status', 'payment_mode', 'created_at', 'updated_at')

class RegistrationSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Registration
        fields = ('id', 'registration_id', 'participant_name', 'participant_email', 'participant_phone', 'field_data', 'created_at', 'payments')
        read_only_fields = ('id', 'registration_id', 'created_at')

class RegistrationSubmitSerializer(serializers.Serializer):
    """
    Serializer used for validating public registrations.
    Validates dynamic form answers and creates the models.
    """
    form_id = serializers.IntegerField()
    field_data = serializers.JSONField(default=dict)

    def validate(self, data):
        form_id = data.get('form_id')
        try:
            form = RegistrationForm.objects.get(id=form_id, is_active=True)
        except RegistrationForm.DoesNotExist:
            raise serializers.ValidationError({"form_id": "Active registration form not found."})

        field_answers = data.get('field_data', {})
        if not isinstance(field_answers, dict):
            raise serializers.ValidationError({"field_data": "Field answers must be a key-value object."})

        # Fetch form fields
        fields = form.fields.all()
        errors = {}

        # Validate each field
        for field in fields:
            key = str(field.id)
            val = field_answers.get(key)

            # Check if required
            if field.is_required and (val is None or val == '' or (isinstance(val, list) and len(val) == 0)):
                errors[field.label] = f"This field is required."
                continue

            if val is not None and val != '':
                # Specific validation by type
                if field.field_type == 'email':
                    # Email pattern
                    if not re.match(r"[^@]+@[^@]+\.[^@]+", str(val)):
                        errors[field.label] = "Invalid email address format."
                elif field.field_type == 'number':
                    try:
                        float(val)
                    except ValueError:
                        errors[field.label] = "Value must be a number."
                elif field.field_type == 'phone':
                    # Basic phone pattern
                    if not re.match(r"^\+?[0-9\s\-]{7,15}$", str(val)):
                        errors[field.label] = "Invalid phone number format."

        if errors:
            raise serializers.ValidationError(errors)

        data['form'] = form
        return data

    def create(self, validated_data):
        form = validated_data['form']
        field_data = validated_data['field_data']

        # Extract cached participant info for easy sorting/searching
        participant_name = ""
        participant_email = ""
        participant_phone = ""

        # Let's inspect fields to auto-populate cached properties
        for field in form.fields.all():
            key = str(field.id)
            val = field_data.get(key)
            if val:
                label_lower = field.label.lower()
                if not participant_name and ('name' in label_lower or 'fullname' in label_lower):
                    participant_name = str(val)
                elif not participant_email and (field.field_type == 'email' or 'email' in label_lower):
                    participant_email = str(val)
                elif not participant_phone and (field.field_type == 'phone' or 'phone' in label_lower or 'mobile' in label_lower or 'contact' in label_lower):
                    participant_phone = str(val)

        # Fallback if no matching label is found
        if not participant_name:
            # Grab first string field
            for field in form.fields.all():
                if field.field_type in ['text', 'email']:
                    participant_name = str(field_data.get(str(field.id), ''))
                    break
        if not participant_email:
            for field in form.fields.all():
                if field.field_type == 'email':
                    participant_email = str(field_data.get(str(field.id), ''))
                    break
        if not participant_phone:
            for field in form.fields.all():
                if field.field_type == 'phone':
                    participant_phone = str(field_data.get(str(field.id), ''))
                    break

        registration = Registration.objects.create(
            form=form,
            participant_name=participant_name,
            participant_email=participant_email,
            participant_phone=participant_phone,
            field_data=field_data
        )
        return registration
