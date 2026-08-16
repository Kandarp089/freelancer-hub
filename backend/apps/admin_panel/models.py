from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    class Action(models.TextChoices):
        CREATE = 'CREATE', 'Create'
        UPDATE = 'UPDATE', 'Update'
        DELETE = 'DELETE', 'Delete'
        SUSPEND = 'SUSPEND', 'Suspend'
        VERIFY = 'VERIFY', 'Verify'
        RESTORE = 'RESTORE', 'Restore'
        MODERATE = 'MODERATE', 'Moderate'

    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='admin_audit_actions')
    action = models.CharField(max_length=20, choices=Action.choices)
    entity_name = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=100, blank=True)
    old_values = models.JSONField(default=dict, blank=True)
    new_values = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    reason = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        actor_name = self.actor.username if self.actor else 'System'
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] {actor_name} -> {self.action} {self.entity_name} #{self.entity_id}"


class MarketplaceSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField(default=dict)
    description = models.TextField(blank=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key}: {self.value}"


class Dispute(models.Model):
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        INVESTIGATING = 'INVESTIGATING', 'Investigating'
        RESOLVED_CLIENT = 'RESOLVED_CLIENT', 'Resolved for Client'
        RESOLVED_FREELANCER = 'RESOLVED_FREELANCER', 'Resolved for Freelancer'
        CLOSED = 'CLOSED', 'Closed'

    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='admin_disputes')
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_disputes')
    freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_disputes')
    assigned_admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_disputes')
    reason = models.TextField()
    evidence = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.OPEN)
    resolution_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Dispute #{self.id} on Project {self.project.title}"


class SystemAnnouncement(models.Model):
    class TargetRole(models.TextChoices):
        ALL = 'ALL', 'All Users'
        FREELANCER = 'FREELANCER', 'Freelancers Only'
        CLIENT = 'CLIENT', 'Clients Only'

    title = models.CharField(max_length=200)
    content = models.TextField()
    target_role = models.CharField(max_length=20, choices=TargetRole.choices, default=TargetRole.ALL)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Announcement: {self.title}"
