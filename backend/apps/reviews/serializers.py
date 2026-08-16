from rest_framework import serializers
from django.db.models import Avg
from .models import Review
from apps.accounts.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_data = UserSerializer(source='reviewer', read_only=True)
    reviewee_data = UserSerializer(source='reviewee', read_only=True)
    project_title = serializers.ReadOnlyField(source='project.title')

    class Meta:
        model = Review
        fields = ('id', 'project', 'project_title', 'reviewer', 'reviewer_data', 'reviewee', 'reviewee_data', 'rating', 'comment', 'created_at')
        read_only_fields = ('reviewer', 'created_at')

    def create(self, validated_data):
        review = super().create(validated_data)
        # Update reviewee freelancer profile rating if reviewee is freelancer
        if hasattr(review.reviewee, 'freelancer_profile'):
            fp = review.reviewee.freelancer_profile
            reviews = Review.objects.filter(reviewee=review.reviewee)
            fp.rating_count = reviews.count()
            avg = reviews.aggregate(Avg('rating'))['rating__avg']
            fp.rating_avg = round(avg, 2) if avg else 5.00
            fp.save()
        return review
