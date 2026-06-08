from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_by           = serializers.ReadOnlyField(source='created_by.username')
    assigned_to_username = serializers.ReadOnlyField(source='assigned_to.username')

    class Meta:
        model  = Task
        fields = (
            'id', 'title', 'description', 'status', 'priority',
            'assigned_to', 'assigned_to_username',
            'created_by', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def validate_title(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError('Title must be at least 3 characters.')
        return value

    def validate_description(self, value):
        return value.strip()
