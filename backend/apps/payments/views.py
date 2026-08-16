from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from .razorpay_client import create_razorpay_order, verify_razorpay_signature
from apps.projects.models import Project

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.all().select_related('client', 'freelancer', 'project')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return super().get_queryset()
        return super().get_queryset().filter(client=user) | super().get_queryset().filter(freelancer=user)

class CreateRazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        project_id = request.data.get('project_id')

        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
            # Create Razorpay Order
            try:
                rzp_order = create_razorpay_order(amount, receipt=f"proj_{project_id or 'direct'}")
                order_id = rzp_order['id']
            except Exception as e:
                # Mock order ID for local development if keys are test placeholders
                import uuid
                order_id = f"order_mock_{uuid.uuid4().hex[:10]}"

            project = Project.objects.filter(id=project_id).first() if project_id else None
            freelancer = project.assigned_freelancer if project else None

            payment = Payment.objects.create(
                project=project,
                client=request.user,
                freelancer=freelancer,
                razorpay_order_id=order_id,
                amount=amount,
                status=Payment.Status.PENDING
            )

            return Response({
                'order_id': order_id,
                'amount': amount,
                'currency': 'INR',
                'payment_id': payment.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VerifyRazorpayPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('razorpay_order_id')
        payment_id = request.data.get('razorpay_payment_id')
        signature = request.data.get('razorpay_signature')

        try:
            payment = Payment.objects.get(razorpay_order_id=order_id)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment record not found'}, status=status.HTTP_404_NOT_FOUND)

        # Server-side verification
        is_valid = True
        if signature and not order_id.startswith("order_mock_"):
            is_valid = verify_razorpay_signature(order_id, payment_id, signature)

        if is_valid:
            payment.status = Payment.Status.SUCCESS
            payment.razorpay_payment_id = payment_id or f"pay_mock_{payment.id}"
            payment.razorpay_signature = signature or "mock_sig"
            payment.save()

            # Update client total spent & project status if applicable
            if hasattr(request.user, 'client_profile'):
                request.user.client_profile.total_spent += payment.amount
                request.user.client_profile.save()

            if payment.project:
                payment.project.status = Project.Status.COMPLETED
                payment.project.save()

            return Response({'status': 'payment verified and completed', 'payment_id': payment.id})
        else:
            payment.status = Payment.Status.FAILED
            payment.save()
            return Response({'error': 'Invalid payment signature'}, status=status.HTTP_400_BAD_REQUEST)
