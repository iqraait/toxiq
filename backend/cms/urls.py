from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BannerViewSet,
    SpeakerViewSet,
    SponsorViewSet,
    GalleryImageViewSet,
    ProgramContentBulkUpdateView,
    PublicHomeContentView
)

router = DefaultRouter()
router.register('banners', BannerViewSet, basename='banner')
router.register('speakers', SpeakerViewSet, basename='speaker')
router.register('sponsors', SponsorViewSet, basename='sponsor')
router.register('gallery', GalleryImageViewSet, basename='gallery')

urlpatterns = [
    path('home/', PublicHomeContentView.as_view(), name='cms_home'),
    path('content/bulk-update/', ProgramContentBulkUpdateView.as_view(), name='cms_bulk_update'),
    path('', include(router.urls)),
]
