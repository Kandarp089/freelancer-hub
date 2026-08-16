from rest_framework import serializers
from .models import Payment
from apps.accounts.serializers import UserSerializer

class PaymentSerializer(serializers.ModelSerializer):
    client_data = UserSerializer(source='client', read_only=True)
    freelancer_data = UserSerializer(source='freelancer', read_only=True)
    project_title = serializers.ReadOnlyField(source='project.title')

    class Meta:
        model = Payment
        fields = (
            'id', 'project', 'project_title', 'client', 'client_data',
            'freelancer', 'freelancer_data', 'razorpay_order_id',
            'razorpay_payment_id', 'amount', 'currency', 'status', 'created_at'
        )
        read_only_fields = ('client', 'created_at')
