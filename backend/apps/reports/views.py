from rest_framework import viewsets, permissions
from .models import Report
from .serializers import ReportSerializer
from apps.common.permissions import IsAdminUserOrReadOnly

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().select_related('reporter')
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ADMIN' or self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(reporter=self.request.user)

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
