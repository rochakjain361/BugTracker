from rest_framework import permissions

class IsAdminOrProjectCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.user_role == 2 or obj.project.creator.all():
            return True
        else:
            return False

class IsTeamMemberOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.user_role == 2 or obj.project.members.all():
            return True
        else:
            return False
'''
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == user
'''
