from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ProgramContent, Banner, Speaker, Sponsor, GalleryImage

@admin.register(ProgramContent)
class ProgramContentAdmin(ModelAdmin):
    list_display = ('key', 'updated_at')
    search_fields = ('key',)

@admin.register(Banner)
class BannerAdmin(ModelAdmin):
    list_display = ('title', 'subtitle', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'subtitle')

@admin.register(Speaker)
class SpeakerAdmin(ModelAdmin):
    list_display = ('name', 'designation', 'order')
    search_fields = ('name', 'designation')

@admin.register(Sponsor)
class SponsorAdmin(ModelAdmin):
    list_display = ('name', 'order')
    search_fields = ('name',)

@admin.register(GalleryImage)
class GalleryImageAdmin(ModelAdmin):
    list_display = ('caption', 'created_at')
    search_fields = ('caption',)
