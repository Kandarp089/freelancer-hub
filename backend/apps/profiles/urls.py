from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FreelancerProfileViewSet, ClientProfileViewSet, PortfolioViewSet,
    ServiceViewSet, SkillViewSet
)

router = DefaultRouter()
router.register(r'freelancers', FreelancerProfileViewSet, basename='freelancer-profile')
router.register(r'clients', ClientProfileViewSet, basename='client-profile')
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'skills', SkillViewSet, basename='skill')

urlpatterns = [
    path('', include(router.urls)),
]
