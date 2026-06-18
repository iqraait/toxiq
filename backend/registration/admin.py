from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import RegistrationForm, RegistrationField, Registration, Payment

@admin.register(RegistrationForm)
class RegistrationFormAdmin(ModelAdmin):
    list_display = ('title', 'fee_amount', 'currency', 'tax_percentage', 'is_active')
    list_filter = ('is_active',)

@admin.register(RegistrationField)
class RegistrationFieldAdmin(ModelAdmin):
    list_display = ('label', 'field_type', 'is_required', 'order', 'form')
    list_filter = ('field_type', 'is_required', 'form')
    search_fields = ('label', 'placeholder')

class PaymentInline(TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ('transaction_id', 'amount', 'currency', 'payment_status', 'payment_mode', 'created_at')

@admin.register(Registration)
class RegistrationAdmin(ModelAdmin):
    list_display = ('registration_id', 'participant_name', 'participant_email', 'participant_phone', 'created_at')
    search_fields = ('registration_id', 'participant_name', 'participant_email', 'participant_phone')
    inlines = [PaymentInline]

@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = ('transaction_id', 'registration', 'amount', 'payment_status', 'payment_mode', 'created_at')
    list_filter = ('payment_status', 'payment_mode')
    search_fields = ('transaction_id', 'registration__participant_name', 'registration__registration_id')
