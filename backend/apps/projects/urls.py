from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ProjectAttachmentViewSet

router = DefaultRouter()
router.register(r'attachments', ProjectAttachmentViewSet, basename='project-attachment')
router.register(r'', ProjectViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),
]
