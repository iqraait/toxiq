from django.db import transaction
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Registration, Payment
from .receipt import generate_receipt_pdf
import logging

logger = logging.getLogger(__name__)

def send_registration_email(registration, payment, pdf_buffer):
    """
    Sends the confirmation email to the participant with the PDF receipt attached.
    """
    subject = "TOXIQ Program Registration Successful"
    body = f"""Dear Participant,

Thank you for registering for the TOXIQ Program.

Your Registration ID:
{registration.registration_id}

Payment Status:
Successful

Please keep this Registration ID for future reference.

Regards,
TOXIQ Program Team"""

    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'toxiq-program@hospital.com')
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=[registration.participant_email]
    )
    
    # Attach PDF
    email.attach(
        filename=f"TOXIQ_Receipt_{registration.registration_id}.pdf",
        content=pdf_buffer.getvalue(),
        mimetype="application/pdf"
    )
    
    try:
        email.send(fail_silently=False)
        logger.info(f"Successfully sent confirmation email to {registration.participant_email}")
    except Exception as e:
        logger.error(f"Error sending email to {registration.participant_email}: {e}")
        # We don't crash the transaction if email fails, but we log the incident.

def process_successful_payment(payment, gateway_response=None):
    """
    Core function to process successful payment.
    Ensures safe, concurrent, sequential registration ID assignment.
    """
    # 1. atomic block to lock rows
    with transaction.atomic():
        # Get registration and lock row
        registration = Registration.objects.select_for_update().get(id=payment.registration.id)
        
        # Check if already processed
        if registration.registration_id:
            logger.info(f"Registration {registration.id} already processed with ID {registration.registration_id}")
            return registration
            
        # Get current count of successful registrations to generate sequential ID
        success_count = Registration.objects.filter(registration_id__isnull=False).count()
        new_reg_id = f"TOXIQ{success_count + 1:04d}"
        
        # Update registration details
        registration.registration_id = new_reg_id
        registration.save()
        
        # Update payment details
        payment.payment_status = 'SUCCESS'
        if gateway_response:
            payment.gateway_response = gateway_response
        payment.save()
        
        # 2. Generate Receipt PDF
        pdf_buffer = generate_receipt_pdf(registration, payment)
        
        # 3. Email receipt to participant
        send_registration_email(registration, payment, pdf_buffer)
        
        return registration
