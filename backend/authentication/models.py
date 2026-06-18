from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('SUPER_ADMIN', 'Super Admin'),
        ('ADMIN', 'Admin'),
        ('PARTICIPANT', 'Participant'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ADMIN')
    phone = models.CharField(max_length=20, blank=True, null=True)

    def is_super_admin(self):
        return self.role == 'SUPER_ADMIN' or self.is_superuser

    def is_admin_user(self):
        return self.role in ['SUPER_ADMIN', 'ADMIN'] or self.is_staff

    def __str__(self):
        return f"{self.username} ({self.role})"
