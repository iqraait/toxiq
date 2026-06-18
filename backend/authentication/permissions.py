from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to authenticated users with ADMIN or SUPER_ADMIN role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role in ['ADMIN', 'SUPER_ADMIN'] or request.user.is_staff or request.user.is_superuser)
        )

class IsSuperAdminRole(permissions.BasePermission):
    """
    Allows access only to authenticated users with SUPER_ADMIN role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'SUPER_ADMIN' or request.user.is_superuser)
        )

class IsAdminRoleOrReadOnly(permissions.BasePermission):
    """
    Read-only for public, write access for ADMIN and SUPER_ADMIN roles.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role in ['ADMIN', 'SUPER_ADMIN'] or request.user.is_staff or request.user.is_superuser)
        )
