from rest_framework import serializers
from .models import AuditLog, MarketplaceSetting, Dispute, SystemAnnouncement

class AuditLogSerializer(serializers.ModelSerializer):
    actor_username = serializers.ReadOnlyField(source='actor.username')

    class Meta:
        model = AuditLog
        fields = '__all__'


class MarketplaceSettingSerializer(serializers.ModelSerializer):
    updated_by_username = serializers.ReadOnlyField(source='updated_by.username')

    class Meta:
        model = MarketplaceSetting
        fields = '__all__'


class DisputeSerializer(serializers.ModelSerializer):
    project_title = serializers.ReadOnlyField(source='project.title')
    client_username = serializers.ReadOnlyField(source='client.username')
    freelancer_username = serializers.ReadOnlyField(source='freelancer.username')
    assigned_admin_username = serializers.ReadOnlyField(source='assigned_admin.username')

    class Meta:
        model = Dispute
        fields = '__all__'


class SystemAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemAnnouncement
        fields = '__all__'
