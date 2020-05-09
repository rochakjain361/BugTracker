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
        fields = ['id', 'user_profile', 'user_role']

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Issues
        fields = ['title', 'description', 'bug_status', 'reported_by', 'assigned_to', 'project', 'created_at', 'tag']
        read_only_fields = ['title', 'reported_by', 'project', 'created_at']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Image
        fields = ('image')
        
class CommentSerializer(serializers.ModelSerializer):
    images = ImageSerializer(source='image_set', many=True, read_only = True)
    class Meta:
        model = models.Comment
        fields = ['issue', 'comment', 'created_at', 'commented_by', 'images']

    def create(self, validated_data):
        images_data = self.context.get('view').request.FILES
        new_comment = Comment.objects.create(issue=validated_data.get('issue'), 
                                             comment=validated_data.get('comment'),
                                             created_at=validated_data.get('created_at'),
                                             commented_by=validated_data.get('commented_by'))
        for image_data in images_data.values():
            Image.objects.create(comment=new_comment, image=image_data)
        return task

class IssueEditSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Issues
        fields = ['title', 'description', 'bug_status', 'reported_by', 'assigned_to', 'project', 'created_at', 'tag']
        read_only_fields = ['title', 'reported_by', 'project', 'created_at', 'description']

class ProjectEditSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Project
        field = ['name', 'wiki', 'status', 'creator', 'created_at', 'issues']
        read_only_fields = ['name', 'wiki', 'creator', 'created_at']
        extra_kwargs = {'issues':{'required':False}, 'members':{'required': False}}
