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
    subject = "Registration Confirmed – TOXIQ'26: National Conference on Clinical Toxicology"
    body = f"""Dear Participant,

Thank you for registering for TOXIQ'26! 

Your Registration ID is: {registration.registration_id}
Your payment has been successfully verified, and your official PDF receipt is attached to this email.

--------------------------------------------------

We are delighted to welcome you to TOXIQ'26, a two-day scientific conference dedicated to advancing knowledge and practice in Clinical Toxicology.

Theme: Every poisoning case is a race against time. Every decision can save a life.

Join us for an engaging academic experience where science meets bedside practice through cutting-edge research, challenging case discussions, and the latest advances in the diagnosis and management of poisoned patients.

Conference Details:
- Dates: 1–2 August 2026
- Venue: Gender Park, Calicut

Highlights of TOXIQ'26:
- Renowned National Faculty
- Challenging Real-Life Toxicology Cases
- Latest Evidence & Clinical Updates
- Interactive Panel Discussions
- Scientific Poster Presentations
- Networking Opportunities with Healthcare Professionals
- Practical learning that directly enhances patient care

Website: https://www.toxiq26iqraa.com/

For enquiries:
- Phone: +91 8137 001 900
- Email: toxiq26@iqraahospital.in

We look forward to welcoming you to Calicut!

Warm regards,
Organizing Committee
TOXIQ'26"""

    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'toxiq26iqraa@gmail.com')
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
        # Find the maximum existing registration ID and generate the next sequential ID
        import re
        last_reg = Registration.objects.filter(registration_id__isnull=False).order_by('-registration_id').first()
        if last_reg:
            num_str = re.sub(r'^\D+', '', last_reg.registration_id)
            last_num = int(num_str) if num_str else 0
            new_num = last_num + 1
        else:
            new_num = 1
            
        new_reg_id = f"TOXIQ{new_num:04d}"
        
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
