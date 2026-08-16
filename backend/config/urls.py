from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/profiles/', include('apps.profiles.urls')),
    path('api/categories/', include('apps.categories.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/proposals/', include('apps.proposals.urls')),
    path('api/messaging/', include('apps.messaging.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/favorites/', include('apps.favorites.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/admin/', include('apps.admin_panel.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
