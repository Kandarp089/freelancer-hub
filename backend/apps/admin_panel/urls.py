from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import admin_stats_view, AuditLogViewSet, MarketplaceSettingViewSet, DisputeViewSet, SystemAnnouncementViewSet

router = DefaultRouter()
router.register(r'audit-logs', AuditLogViewSet, basename='admin-audit-logs')
router.register(r'settings', MarketplaceSettingViewSet, basename='admin-settings')
router.register(r'disputes', DisputeViewSet, basename='admin-disputes')
router.register(r'announcements', SystemAnnouncementViewSet, basename='admin-announcements')

urlpatterns = [
    path('stats/', admin_stats_view, name='admin-stats'),
    path('', include(router.urls)),
]
