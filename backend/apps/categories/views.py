from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Category, SubCategory
from .serializers import CategorySerializer, SubCategorySerializer
from apps.common.permissions import IsAdminUserOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'slug'

    def get_object(self):
        # Fallback to ID lookup if slug lookup fails
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs[lookup_url_kwarg]
        if val.isdigit():
            return Category.objects.get(pk=int(val))
        return super().get_object()

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'slug'
