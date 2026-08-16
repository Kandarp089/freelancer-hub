from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, CreateRazorpayOrderView, VerifyRazorpayPaymentView

router = DefaultRouter()
router.register(r'history', PaymentViewSet, basename='payment-history')

urlpatterns = [
    path('create-order/', CreateRazorpayOrderView.as_view(), name='payment_create_order'),
    path('verify/', VerifyRazorpayPaymentView.as_view(), name='payment_verify'),
    path('', include(router.urls)),
]
