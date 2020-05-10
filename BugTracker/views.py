from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from BugTracker.permissions import *
from rest_frame

# Create your views here.

# View for displaying the AppUser Content
class AppUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.AppUser.objects.all()
    serializer_class = serializers.AppUserSerilizer
    permission_classes = [IsAdmin]
    
class ProjectViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        try:
            return models.Project.objects.filter(members=self.kwargs['members_pk'])
        except KeyError:
            try:
                return models.Project.objects.filter(creator=self.kwargs['creator_pk'])
            except KeyError:
                return models.Project.objects.all()
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer
    permission_classes = [IsAdminOrProjectCreator, IsTeamMemberOrAdmin]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return serializers.ProjectSerializer
        else:
            return serializers.ProjectEditSerializers

class IssuesViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        try:
            return models.Issues.objects.filter(assigned_to=self.kwargs['assigned_to_pk'])
        except KeyError:
            try:
                return models.Issues.objects.filter(reported_by=self.kwargs['reported_by_pk'])
            except KeyError:
                return models.Issues.objects.all()

    queryset = models.Issues.objects.all()
    serializer_class = serializers.IssueSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return serializers.IssueSerializer
        else:
            return serializers.IssueEditSerializers

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        try:
            return models.Comment.objects.filter(issue=self.kwargs['issue_pk'])
        except KeyError:
            return models.Comment.objects.all()
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsAdminorReadOnly]
