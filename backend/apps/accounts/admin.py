from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_verified', 'is_suspended', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_suspended', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Platform Info', {'fields': ('role', 'phone', 'avatar', 'bio', 'is_verified', 'is_suspended')}),
    )
