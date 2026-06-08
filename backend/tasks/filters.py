import django_filters
from .models import Task


class TaskFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Task.STATUS)
    priority = django_filters.ChoiceFilter(choices=Task.PRIORITY)
    assigned_to = django_filters.NumberFilter(field_name='assigned_to__id')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Task
        fields = ['status', 'priority', 'assigned_to']
