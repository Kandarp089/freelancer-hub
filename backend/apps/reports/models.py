from django.db import models
from django.conf import settings

class Report(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Review'
        RESOLVED = 'RESOLVED', 'Resolved'
        DISMISSED = 'DISMISSED', 'Dismissed'

    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='filed_reports')
    target_type = models.CharField(max_length=50, help_text="e.g. USER, PROJECT, PROPOSAL, REVIEW")
    target_id = models.IntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Report #{self.id} on {self.target_type}:{self.target_id} by {self.reporter.username}"
