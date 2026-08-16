from rest_framework import serializers
from .models import Report
from apps.accounts.serializers import UserSerializer

class ReportSerializer(serializers.ModelSerializer):
    reporter_data = UserSerializer(source='reporter', read_only=True)

    class Meta:
        model = Report
        fields = ('id', 'reporter', 'reporter_data', 'target_type', 'target_id', 'reason', 'status', 'created_at')
        read_only_fields = ('reporter', 'created_at')
