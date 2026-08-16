from django.db import models
from django.conf import settings

class Favorite(models.Model):
    class TargetType(models.TextChoices):
        FREELANCER = 'FREELANCER', 'Freelancer'
        PROJECT = 'PROJECT', 'Project'
        SERVICE = 'SERVICE', 'Service'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    target_type = models.CharField(max_length=20, choices=TargetType.choices)
    target_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'target_type', 'target_id')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} favorited {self.target_type} #{self.target_id}"
