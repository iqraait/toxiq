from django.db import models
from registration.models import Registration

class ArticleSubmission(models.Model):
    STATUS_CHOICES = (
        ('SUBMITTED', 'Submitted'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )
    registration = models.ForeignKey(Registration, related_name='articles', on_delete=models.PROTECT)
    author_name = models.CharField(max_length=200)
    email = models.EmailField()
    article_title = models.CharField(max_length=300)
    remarks = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='articles/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUBMITTED')
    admin_remarks = models.TextField(blank=True, null=True)
    submitted_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.article_title} by {self.author_name} ({self.status})"
