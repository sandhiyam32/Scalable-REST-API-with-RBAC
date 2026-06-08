from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display   = ('title', 'status', 'priority', 'created_by', 'assigned_to', 'created_at')
    list_filter    = ('status', 'priority')
    search_fields  = ('title', 'description')
    ordering       = ('-created_at',)
    list_editable  = ('status', 'priority')  # edit status/priority directly from the list

    # When creating a task in admin, auto-set created_by to current admin user
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
