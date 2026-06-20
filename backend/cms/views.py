from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ProgramContent, Banner, Speaker, Sponsor, GalleryImage, Brochure, SiteSettings
from .serializers import (
    ProgramContentSerializer,
    BannerSerializer,
    SpeakerSerializer,
    SponsorSerializer,
    GalleryImageSerializer,
    BrochureSerializer,
    SiteSettingsSerializer
)
from authentication.permissions import IsAdminRoleOrReadOnly, IsAdminUserRole

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [IsAdminRoleOrReadOnly]

    def get_queryset(self):
        # Public gets only active banners, admin gets all
        if self.request.user and self.request.user.is_authenticated and (self.request.user.role in ['ADMIN', 'SUPER_ADMIN'] or self.request.user.is_staff):
            return Banner.objects.all()
        return Banner.objects.filter(is_active=True)

class SpeakerViewSet(viewsets.ModelViewSet):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer
    permission_classes = [IsAdminRoleOrReadOnly]

class SponsorViewSet(viewsets.ModelViewSet):
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    permission_classes = [IsAdminRoleOrReadOnly]

class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [IsAdminRoleOrReadOnly]

class ProgramContentBulkUpdateView(APIView):
    """
    View for bulk updating or retrieving CMS content blocks.
    """
    permission_classes = [IsAdminUserRole]

    def put(self, request):
        data = request.data  # Expected format: { "about_content": {...}, "contact_details": {...} }
        if not isinstance(data, dict):
            return Response({"error": "Data must be a dictionary"}, status=status.HTTP_400_BAD_REQUEST)
            
        updated_contents = {}
        for key, value in data.items():
            content_obj, created = ProgramContent.objects.update_or_create(
                key=key,
                defaults={'value': value}
            )
            updated_contents[key] = content_obj.value
            
        return Response(updated_contents, status=status.HTTP_200_OK)

class PublicHomeContentView(APIView):
    """
    Aggregated public homepage content for high performance.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        banners = Banner.objects.filter(is_active=True)
        speakers = Speaker.objects.all()
        sponsors = Sponsor.objects.all()
        gallery = GalleryImage.objects.all()[:12] # Limit to latest 12
        
        # Fetch key content blocks
        contents = {obj.key: obj.value for obj in ProgramContent.objects.all()}
        
        # Populate defaults if they don't exist
        default_contents = {
            'about_content': {'title': 'About TOXIQ Program', 'text': '<p>Welcome to the TOXIQ Program. A clinical hospital initiative.</p>'},
            'important_dates': {
                'registration_open': '2026-06-01',
                'registration_close': '2026-07-31',
                'article_deadline': '2026-08-15'
            },
            'contact_details': {
                'address': 'TOXIQ Hospital Campus, Sector 5, Medical Road',
                'email': 'toxiq@hospital.com',
                'phone': '+91 98765 43210'
            },
            'registration_instructions': 'Please read all guidelines and make payment of ₹500 via PayU.',
            'article_instructions': 'Upload files in PDF format, maximum 10MB.'
        }
        
        # Fetch brochures
        brochures = Brochure.objects.all()

        # Fetch site settings
        settings_obj, created = SiteSettings.objects.get_or_create(id=1)
        
        for key, def_val in default_contents.items():
            if key not in contents:
                contents[key] = def_val

        return Response({
            'banners': BannerSerializer(banners, many=True, context={'request': request}).data,
            'speakers': SpeakerSerializer(speakers, many=True, context={'request': request}).data,
            'sponsors': SponsorSerializer(sponsors, many=True, context={'request': request}).data,
            'gallery': GalleryImageSerializer(gallery, many=True, context={'request': request}).data,
            'brochures': BrochureSerializer(brochures, many=True, context={'request': request}).data,
            'settings': SiteSettingsSerializer(settings_obj, context={'request': request}).data,
            'content': contents
        })

class BrochureViewSet(viewsets.ModelViewSet):
    queryset = Brochure.objects.all()
    serializer_class = BrochureSerializer
    permission_classes = [IsAdminRoleOrReadOnly]

class SiteSettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        obj, created = SiteSettings.objects.get_or_create(id=1)
        serializer = SiteSettingsSerializer(obj, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        # Admin only
        if not request.user or not request.user.is_authenticated or request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
            
        obj, created = SiteSettings.objects.get_or_create(id=1)
        serializer = SiteSettingsSerializer(obj, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

