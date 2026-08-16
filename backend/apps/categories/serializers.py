from rest_framework import serializers
from .models import Category, SubCategory

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ('id', 'category', 'name', 'slug', 'description')

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    subcategory_count = serializers.SerializerMethodField()
    freelancer_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'icon', 'image', 'subcategories', 'subcategory_count', 'freelancer_count')

    def get_subcategory_count(self, obj):
        return obj.subcategories.count()

    def get_freelancer_count(self, obj):
        # Calculated from FreelancerProfile if present
        from apps.profiles.models import FreelancerProfile
        return FreelancerProfile.objects.filter(primary_category=obj).count()
