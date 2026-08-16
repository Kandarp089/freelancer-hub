from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().select_related('reviewer', 'reviewee', 'project')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        reviewee_id = self.request.query_params.get('reviewee')
        if reviewee_id:
            qs = qs.filter(reviewee_id=reviewee_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
