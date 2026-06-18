from rest_framework import serializers
from .models import ProgramContent, Banner, Speaker, Sponsor, GalleryImage

class ProgramContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramContent
        fields = ('id', 'key', 'value', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'title', 'subtitle', 'image', 'cta_text', 'cta_link', 'is_active', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ('id', 'name', 'designation', 'description', 'photo', 'order', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = ('id', 'name', 'logo', 'website_url', 'order', 'updated_at')
        read_only_fields = ('id', 'updated_at')

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ('id', 'image', 'caption', 'created_at')
        read_only_fields = ('id', 'created_at')
