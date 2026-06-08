from django.db import models
from django.conf import settings


class Task(models.Model):
    STATUS = [('todo', 'Todo'), ('in_progress', 'In Progress'), ('done', 'Done')]
    PRIORITY = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS, default='todo')
    priority = models.CharField(max_length=10, choices=PRIORITY, default='medium')
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='assigned_tasks'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_tasks'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tasks_task'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
