import base64
from rest_framework import serializers
from .models import ProgramContent, Banner, Speaker, Sponsor, GalleryImage, Brochure, SiteSettings

class HybridImageField(serializers.ImageField):
    """
    A custom serializer field to handle image uploads as standard files,
    while accepting base64 data URIs and existing media paths for compatibility.
    """
    def to_internal_value(self, data):
        if not data:
            return None
        
        # If it's a string, handle existing URLs/paths or base64 data URIs
        if isinstance(data, str):
            if data.startswith('data:'):
                try:
                    format, imgstr = data.split(';base64,')
                    ext = format.split('/')[-1]
                    import uuid
                    from django.core.files.base import ContentFile
                    return ContentFile(base64.b64decode(imgstr), name=f"{uuid.uuid4()}.{ext}")
                except Exception as e:
                    raise serializers.ValidationError(f"Invalid base64 image: {str(e)}")
            else:
                # Existing URL/path, extract path relative to media
                clean_data = data
                if 'cloudinary.com' in clean_data:
                    import re
                    match = re.search(r'/(?:raw|image|video|files)/upload/(?:v\d+/)?(.*)$', clean_data)
                    if match:
                        clean_data = match.group(1)
                elif 'http' in clean_data or '/media/' in clean_data:
                    parts = clean_data.split('/media/')
                    if len(parts) > 1:
                        clean_data = parts[1]
                return clean_data
                
        return super().to_internal_value(data)

class HybridFileField(serializers.FileField):
    """
    A custom serializer field to handle file/pdf uploads as standard files,
    while accepting base64 data URIs and existing media paths for compatibility.
    """
    def to_internal_value(self, data):
        if not data:
            return None
            
        if isinstance(data, str):
            if data.startswith('data:'):
                try:
                    format, filestr = data.split(';base64,')
                    ext = format.split('/')[-1]
                    import uuid
                    from django.core.files.base import ContentFile
                    return ContentFile(base64.b64decode(filestr), name=f"{uuid.uuid4()}.{ext}")
                except Exception as e:
                    raise serializers.ValidationError(f"Invalid base64 file: {str(e)}")
            else:
                clean_data = data
                if 'cloudinary.com' in clean_data:
                    import re
                    match = re.search(r'/(?:raw|image|video|files)/upload/(?:v\d+/)?(.*)$', clean_data)
                    if match:
                        clean_data = match.group(1)
                elif 'http' in clean_data or '/media/' in clean_data:
                    parts = clean_data.split('/media/')
                    if len(parts) > 1:
                        clean_data = parts[1]
                return clean_data
                
        return super().to_internal_value(data)

class ProgramContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramContent
        fields = ('id', 'key', 'value', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class BannerSerializer(serializers.ModelSerializer):
    image = HybridImageField(required=False, allow_null=True)
    
    class Meta:
        model = Banner
        fields = ('id', 'title', 'subtitle', 'image', 'cta_text', 'cta_link', 'is_active', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class SpeakerSerializer(serializers.ModelSerializer):
    photo = HybridImageField(required=False, allow_null=True)
    
    class Meta:
        model = Speaker
        fields = ('id', 'name', 'designation', 'description', 'photo', 'order', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class SponsorSerializer(serializers.ModelSerializer):
    logo = HybridImageField(required=False, allow_null=True)
    
    class Meta:
        model = Sponsor
        fields = ('id', 'name', 'logo', 'website_url', 'order', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class GalleryImageSerializer(serializers.ModelSerializer):
    image = HybridImageField(required=False, allow_null=True)
    
    class Meta:
        model = GalleryImage
        fields = ('id', 'image', 'caption', 'created_at')
        read_only_fields = ('id', 'created_at')

class BrochureSerializer(serializers.ModelSerializer):
    pdf = HybridFileField(required=False, allow_null=True)
    
    class Meta:
        model = Brochure
        fields = ('id', 'name', 'description', 'pdf', 'created_at')
        read_only_fields = ('id', 'created_at')

class SiteSettingsSerializer(serializers.ModelSerializer):
    logo = HybridImageField(required=False, allow_null=True)
    registration_banner = HybridImageField(required=False, allow_null=True)
    
    class Meta:
        model = SiteSettings
        fields = ('id', 'site_name', 'logo', 'registration_banner', 'updated_at')
        read_only_fields = ('id', 'updated_at')

