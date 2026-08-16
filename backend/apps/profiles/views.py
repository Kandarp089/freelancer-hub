from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import FreelancerProfile, ClientProfile, Skill, Portfolio, Service
from .serializers import (
    FreelancerProfileSerializer, ClientProfileSerializer, SkillSerializer,
    PortfolioSerializer, ServiceSerializer
)

class FreelancerProfileViewSet(viewsets.ModelViewSet):
    queryset = FreelancerProfile.objects.all().select_related('user', 'primary_category').prefetch_related('skills', 'portfolio_items', 'services')
    serializer_class = FreelancerProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__username', 'title', 'bio', 'location', 'skills__name']
    ordering_fields = ['rating_avg', 'hourly_rate', 'experience_years', 'completed_projects_count', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            qs = qs.filter(primary_category__slug=category_slug)

        min_rate = self.request.query_params.get('min_rate')
        max_rate = self.request.query_params.get('max_rate')
        if min_rate:
            qs = qs.filter(hourly_rate__gte=min_rate)
        if max_rate:
            qs = qs.filter(hourly_rate__lte=max_rate)

        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            qs = qs.filter(rating_avg__gte=min_rating)

        availability = self.request.query_params.get('availability')
        if availability:
            qs = qs.filter(availability=availability)

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            profile = FreelancerProfile.objects.get(user=request.user)
        except FreelancerProfile.DoesNotExist:
            profile = FreelancerProfile.objects.create(
                user=request.user,
                title="Freelancer Professional",
                bio="Professional service provider."
            )

        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all().select_related('user')
    serializer_class = ClientProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            profile = ClientProfile.objects.get(user=request.user)
        except ClientProfile.DoesNotExist:
            profile = ClientProfile.objects.create(user=request.user)

        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        freelancer = FreelancerProfile.objects.get(user=self.request.user)
        serializer.save(freelancer=freelancer)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        freelancer = FreelancerProfile.objects.get(user=self.request.user)
        serializer.save(freelancer=freelancer)

class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]
