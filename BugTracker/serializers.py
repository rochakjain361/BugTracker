from BugTracker import models
from rest_framework import serializers
from django.contrib.auth import get_user_model

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Project
        fields = ['name', 'wiki', 'status', 'creator', 'created_at']
        extra_kwargs = {'members':{'required': False}}
        read_only_fields = ['creator', 'created_at']

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AppUser
        fields = ['pk', 'user_role', 'username', 'enrNo', 'first_name', 'email']

class IssueSerializer(serializers.ModelSerializer):
    reported_by = AppUserSerializer()
    assigned_to = AppUserSerializer()
    class Meta:
        model = models.Issues
        fields = ['title', 'description', 'bug_status', 'reported_by', 'assigned_to', 'project', 'created_at', 'tag']
        read_only_fields = ['title', 'reported_by', 'project', 'created_at']
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comment
        fields = '__all__'

class IssueEditSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Issues
        fields = ['title', 'description', 'bug_status', 'reported_by', 'assigned_to', 'project', 'created_at', 'tag']
        read_only_fields = ['title', 'reported_by', 'project', 'created_at', 'description']

class ProjectEditSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Project
        fields = '__all__'
        read_only_fields = ['name', 'wiki', 'creator', 'created_at']
        extra_kwargs = {'issues':{'required':False}, 'members':{'required': False}}

class UploadImageSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Image
        field = '__all__'
