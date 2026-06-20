from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BannerViewSet,
    SpeakerViewSet,
    SponsorViewSet,
    GalleryImageViewSet,
    ProgramContentBulkUpdateView,
    PublicHomeContentView,
    BrochureViewSet,
    SiteSettingsView
)

router = DefaultRouter()
router.register('banners', BannerViewSet, basename='banner')
router.register('speakers', SpeakerViewSet, basename='speaker')
router.register('sponsors', SponsorViewSet, basename='sponsor')
router.register('gallery', GalleryImageViewSet, basename='gallery')
router.register('brochures', BrochureViewSet, basename='brochure')

urlpatterns = [
    path('home/', PublicHomeContentView.as_view(), name='cms_home'),
    path('content/bulk-update/', ProgramContentBulkUpdateView.as_view(), name='cms_bulk_update'),
    path('settings/', SiteSettingsView.as_view(), name='cms_settings'),
    path('', include(router.urls)),
]
