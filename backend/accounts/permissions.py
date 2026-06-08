from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Allow access only to admin users."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')


class IsOwnerOrAdmin(BasePermission):
    """Allow object access to owner or admin."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        owner = getattr(obj, 'created_by', getattr(obj, 'user', None))
        return owner == request.user


class IsAdminOrReadOnly(BasePermission):
    """Admin can write; authenticated users can read."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.role == 'admin'
