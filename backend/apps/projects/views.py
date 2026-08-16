from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Project, ProjectAttachment
from .serializers import ProjectSerializer, ProjectAttachmentSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().select_related('client', 'assigned_freelancer', 'category', 'subcategory').prefetch_related('skills_required', 'attachments')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category__name', 'skills_required__name', 'location']
    ordering_fields = ['created_at', 'min_budget', 'max_budget', 'proposals_count']

    def get_queryset(self):
        qs = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        subcategory_slug = self.request.query_params.get('subcategory')
        if subcategory_slug:
            qs = qs.filter(subcategory__slug=subcategory_slug)

        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        else:
            if self.request.user.is_authenticated:
                qs = qs.filter(~Q(status='DRAFT') | Q(client=self.request.user))
            else:
                qs = qs.exclude(status='DRAFT')

        budget_type = self.request.query_params.get('budget_type')
        if budget_type:
            qs = qs.filter(budget_type=budget_type)

        min_b = self.request.query_params.get('min_budget')
        if min_b:
            qs = qs.filter(min_budget__gte=min_b)

        max_b = self.request.query_params.get('max_budget')
        if max_b:
            qs = qs.filter(max_budget__lte=max_b)

        exp = self.request.query_params.get('experience_level')
        if exp:
            qs = qs.filter(experience_level=exp)

        my_projects = self.request.query_params.get('my_projects')
        if my_projects and self.request.user.is_authenticated:
            qs = qs.filter(Q(client=self.request.user) | Q(assigned_freelancer=self.request.user))

        return qs

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)
        if hasattr(self.request.user, 'client_profile'):
            self.request.user.client_profile.projects_posted_count += 1
            self.request.user.client_profile.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        project = self.get_object()
        if request.user != project.client and request.user != project.assigned_freelancer and request.user.role != 'ADMIN':
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status in dict(Project.Status.choices):
            project.status = new_status
            project.save()
            return Response({'status': project.status})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class ProjectAttachmentViewSet(viewsets.ModelViewSet):
    queryset = ProjectAttachment.objects.all()
    serializer_class = ProjectAttachmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
