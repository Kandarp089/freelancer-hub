from django.db import models
from django.conf import settings
from apps.categories.models import Category

class Skill(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='skills')

    def __str__(self):
        return self.name

class FreelancerProfile(models.Model):
    class Availability(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Full Time (40+ hrs/wk)'
        PART_TIME = 'PART_TIME', 'Part Time (< 30 hrs/wk)'
        AS_NEEDED = 'AS_NEEDED', 'As Needed'
        UNAVAILABLE = 'UNAVAILABLE', 'Unavailable'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='freelancer_profile')
    title = models.CharField(max_length=150, help_text="e.g. Senior Full Stack Developer & UI Designer")
    bio = models.TextField(blank=True, null=True)
    primary_category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='freelancers')
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=25.00)
    experience_years = models.IntegerField(default=3)
    location = models.CharField(max_length=100, default='Mumbai, India')
    availability = models.CharField(max_length=20, choices=Availability.choices, default=Availability.FULL_TIME)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    rating_count = models.IntegerField(default=0)
    completed_projects_count = models.IntegerField(default=0)
    response_rate = models.IntegerField(default=98, help_text="Percentage e.g. 98%")
    skills = models.ManyToManyField(Skill, through='FreelancerSkill', related_name='freelancers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Freelancer: {self.user.username} - {self.title}"

class FreelancerSkill(models.Model):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.CharField(max_length=20, default='INTERMEDIATE')

    class Meta:
        unique_together = ('freelancer', 'skill')

class ClientProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_profile')
    company_name = models.CharField(max_length=150, blank=True, null=True)
    company_website = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=100, default='Bengaluru, India')
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    projects_posted_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Client: {self.user.username} ({self.company_name or 'Individual'})"

class Portfolio(models.Model):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='portfolio_items')
    title = models.CharField(max_length=150)
    description = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    technologies = models.CharField(max_length=255, help_text="Comma separated e.g. React, Django, PostgreSQL")
    project_url = models.URLField(blank=True, null=True)
    completion_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer.user.username} - {self.title}"

class Service(models.Model):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=150)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_time_days = models.IntegerField(default=3)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.freelancer.user.username}"
