from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import Proposal, Milestone
from .serializers import ProposalSerializer, MilestoneSerializer
from apps.projects.models import Project
from apps.notifications.models import Notification

class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all().select_related('freelancer', 'project').prefetch_related('milestones')
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)

        # Clients see proposals for their projects, freelancers see their own proposals
        if user.role == 'CLIENT':
            qs = qs.filter(project__client=user)
        elif user.role == 'FREELANCER':
            qs = qs.filter(freelancer=user)
        return qs

    def perform_create(self, serializer):
        proposal = serializer.save(freelancer=self.request.user)
        # Increment project proposal count
        project = proposal.project
        project.proposals_count = Proposal.objects.filter(project=project).count()
        project.save()

        # Send notification to client
        Notification.objects.create(
            recipient=project.client,
            title="New Proposal Received",
            message=f"{self.request.user.username} submitted a proposal for '{project.title}'",
            notification_type="PROPOSAL_RECEIVED",
            link=f"/projects/{project.id}"
        )

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        proposal = self.get_object()
        project = proposal.project

        if request.user != project.client and request.user.role != 'ADMIN':
            return Response({'error': 'Only the project owner can accept proposals'}, status=status.HTTP_403_FORBIDDEN)

        with transaction.atomic():
            proposal.status = Proposal.Status.ACCEPTED
            proposal.save()

            # Reject other proposals
            Proposal.objects.filter(project=project).exclude(id=proposal.id).update(status=Proposal.Status.REJECTED)

            # Assign project
            project.assigned_freelancer = proposal.freelancer
            project.status = Project.Status.ASSIGNED
            project.save()

            # Create Notification
            Notification.objects.create(
                recipient=proposal.freelancer,
                title="Proposal Accepted!",
                message=f"Your proposal for '{project.title}' was accepted by {project.client.username}!",
                notification_type="PROPOSAL_ACCEPTED",
                link=f"/projects/{project.id}"
            )

        return Response({'status': 'accepted', 'project_status': project.status})

    @action(detail=True, methods=['post'])
    def shortlist(self, request, pk=None):
        proposal = self.get_object()
        if request.user != proposal.project.client:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        proposal.status = Proposal.Status.SHORTLISTED
        proposal.save()
        return Response({'status': 'shortlisted'})

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]
