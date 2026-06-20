from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)
from django.core.files.storage import default_storage
from django.conf import settings
from django.http import FileResponse, HttpResponseRedirect
import json
import uuid

from .models import RegistrationForm, RegistrationField, Registration, Payment
from .serializers import (
    RegistrationFormSerializer,
    RegistrationFieldSerializer,
    RegistrationSerializer,
    PaymentSerializer,
    RegistrationSubmitSerializer
)
from .payu_service import PayUService
from .services import process_successful_payment
from .receipt import generate_receipt_pdf
from authentication.permissions import IsAdminUserRole

class RegistrationFormViewSet(viewsets.ModelViewSet):
    queryset = RegistrationForm.objects.all()
    serializer_class = RegistrationFormSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'active']:
            return [permissions.AllowAny()]
        return [IsAdminUserRole()]

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Get the active registration form.
        """
        form = RegistrationForm.objects.filter(is_active=True).first()
        if not form:
            # Create a default form if none exists
            form = RegistrationForm.objects.create(
                title='TOXIQ Program Registration Form',
                fee_amount=500.00,
                currency='INR',
                is_active=True
            )
            # Prefix dropdown
            RegistrationField.objects.create(
                form=form, label='Prefix', field_type='dropdown', options=['Mr.', 'Ms.', 'Mrs.', 'Dr.'], is_required=True, order=1
            )
            # Full Name
            RegistrationField.objects.create(
                form=form, label='Full Name', field_type='text', is_required=True, order=2
            )
            # Email Address
            RegistrationField.objects.create(
                form=form, label='Email Address', field_type='email', is_required=True, order=3
            )
            # Phone Number
            RegistrationField.objects.create(
                form=form, label='Phone Number (WhatsApp)', field_type='phone', is_required=True, order=4
            )
            # Designation
            RegistrationField.objects.create(
                form=form, label='Designation', field_type='text', is_required=True, order=5
            )
            # Institute / Hospital
            RegistrationField.objects.create(
                form=form, label='Institute / Hospital', field_type='text', is_required=True, order=6
            )
            # Department
            RegistrationField.objects.create(
                form=form, label='Department', field_type='text', is_required=True, order=7
            )
            # Specialty
            RegistrationField.objects.create(
                form=form, 
                label='Specialty / Department of Practice', 
                field_type='checkbox', 
                options=[
                    'Emergency Medicine', 'Clinical Pharmacy', 'Critical Care', 
                    'General Medicine', 'Pediatrics', 'Forensic Medicine', 
                    'Family Medicine', 'General practitioner', 'Others'
                ], 
                is_required=True, 
                order=8
            )
            # Registration Category
            RegistrationField.objects.create(
                form=form, 
                label='Registration Category', 
                field_type='checkbox', 
                options=[
                    {'value': 'Invited speakers', 'price': 0.00},
                    {'value': 'Specialist/Consultant', 'price': 500.00},
                    {'value': 'Residents/General Practitioners', 'price': 400.00},
                    {'value': 'Students/Interns/Nurses/Clinical Pharmacist/ Paramedics', 'price': 300.00}
                ], 
                is_required=True, 
                order=9
            )
            # Medical Council Name
            RegistrationField.objects.create(
                form=form, label='Medical Council Name', field_type='text', is_required=True, order=10
            )
            # Food Preference
            RegistrationField.objects.create(
                form=form, label='Food Preference', field_type='radio', options=['Veg', 'Non-Veg'], is_required=True, order=11
            )
            
        serializer = self.get_serializer(form)
        return Response(serializer.data)

class RegistrationFieldViewSet(viewsets.ModelViewSet):
    queryset = RegistrationField.objects.all()
    serializer_class = RegistrationFieldSerializer
    permission_classes = [IsAdminUserRole]

    def perform_create(self, serializer):
        # Default to active form if not explicitly provided
        form_id = self.request.data.get('form')
        if not form_id:
            active_form = RegistrationForm.objects.filter(is_active=True).first()
            if active_form:
                serializer.save(form=active_form)
                return
        serializer.save()

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all().order_by('-created_at')
    serializer_class = RegistrationSerializer
    
    def get_permissions(self):
        # Admin gets everything, public can retrieve their own (requires registration_id)
        if self.action in ['list', 'update', 'partial_update', 'destroy']:
            return [IsAdminUserRole()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        # Filtering for Admin Panel
        queryset = Registration.objects.all().order_by('-created_at')
        if not (self.request.user and self.request.user.is_authenticated and (self.request.user.role in ['ADMIN', 'SUPER_ADMIN'] or self.request.user.is_staff)):
            # Public can query their own by registration_id passed in parameters
            reg_id = self.request.query_params.get('registration_id')
            if reg_id:
                return queryset.filter(registration_id=reg_id)
            return queryset.none()
            
        # Admin Filters
        status_filter = self.request.query_params.get('payment_status')
        search_query = self.request.query_params.get('search')
        
        if status_filter:
            queryset = queryset.filter(payments__payment_status=status_filter).distinct()
        if search_query:
            queryset = queryset.filter(
                participant_name__icontains=search_query
            ) | queryset.filter(
                participant_email__icontains=search_query
            ) | queryset.filter(
                registration_id__icontains=search_query
            ) | queryset.filter(
                participant_phone__icontains=search_query
            )
            
        return queryset

class RegistrationSubmitView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Since files are uploaded, request.data is a QueryDict (multipart/form-data)
        # Parse field_data JSON from string
        field_data_str = request.data.get('field_data', '{}')
        try:
            field_data = json.loads(field_data_str) if isinstance(field_data_str, str) else field_data_str
        except ValueError:
            return Response({"error": "Invalid field_data JSON format"}, status=status.HTTP_400_BAD_REQUEST)
            
        form_id = request.data.get('form_id')
        if not form_id:
            active_form = RegistrationForm.objects.filter(is_active=True).first()
            form_id = active_form.id if active_form else None
            
        # Process uploaded files
        for file_key, file_obj in request.FILES.items():
            # file_key will be like 'field_5' representing RegistrationField ID 5
            # Save file to local disk
            filename = f"registration_uploads/{uuid.uuid4()}_{file_obj.name}"
            saved_path = default_storage.save(filename, file_obj)
            file_url = settings.MEDIA_URL + saved_path
            
            # Extract field ID from file_key (e.g. 'field_5' -> '5')
            field_id = file_key.replace('field_', '')
            field_data[field_id] = {
                'url': file_url,
                'name': file_obj.name,
                'size': file_obj.size
            }

        # Validate with serializer
        serializer = RegistrationSubmitSerializer(data={
            'form_id': form_id,
            'field_data': field_data
        })
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        registration = serializer.save()
        
        # Calculate fee
        import decimal
        form = registration.form
        base_fee = float(form.fee_amount)
        
        # Check if there's any custom option fee selected
        field_answers = registration.field_data or {}
        custom_fee = None
        
        for field in form.fields.all():
            if field.field_type in ['checkbox', 'radio', 'dropdown'] and field.options:
                val = field_answers.get(str(field.id))
                if val:
                    for opt in field.options:
                        if isinstance(opt, dict) and 'value' in opt and 'price' in opt and opt['price'] is not None:
                            is_selected = False
                            if isinstance(val, list):
                                is_selected = opt['value'] in val
                            else:
                                is_selected = str(val) == str(opt['value'])
                                
                            if is_selected:
                                custom_fee = float(opt['price'])
                                break
                    if custom_fee is not None:
                        break
                        
        amount = decimal.Decimal(str(custom_fee)) if custom_fee is not None else form.fee_amount
        if form.tax_percentage > 0:
            amount += amount * (form.tax_percentage / 100)
            
        # Create a unique transaction ID
        txnid = f"TXN{uuid.uuid4().hex[:12].upper()}"
        
        # Save a pending Payment record
        payment = Payment.objects.create(
            registration=registration,
            transaction_id=txnid,
            amount=amount,
            currency=form.currency,
            payment_status='PENDING'
        )
        
        # Generate PayU checkout hashes
        hash_val = PayUService.generate_hash(
            txnid=txnid,
            amount=amount,
            productinfo=form.title,
            firstname=registration.participant_name or 'Participant',
            email=registration.participant_email or 'no-email@hospital.com'
        )
        
        checkout_details = {
            'key': settings.PAYU_MERCHANT_KEY,
            'txnid': txnid,
            'amount': f"{float(amount):.2f}",
            'productinfo': form.title,
            'firstname': registration.participant_name or 'Participant',
            'email': registration.participant_email or 'no-email@hospital.com',
            'phone': registration.participant_phone or '9999999999',
            'surl': f"{request.build_absolute_uri('/api/payment/payu-callback/')}",
            'furl': f"{request.build_absolute_uri('/api/payment/payu-callback/')}",
            'service_provider': 'payu_paisa',
            'hash': hash_val,
            'action': PayUService.get_payment_url(),
            'registration_id_temp': registration.id  # helper for local tracking
        }

        # Log the payment payload before redirecting
        payload = {
            "key": checkout_details['key'],
            "txnid": checkout_details['txnid'],
            "amount": checkout_details['amount'],
            "productinfo": checkout_details['productinfo'],
            "firstname": checkout_details['firstname'],
            "email": checkout_details['email'],
            "phone": checkout_details['phone'],
            "surl": checkout_details['surl'],
            "furl": checkout_details['furl'],
            "service_provider": checkout_details['service_provider'],
            "hash": checkout_details['hash']
        }
        logger.warning("PAYU PAYMENT PAYLOAD")
        logger.warning(payload)
        
        return Response({
            'registration': RegistrationSerializer(registration).data,
            'payment': PaymentSerializer(payment).data,
            'checkout': checkout_details
        }, status=status.HTTP_201_CREATED)

class SimulatePaymentCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        txnid = request.data.get('txnid')
        payment_status = request.data.get('status')  # 'success' or 'failed'
        
        try:
            payment = Payment.objects.get(transaction_id=txnid)
        except Payment.DoesNotExist:
            return Response({"error": f"Payment with transaction ID {txnid} not found."}, status=status.HTTP_404_NOT_FOUND)
            
        if payment.payment_status != 'PENDING':
            return Response({
                "message": "Payment has already been processed.",
                "registration_id": payment.registration.registration_id,
                "status": payment.payment_status
            }, status=status.HTTP_200_OK)
            
        if payment_status == 'success':
            # Successful payment updates registration, generates ID, receipt, sends email
            registration = process_successful_payment(payment, gateway_response=request.data)
            return Response({
                "message": "Payment simulated successfully.",
                "registration_id": registration.registration_id,
                "status": "SUCCESS"
            }, status=status.HTTP_200_OK)
        else:
            payment.payment_status = 'FAILED'
            payment.gateway_response = request.data
            payment.save()
            return Response({
                "message": "Payment simulated as FAILED.",
                "status": "FAILED"
            }, status=status.HTTP_200_OK)

class PayUWebhookCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Receives standard redirection POST from PayU gateway, processes payment,
        and redirects user's browser back to the React success or failure page.
        """
        # Validate hash received
        if not PayUService.verify_response_hash(request.data):
            redirect_url = f"{settings.FRONTEND_URL}/registration?error=invalid_hash"
            return HttpResponseRedirect(redirect_url)
            
        txnid = request.data.get('txnid')
        status_str = request.data.get('status') # 'success' or 'failure'
        
        try:
            payment = Payment.objects.get(transaction_id=txnid)
        except Payment.DoesNotExist:
            redirect_url = f"{settings.FRONTEND_URL}/registration?error=transaction_not_found&txnid={txnid}"
            return HttpResponseRedirect(redirect_url)
            
        registration = payment.registration
        
        if payment.payment_status == 'PENDING':
            if status_str == 'success':
                registration = process_successful_payment(payment, gateway_response=request.data)
            else:
                payment.payment_status = 'FAILED'
                payment.gateway_response = request.data
                payment.save()

        # Build redirection URL
        if payment.payment_status == 'SUCCESS':
            redirect_url = (
                f"{settings.FRONTEND_URL}/registration/success"
                f"?txnid={payment.transaction_id}"
                f"&registration_id={registration.registration_id}"
                f"&registration_db_id={registration.id}"
                f"&amount={float(payment.amount):.2f}"
            )
        else:
            redirect_url = f"{settings.FRONTEND_URL}/registration?error=payment_failed&txnid={payment.transaction_id}"
            
        return HttpResponseRedirect(redirect_url)

