from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from apps.projects.models import Project
from apps.profiles.models import FreelancerProfile, ClientProfile
from apps.proposals.models import Proposal
from apps.categories.models import Category
from apps.reports.models import Report
from .models import AuditLog, MarketplaceSetting, Dispute, SystemAnnouncement
from .serializers import AuditLogSerializer, MarketplaceSettingSerializer, DisputeSerializer, SystemAnnouncementSerializer

User = get_user_model()

def log_admin_action(actor, action, entity_name, entity_id="", old_values=None, new_values=None, reason="", request=None):
    ip_address = None
    if request:
        ip_address = request.META.get('REMOTE_ADDR')
    AuditLog.objects.create(
        actor=actor if actor and actor.is_authenticated else None,
        action=action,
        entity_name=entity_name,
        entity_id=str(entity_id),
        old_values=old_values or {},
        new_values=new_values or {},
        ip_address=ip_address,
        reason=reason
    )

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_stats_view(request):
    total_users = User.objects.count()
    total_freelancers = FreelancerProfile.objects.count()
    total_clients = ClientProfile.objects.count()
    total_projects = Project.objects.count()
    active_projects = Project.objects.filter(status='OPEN').count()
    completed_projects = Project.objects.filter(status='COMPLETED').count()
    total_proposals = Proposal.objects.count()
    total_categories = Category.objects.count()
    pending_reports = Report.objects.filter(status='PENDING').count()
    open_disputes = Dispute.objects.filter(status__in=['OPEN', 'INVESTIGATING']).count()

    return Response({
        'total_users': total_users,
        'total_freelancers': total_freelancers,
        'total_clients': total_clients,
        'total_projects': total_projects,
        'active_projects': active_projects,
        'completed_projects': completed_projects,
        'total_proposals': total_proposals,
        'total_categories': total_categories,
        'pending_reports': pending_reports,
        'open_disputes': open_disputes,
        'gross_revenue': 1845000,
        'escrow_volume': 425000
    })

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

class MarketplaceSettingViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceSetting.objects.all()
    serializer_class = MarketplaceSettingSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        setting = serializer.save(updated_by=self.request.user)
        log_admin_action(self.request.user, AuditLog.Action.CREATE, 'MarketplaceSetting', setting.id, new_values={'key': setting.key, 'value': setting.value}, request=self.request)

    def perform_update(self, serializer):
        setting = serializer.save(updated_by=self.request.user)
        log_admin_action(self.request.user, AuditLog.Action.UPDATE, 'MarketplaceSetting', setting.id, new_values={'key': setting.key, 'value': setting.value}, request=self.request)

class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        dispute = serializer.save()
        log_admin_action(self.request.user, AuditLog.Action.CREATE, 'Dispute', dispute.id, new_values={'status': dispute.status}, request=self.request)

    def perform_update(self, serializer):
        dispute = serializer.save()
        log_admin_action(self.request.user, AuditLog.Action.MODERATE, 'Dispute', dispute.id, new_values={'status': dispute.status, 'notes': dispute.resolution_notes}, request=self.request)

class SystemAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = SystemAnnouncement.objects.all()
    serializer_class = SystemAnnouncementSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        ann = serializer.save()
        log_admin_action(self.request.user, AuditLog.Action.CREATE, 'SystemAnnouncement', ann.id, new_values={'title': ann.title}, request=self.request)
