import base64
from rest_framework import serializers
from .models import ProgramContent, Banner, Speaker, Sponsor, GalleryImage, Brochure, SiteSettings

class Base64FileSerializerField(serializers.Field):
    """
    A custom serializer field to handle file uploads as Base64 strings.
    If the incoming data is a file (has read method), it converts it to a base64 Data URI.
    If it is a string (starts with data: or http), it leaves it as-is.
    """
    def to_internal_value(self, data):
        if not data:
            return None
        # If it's a file upload object (like InMemoryUploadedFile or TemporaryUploadedFile)
        if hasattr(data, 'read'):
            try:
                data.seek(0)
                file_bytes = data.read()
                encoded = base64.b64encode(file_bytes).decode('utf-8')
                mime_type = getattr(data, 'content_type', 'application/octet-stream')
                return f"data:{mime_type};base64,{encoded}"
            except Exception as e:
                raise serializers.ValidationError(f"Failed to encode file to base64: {str(e)}")
        # If it's already a string, keep it as-is
        if isinstance(data, str):
            return data
        return None

    def to_representation(self, value):
        return value

class ProgramContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramContent
        fields = ('id', 'key', 'value', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class BannerSerializer(serializers.ModelSerializer):
    image = Base64FileSerializerField(required=False, allow_null=True)
    
    class Meta:
        model = Banner
        fields = ('id', 'title', 'subtitle', 'image', 'cta_text', 'cta_link', 'is_active', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class SpeakerSerializer(serializers.ModelSerializer):
    photo = Base64FileSerializerField(required=False, allow_null=True)
    
    class Meta:
        model = Speaker
        fields = ('id', 'name', 'designation', 'description', 'photo', 'order', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class SponsorSerializer(serializers.ModelSerializer):
    logo = Base64FileSerializerField(required=False, allow_null=True)
    
    class Meta:
        model = Sponsor
        fields = ('id', 'name', 'logo', 'website_url', 'order', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class GalleryImageSerializer(serializers.ModelSerializer):
    image = Base64FileSerializerField(required=False, allow_null=True)
    
    class Meta:
        model = GalleryImage
        fields = ('id', 'image', 'caption', 'created_at')
        read_only_fields = ('id', 'created_at')

class BrochureSerializer(serializers.ModelSerializer):
    pdf = Base64FileSerializerField(required=False, allow_null=True)
    
    class Meta:
        model = Brochure
        fields = ('id', 'name', 'description', 'pdf', 'created_at')
        read_only_fields = ('id', 'created_at')

class SiteSettingsSerializer(serializers.ModelSerializer):
    logo = Base64FileSerializerField(required=False, allow_null=True)
    registration_banner = Base64FileSerializerField(required=False, allow_null=True)
    
    class Meta:
        model = SiteSettings
        fields = ('id', 'site_name', 'logo', 'registration_banner', 'updated_at')
        read_only_fields = ('id', 'updated_at')

