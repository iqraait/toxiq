from rest_framework import serializers
from .models import ArticleSubmission
from registration.models import Registration
from registration.serializers import RegistrationSerializer

class ArticleSubmissionSerializer(serializers.ModelSerializer):
    registration_id = serializers.CharField(write_only=True)
    registration = RegistrationSerializer(read_only=True)

    class Meta:
        model = ArticleSubmission
        fields = (
            'id', 
            'registration_id', 
            'registration', 
            'author_name', 
            'email', 
            'article_title', 
            'remarks', 
            'file', 
            'status', 
            'admin_remarks', 
            'submitted_date', 
            'updated_at'
        )
        read_only_fields = ('id', 'status', 'admin_remarks', 'submitted_date', 'updated_at', 'registration')

    def validate_registration_id(self, value):
        # 1. Look up registration
        try:
            registration = Registration.objects.get(registration_id=value)
        except Registration.DoesNotExist:
            raise serializers.ValidationError("Registration ID not found. Only registered participants can submit articles.")
            
        # 2. Confirm successful payment
        has_success_payment = registration.payments.filter(payment_status='SUCCESS').exists()
        if not has_success_payment:
            raise serializers.ValidationError("This registration ID does not have a successful payment completed.")
            
        return registration

    def create(self, validated_data):
        # Map validated registration object
        registration = validated_data.pop('registration_id')
        article = ArticleSubmission.objects.create(registration=registration, **validated_data)
        return article

class ArticleReviewSerializer(serializers.ModelSerializer):
    """
    Serializer used by Admin to update article status and remarks.
    """
    class Meta:
        model = ArticleSubmission
        fields = ('status', 'admin_remarks')
