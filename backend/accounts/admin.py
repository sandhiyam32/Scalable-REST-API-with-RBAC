from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display  = ('username', 'email', 'role', 'is_active', 'date_joined')
    list_filter   = ('role', 'is_active')
    search_fields = ('username', 'email')
    ordering      = ('-date_joined',)

    # Add role field to the edit form
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
