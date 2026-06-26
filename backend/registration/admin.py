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
    list_display = ('registration_id', 'participant_name', 'participant_email', 'participant_phone', 'payment_status_display', 'created_at')
    search_fields = ('registration_id', 'participant_name', 'participant_email', 'participant_phone')
    actions = ['approve_registrations']
    inlines = [PaymentInline]

    def payment_status_display(self, obj):
        payment = obj.payments.first()
        if payment:
            return payment.payment_status
        return "NO PAYMENT"
    payment_status_display.short_description = 'Payment Status'

    def approve_registrations(self, request, queryset):
        from .services import process_successful_payment
        import uuid
        count = 0
        for registration in queryset:
            if not registration.registration_id:
                # Find the pending payment
                payment = registration.payments.filter(payment_status='PENDING').first()
                if not payment:
                    # Create a default payment if none exists
                    payment = Payment.objects.create(
                        registration=registration,
                        transaction_id=f"MANUAL-{uuid.uuid4().hex[:12].upper()}",
                        amount=registration.form.fee_amount,
                        payment_status='PENDING'
                    )
                process_successful_payment(payment, gateway_response={"marked_as_paid_via_action": request.user.username})
                count += 1
        self.message_user(request, f"Successfully approved {count} registrations and sent confirmation emails.")
    approve_registrations.short_description = "Approve selected registrations (Mark as Paid)"

@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = ('transaction_id', 'registration', 'amount', 'payment_status', 'payment_mode', 'created_at')
    list_filter = ('payment_status', 'payment_mode')
    search_fields = ('transaction_id', 'registration__participant_name', 'registration__registration_id')

    def save_model(self, request, obj, form, change):
        if change and 'payment_status' in form.changed_data and obj.payment_status == 'SUCCESS':
            if not obj.registration.registration_id:
                from .services import process_successful_payment
                gateway_response = obj.gateway_response or {}
                if isinstance(gateway_response, dict):
                    gateway_response['marked_by_admin_via_django'] = request.user.username
                process_successful_payment(obj, gateway_response=gateway_response)
            else:
                super().save_model(request, obj, form, change)
        else:
            super().save_model(request, obj, form, change)
