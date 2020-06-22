from BugTracker import models
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Issues, Project

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AppUser
        fields = ['pk', 'username', 'first_name', 'email', 'enrNo', 'user_role', 'display_picture', 'access_token']

class ProjectGETSerializer(serializers.ModelSerializer):
    creator = AppUserSerializer(read_only=True)
    members = AppUserSerializer(read_only=True, many=True)
    class Meta:
        model = models.Project
        fields = ['name', 'wiki', 'status', 'creator', 'members', 'created_at', 'id']

class ProjectPOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Project
        fields = ['name', 'wiki', 'status', 'creator', 'members', 'created_at', 'id']
        read_only_fields = ['id', 'created_at']

class IssueGETSerializer(serializers.ModelSerializer):
    project = ProjectGETSerializer(read_only=True)
    reported_by = AppUserSerializer(read_only=True)
    assigned_to = AppUserSerializer(read_only=True)
    class Meta:
        model = models.Issues
        fields = ['title', 'pk', 'description', 'bug_status', 'reported_by', 'assigned_to', 'project', 'created_at', 'tag']
        #read_only_fields = ['title', 'reported_by', 'project', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comment
        fields = '__all__'
        
class IssuePOSTSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Issues
        fields = ['title', 'pk', 'description', 'bug_status', 'reported_by', 'assigned_to', 'project', 'created_at', 'tag']

class UploadImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Image
        fields = '__all__'
