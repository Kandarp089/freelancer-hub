from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProposalViewSet, MilestoneViewSet

router = DefaultRouter()
router.register(r'milestones', MilestoneViewSet, basename='milestone')
router.register(r'', ProposalViewSet, basename='proposal')

urlpatterns = [
    path('', include(router.urls)),
]
