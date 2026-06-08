from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLES = [('admin', 'Admin'), ('user', 'User')]
    role = models.CharField(max_length=10, choices=ROLES, default='user')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'accounts_user'

    def is_admin(self):
        return self.role == 'admin'
