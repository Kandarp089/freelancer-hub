from rest_framework import serializers
from .models import Proposal, Milestone
from apps.accounts.serializers import UserSerializer
from apps.projects.serializers import ProjectSerializer

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ('id', 'project', 'proposal', 'title', 'amount', 'due_date', 'status', 'created_at')

class ProposalSerializer(serializers.ModelSerializer):
    freelancer_data = UserSerializer(source='freelancer', read_only=True)
    project_data = ProjectSerializer(source='project', read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = Proposal
        fields = (
            'id', 'project', 'project_data', 'freelancer', 'freelancer_data',
            'cover_letter', 'bid_amount', 'estimated_delivery_days', 'status',
            'milestones', 'created_at', 'updated_at'
        )
        read_only_fields = ('freelancer', 'created_at', 'updated_at')
