from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from rest_framework.response import Response
from .mailer import Mailer
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

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

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return IssuePOSTSerializer
        else:
            return IssueGETSerializer
        
    @action(methods=['get',], detail=True, url_path='comments', url_name='comments', permission_classes=[AllowAny])
    def get_issue_comments(self, request, pk):
        issue = Issues.objects.get(pk=pk)
        comments = Comment.objects.filter(issue=issue)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(methods=['get',], detail=False, url_path='add_issue', url_name='add_issue', permission_classes=[AllowAny])
    def add_issue(self, request):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            code = request.GET
            title = request.GET.get('title')
            description = request.GET.get('description')
            bug_status = request.GET.get('bug_status')
            reported_by = user
            project_id = request.GET.get('project')
            project = Project.objects.get(pk = project_id)
            print(code)
            tags = []
            for x in range(len(code) - 5):
                tags.append(request.GET.get('tags[%d]' % x))
            new_tags = []
            for m in tags:
                new_tags.append(Tags.objects.get(pk = m))
            print(new_tags)
            issue = Issues(title = title,description = description,bug_status = bug_status, reported_by = reported_by, project = project)
            issue.save()
            issue.tags.set(new_tags)
            instance = Mailer()
            instance.newIssueOpened(project_name=project.name, issue_title= title, reported_by=reported_by, team_members=project.members.all())

            return Response({'Status':'New Issue Added', 'Id': issue.pk})
        else: 
            return Response({'Status':'User not Authenticated or is disabled'})

    @action(methods=['get',], detail=True, url_path='assign', url_name='assign', permission_classes=[AllowAny])
    def assign_issue(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            member_id = request.GET.get('memberId')
            issue = Issues.objects.get(pk=pk)
            project = issue.project
            if user == project.creator or user.user_role == 2 or user in issue.project.members.all():
                if AppUser.objects.get(pk=member_id) in issue.project.members.all():
                    issue.assigned_to = AppUser.objects.get(pk=member_id)
                    issue.bug_status = 2
                    instance = Mailer()
                    instance.assignIssue(issue= issue, project_name= issue.project.name, assignee= issue.assigned_to, reported_by=issue.reported_by, team_members= issue.project.members.all())
                    issue.save()
                    return Response({'Response' : 'User Assigned'})
                else: 
                    return Response({'Response' : 'User not a team Member'})
            else:
                return Response({'Response': 'User not an Admin or the project creator'})
        else:
            return Response({'Response': 'User not authenticated or is disabled'})

    @action(methods=['get',], detail=True, url_path='close_issue', url_name='close_issue', permission_classes=[AllowAny])
    def close_issue(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            issue = Issues.objects.get(pk = pk)
            project = issue.project
            if user == creator or user.user_role == 2 or user in project.members.all() or user == issue.assigned_to:
                issue.bug_status = 3
                instance = Mailer()
                instance.closeIssue(issue= issue, project_name= issue.project, reported_by= issue.reported_by, team_members= issue.project.members.all())
                issue.save()
                return Response({'Response': 'Issue Closed'})
            else:
                return Response({'Response': 'User cannot close this issue'})
        else:
            return Response({'Response': 'User not authenticated or is disabled'})

    @action(methods=['get',], detail=True, url_path='delete_issue', url_name='delete_issue', permission_classes=[AllowAny])
    def delete_issue(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            issue = Issues.objects.get(pk = pk)
            project = issue.project
            if user == project.creator or user.user_role == 2 or user in project.members.all() or user == issue.assigned_to:
                instance = Mailer()
                instance.deleteIssue(issue= issue, project_name= issue.project, reported_by= issue.reported_by, team_members= issue.project.members.all())
                issue.delete()
                return Response({'Response': 'Issue Deleted'})
            else: 
                return Response({'Response': 'User cannot delete this issue'})
        else:
            return Response({'Response': 'User not authenticated'})