class RegistrationReceiptDownloadView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            registration = Registration.objects.get(id=pk)
        except Registration.DoesNotExist:
            return Response({"error": "Registration not found"}, status=status.HTTP_404_NOT_FOUND)
            
        payment = registration.payments.filter(payment_status='SUCCESS').first()
        if not payment:
            payment = registration.payments.first()
            
        if not payment:
            return Response({"error": "No payment records found for this registration"}, status=status.HTTP_400_BAD_REQUEST)
            
        pdf_buffer = generate_receipt_pdf(registration, payment)
        response = FileResponse(pdf_buffer, content_type='application/pdf')
        filename = f"TOXIQ_Receipt_{registration.registration_id or 'PENDING'}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

class PaymentListView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        payments = Payment.objects.all().order_by('-created_at')
        
        # Filters
        status_filter = request.query_params.get('status')
        search_query = request.query_params.get('search')
        
        if status_filter:
            payments = payments.filter(payment_status=status_filter)
        if search_query:
            payments = payments.filter(transaction_id__icontains=search_query) | payments.filter(registration__participant_name__icontains=search_query)
            
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

class PayUDebugView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"detail": "You must be a superuser to access this endpoint."}, status=status.HTTP_403_FORBIDDEN)
        
        # Test hash generation
        test_hash = PayUService.generate_hash(
            txnid="TXN9D61ECE61B27",
            amount=500.00,
            productinfo="TOXIQ Program Registration Form",
            firstname="test",
            email="testing@gmail.com"
        )
        
        return Response({
            "sandbox": settings.PAYU_SANDBOX,
            "payment_url": PayUService.get_payment_url(),
            "merchant_key": settings.PAYU_MERCHANT_KEY,
            "hash_test": test_hash
        }, status=status.HTTP_200_OK)

