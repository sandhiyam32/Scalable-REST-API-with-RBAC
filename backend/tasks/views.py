from rest_framework import viewsets, permissions
from drf_spectacular.utils import extend_schema, extend_schema_view
from accounts.permissions import IsAdmin
from .models import Task
from .serializers import TaskSerializer
from .filters import TaskFilter


@extend_schema_view(
    list=extend_schema(
        summary='List all tasks',
        description='Returns paginated tasks. Filter by ?status=todo|in_progress|done, ?priority=low|medium|high, ?search=keyword'
    ),
    create=extend_schema(
        summary='Create a task',
        description='Admin only. Creates a new task assigned to the logged-in admin.'
    ),
    retrieve=extend_schema(summary='Get a single task by ID'),
    update=extend_schema(summary='Replace a task (admin only)'),
    partial_update=extend_schema(summary='Update specific fields of a task (admin only)'),
    destroy=extend_schema(summary='Delete a task (admin only)'),
)
class TaskViewSet(viewsets.ModelViewSet):
    queryset         = Task.objects.select_related('created_by', 'assigned_to').all()
    serializer_class = TaskSerializer
    filterset_class  = TaskFilter
    search_fields    = ['title', 'description']
    ordering_fields  = ['created_at', 'priority', 'status']
    ordering         = ['-created_at']

    def get_permissions(self):
        # Only admins can create, update, or delete tasks
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdmin()]
        # Any logged-in user can view tasks
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
