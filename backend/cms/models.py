from django.db import models

class ProgramContent(models.Model):
    """
    Stores simple dynamic key-value text blocks (like About TOXIQ, Instructions, Contacts)
    in a JSON format for complete CMS flexibility.
    """
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key

class Banner(models.Model):
    title = models.CharField(max_length=200, blank=True, default='')
    subtitle = models.CharField(max_length=500, blank=True, default='')
    image = models.ImageField(upload_to='banners/', blank=True, null=True)
    cta_text = models.CharField(max_length=50, blank=True, default='')
    cta_link = models.CharField(max_length=200, blank=True, default='')
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Speaker(models.Model):
    name = models.CharField(max_length=150)
    designation = models.CharField(max_length=200, blank=True, default='')
    description = models.TextField(blank=True)
    photo = models.ImageField(upload_to='speakers/', blank=True, null=True)
    order = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class Sponsor(models.Model):
    name = models.CharField(max_length=150)
    logo = models.ImageField(upload_to='sponsors/', blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class GalleryImage(models.Model):
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)
    caption = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.caption or f"Gallery Image {self.id}"


class Brochure(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    pdf = models.FileField(upload_to='brochures/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default='TOXIQ')
    logo = models.ImageField(upload_to='settings/', blank=True, null=True)
    registration_banner = models.ImageField(upload_to='settings/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return f"Site Settings ({self.site_name})"

