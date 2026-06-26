from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegistrationFormViewSet,
    RegistrationFieldViewSet,
    RegistrationViewSet,
    RegistrationSubmitView,
    SimulatePaymentCallbackView,
    PayUWebhookCallbackView,
    RegistrationReceiptDownloadView,
    PaymentListView,
    PayUDebugView,
    MarkPaymentSuccessView,
    EasebuzzWebhookCallbackView,
    ResendConfirmationEmailView
)

router = DefaultRouter()
router.register('forms', RegistrationFormViewSet, basename='form')
router.register('fields', RegistrationFieldViewSet, basename='field')
router.register('submissions', RegistrationViewSet, basename='submission')

urlpatterns = [
    path('submit/', RegistrationSubmitView.as_view(), name='registration_submit'),
    path('payment/simulate-callback/', SimulatePaymentCallbackView.as_view(), name='payment_simulate_callback'),
    path('payment/payu-callback/', PayUWebhookCallbackView.as_view(), name='payment_payu_callback'),
    path('payment/easebuzz-callback/', EasebuzzWebhookCallbackView.as_view(), name='payment_easebuzz_callback'),
    path('payment/tracking/', PaymentListView.as_view(), name='payment_tracking'),
    path('payment/<int:pk>/mark-success/', MarkPaymentSuccessView.as_view(), name='mark_payment_success'),
    path('submissions/<int:pk>/resend-email/', ResendConfirmationEmailView.as_view(), name='resend_confirmation_email'),
    path('payment/debug/', PayUDebugView.as_view(), name='payment_debug'),
    path('<int:pk>/receipt/', RegistrationReceiptDownloadView.as_view(), name='registration_receipt_download'),
    path('', include(router.urls)),
]
