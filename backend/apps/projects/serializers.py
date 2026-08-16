from rest_framework import serializers
from django.utils.text import slugify
import uuid
from .models import Project, ProjectAttachment
from apps.accounts.serializers import UserSerializer
from apps.categories.serializers import CategorySerializer, SubCategorySerializer
from apps.profiles.serializers import SkillSerializer

class ProjectAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAttachment
        fields = ('id', 'project', 'file', 'file_url', 'filename', 'created_at')

class ProjectSerializer(serializers.ModelSerializer):
    client_data = UserSerializer(source='client', read_only=True)
    assigned_freelancer_data = UserSerializer(source='assigned_freelancer', read_only=True)
    category_data = CategorySerializer(source='category', read_only=True)
    subcategory_data = SubCategorySerializer(source='subcategory', read_only=True)
    skills_required_data = SkillSerializer(source='skills_required', many=True, read_only=True)
    attachments = ProjectAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 'client', 'client_data', 'assigned_freelancer', 'assigned_freelancer_data',
            'title', 'slug', 'description', 'image_url', 'category', 'category_data', 'subcategory', 'subcategory_data',
            'skills_required', 'skills_required_data', 'budget_type', 'min_budget', 'max_budget',
            'deadline', 'location_type', 'location', 'experience_level', 'status',
            'proposals_count', 'attachments', 'created_at', 'updated_at'
        )
        read_only_fields = ('client', 'slug', 'proposals_count', 'created_at', 'updated_at')

    def create(self, validated_data):
        skills_data = validated_data.pop('skills_required', [])
        title = validated_data.get('title', '')
        base_slug = slugify(title) or 'project'
        validated_data['slug'] = f"{base_slug}-{uuid.uuid4().hex[:6]}"
        
        project = Project.objects.create(**validated_data)
        if skills_data:
            project.skills_required.set(skills_data)
        return project
