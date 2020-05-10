from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from BugTracker.permissions import *
from rest_framework.response import Response
from django.http import Http404
from rest_framework.decorators import action, permission_classes

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

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectSerializer
        else:
            return ProjectEditSerializers

    @action(methods=['get', ], detail=True, url_path='issues', url_name='issues')
    def get_issues(self, requets, pk):
        try:
            issues_list = Issues.objects.filter(project=pk)
        except KeyError:
            return Response({'Empty': 'No Issues for this project yet'}, status = status.HTTP_204_NO_CONTENT)

        ser = IssueSerializer(issues_list, many=True)
        return Response(ser.data)

    @action(methods=['get', ], detail=True, url_path='members', url_name='members')
    def get_team_members(self, request, pk):
        project = Project.objects.get(pk = pk)
        members_list = project.members

        ser = AppUserSerializer(members_list, many=True)
        return Response

    @action(methods=['get', ], detail=True, url_path='creator', url_name='creator')
    def get_creator(self, request, pk):
        project = Project.objects.get(pk = pk)
        creator = project.creator

        ser = UserSerializer(creator)
        return Response(ser.data)

    @permission_classes(IsAdminOrProjectCreator)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

class IssuesViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        try:
            return Issues.objects.filter(project=self.kwargs['project_pk'])
        except:
            try:
                return Issues.objects.filter(assigned_to=self.kwargs['assigned_to_pk'])
            except KeyError:
                try:
                    return Issues.objects.filter(reported_by=self.kwargs['reported_by_pk'])
                except KeyError:
                    return Issues.objects.all()
    queryset = Issues.objects.all()
    serializer_class = IssueSerializer

    @action(methods=['patch', ], detail=True, url_path='assign', url_name='assign')
    @permission_classes([IsTeamMemberOrAdmin, IsAdminOrProjectCreator])
    def assign_issue(self, request, pk):
        assigned_to = self.request.query_params.get('assigned_to')
        issue = Issues.objects.get(pk=pk)
        user = AppUser.objects.get(pk=assigned_to)

        if user in issue.project.members.all():
            ser = IssueSerializer(issue, data={'assigned_to': assign_to}, partial=True)

            if ser.is_valid():
                ser.save()
            return Response({'status': 'Assignment Successful'}, status=status.HTTP_202_ACCEPTED)

        else:
            return Response({'Error': 'User not a team member'}, status=status.HTTP_406_NOT_ACCEPTABLE)


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
