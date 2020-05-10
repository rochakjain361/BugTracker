from rest_framework import permissions

class IsAdminOrProjectCreator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if(request.method in permissions.SAFE_METHODS) or (request.method == 'POST'):
            return True
        return (obj.creator == request.user) or request.user.isAdmin

class IsTeamMemberOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if(request.method in permissions.SAFE_METHODS) or (request.method == 'POST'):
            return True
        return request.user.isAdmin or (request.user in obj.members.all()) 

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, requet, view, obj):
        if request.user.is_superuser:
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == user
