from django.db import models

class RegistrationForm(models.Model):
    title = models.CharField(max_length=200, default='TOXIQ Program Registration')
    instructions = models.TextField(blank=True, default='Please read all instructions carefully before registration.')
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    currency = models.CharField(max_length=10, default='INR')
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  # Optional GST/Tax
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class RegistrationField(models.Model):
    FIELD_TYPES = (
        ('text', 'Text Field'),
        ('textarea', 'Text Area'),
        ('number', 'Number Field'),
        ('email', 'Email Field'),
        ('phone', 'Phone Field'),
        ('date', 'Date Field'),
        ('radio', 'Radio Buttons'),
        ('dropdown', 'Dropdown Select'),
        ('checkbox', 'Checkbox list'),
        ('file', 'File Upload'),
    )
    form = models.ForeignKey(RegistrationForm, related_name='fields', on_delete=models.CASCADE)
    label = models.CharField(max_length=100)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    is_required = models.BooleanField(default=False)
    placeholder = models.CharField(max_length=200, blank=True, null=True)
    help_text = models.CharField(max_length=200, blank=True, null=True)
    options = models.JSONField(blank=True, null=True, help_text="List of options for selection elements, e.g. ['Male', 'Female']")
    validation_rules = models.JSONField(blank=True, null=True, help_text="Regex patterns, file limits, min/max values")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.label} ({self.field_type})"

class Registration(models.Model):
    form = models.ForeignKey(RegistrationForm, on_delete=models.PROTECT)
    registration_id = models.CharField(max_length=30, unique=True, null=True, blank=True)
    participant_name = models.CharField(max_length=255, blank=True)
    participant_email = models.EmailField(blank=True)
    participant_phone = models.CharField(max_length=20, blank=True)
    field_data = models.JSONField(default=dict, help_text="Dynamic responses stored as json")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.registration_id or 'PENDING'} - {self.participant_name or self.participant_email}"

class Payment(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    )
    registration = models.ForeignKey(Registration, related_name='payments', on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_mode = models.CharField(max_length=50, blank=True, null=True)
    gateway_response = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.payment_status} ({self.amount})"
