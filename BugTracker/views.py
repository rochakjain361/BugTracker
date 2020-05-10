from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from BugTracker.permissions import *

# Create your views here.

# View for displaying the AppUser Content
class AppUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer
    permission_classes = [IsAdminOrReadOnly]
    
class ProjectViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        try:
            return Project.objects.filter(members=self.kwargs['members_pk'])
        except KeyError:
            try:
                return Project.objects.filter(creator=self.kwargs['creator_pk'])
            except KeyError:
                return Project.objects.all()
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrProjectCreator, IsTeamMemberOrAdmin]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectSerializer
        else:
            return ProjectEditSerializers

class IssuesViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        try:
            return Issues.objects.filter(assigned_to=self.kwargs['assigned_to_pk'])
        except KeyError:
            try:
                return Issues.objects.filter(reported_by=self.kwargs['reported_by_pk'])
            except KeyError:
                return Issues.objects.all()

    queryset = Issues.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return IssueSerializer
        else:
            return IssueEditSerializers

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        try:
            return Comment.objects.filter(issue=self.kwargs['issue_pk'])
        except KeyError:
            return Comment.objects.all()
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAdminOrReadOnly]
