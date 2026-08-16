from django.db import models
from django.conf import settings
from apps.categories.models import Category, SubCategory
from apps.profiles.models import Skill

class Project(models.Model):
    class BudgetType(models.TextChoices):
        FIXED = 'FIXED', 'Fixed Price'
        HOURLY = 'HOURLY', 'Hourly Rate'

    class LocationType(models.TextChoices):
        REMOTE = 'REMOTE', 'Remote'
        ONSITE = 'ONSITE', 'On-Site'

    class ExperienceLevel(models.TextChoices):
        ENTRY = 'ENTRY', 'Entry Level'
        INTERMEDIATE = 'INTERMEDIATE', 'Intermediate'
        EXPERT = 'EXPERT', 'Expert'

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        OPEN = 'OPEN', 'Open for Proposals'
        REVIEWING = 'REVIEWING', 'Under Review'
        ASSIGNED = 'ASSIGNED', 'Assigned / In Contract'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posted_projects')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='projects')
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    skills_required = models.ManyToManyField(Skill, blank=True, related_name='projects')
    budget_type = models.CharField(max_length=20, choices=BudgetType.choices, default=BudgetType.FIXED)
    min_budget = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    max_budget = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    deadline = models.DateField(blank=True, null=True)
    location_type = models.CharField(max_length=20, choices=LocationType.choices, default=LocationType.REMOTE)
    location = models.CharField(max_length=100, blank=True, null=True)
    experience_level = models.CharField(max_length=20, choices=ExperienceLevel.choices, default=ExperienceLevel.INTERMEDIATE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    assigned_freelancer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_projects')
    proposals_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.status})"

class ProjectAttachment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='project_attachments/', blank=True, null=True)
    file_url = models.CharField(max_length=500, blank=True, null=True)
    filename = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.project.title}: {self.filename}"
