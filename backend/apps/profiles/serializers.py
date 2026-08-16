from rest_framework import serializers
from .models import FreelancerProfile, ClientProfile, Skill, FreelancerSkill, Portfolio, Service
from apps.accounts.serializers import UserSerializer
from apps.categories.serializers import CategorySerializer

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'slug', 'category')

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ('id', 'freelancer', 'title', 'description', 'image_url', 'image', 'category', 'technologies', 'project_url', 'completion_date', 'created_at')
        read_only_fields = ('freelancer', 'created_at')

class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Service
        fields = ('id', 'freelancer', 'title', 'description', 'category', 'category_name', 'price', 'delivery_time_days', 'image', 'created_at')
        read_only_fields = ('freelancer', 'created_at')

class FreelancerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    primary_category_data = CategorySerializer(source='primary_category', read_only=True)
    skills_data = SkillSerializer(source='skills', many=True, read_only=True)
    portfolio_items = PortfolioSerializer(many=True, read_only=True)
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = FreelancerProfile
        fields = (
            'id', 'user', 'title', 'bio', 'primary_category', 'primary_category_data',
            'hourly_rate', 'experience_years', 'location', 'availability',
            'rating_avg', 'rating_count', 'completed_projects_count', 'response_rate',
            'skills_data', 'portfolio_items', 'services', 'created_at', 'updated_at'
        )

class ClientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ClientProfile
        fields = ('id', 'user', 'company_name', 'company_website', 'location', 'total_spent', 'projects_posted_count', 'created_at')
