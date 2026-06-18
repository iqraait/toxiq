from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-timestamp']

    @classmethod
    def log(cls, user, action, details=None, request=None):
        ip = None
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
        
        return cls.objects.create(
            user=user if user and user.is_authenticated else None,
            action=action,
            ip_address=ip,
            details=details
        )

    def __str__(self):
        user_str = self.user.username if self.user else "Anonymous/System"
        return f"{self.timestamp} - {user_str}: {self.action}"
