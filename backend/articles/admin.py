from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ArticleSubmission

@admin.register(ArticleSubmission)
class ArticleSubmissionAdmin(ModelAdmin):
    list_display = ('article_title', 'author_name', 'email', 'status', 'submitted_date')
    list_filter = ('status',)
    search_fields = ('article_title', 'author_name', 'email', 'registration__registration_id')
