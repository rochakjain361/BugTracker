from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from BugTracker.permissions import *
from rest_framework.response import Response
from .mailer import Mailer
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectPOSTSerializer
        else:
            return ProjectGETSerializer

    @action(methods=['get', ], detail=True, url_path='issues', url_name='issues', permission_classes=[AllowAny])
    def get_issues(self, request, pk):
        try:
            issues_list = Issues.objects.filter(project=pk)
        except KeyError:
            return Response({'Empty': 'No Issues for this project yet'}, status = status.HTTP_204_NO_CONTENT)
        ser = IssueGETSerializer(issues_list, many=True)
        return Response(ser.data)

    @action(methods=['get', 'options'], detail=False, url_path='add_project', url_name='add_path', permission_classes=[AllowAny])
    def add_project(self, request):
        code1 = request.GET.get('code')
        user = AppUser.objects.get(access_token = code1)
        if user.is_authenticated and not user.is_disabled:
            code = request.GET
            name = request.GET.get('name')
            wiki = request.GET.get('wiki')
            status = request.GET.get('status')
            creator = user
            members = []
            for x in range(len(code) - 4):
                members.append(request.GET.get('members[%d]' % x))
            team_members = []
            for m in members:
                team_members.append(AppUser.objects.get(pk = m))
            team_members.append(user)
            newProject = Project(name = name, wiki = wiki, status = status, creator = creator)
            newProject.save()
            newProject.members.set(team_members)
            instance = Mailer()
            instance.newProjectStarted(project_name=name, project_creator=creator, team_members=team_members)
            return Response({'Status':'Project Created'})
        else:
            return Response({'Status':'User Not Authenticated.'})

    @action(methods=['get',], detail=True, url_path='status_update', url_name='status_update', permission_classes=[AllowAny])
    def update_status(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            project = Project.objects.get(pk =pk)
            creator = project.creator
            if user == creator or user.user_role == 2 or user in project.members.all():
                status = request.GET.get('status')
                print(status)
                project.status = status
                project.save()
                if status == '2':
                    new_status = 'Testing'
                if status == '3':
                    new_status = 'Released'
                instance = Mailer()
                instance.updateProjectStatus(project_name=project.name, status=new_status, team_members=project.members.all())
                return Response({'Status': 'Status Updated'})
            else:
                return Response({'Status': 'User not an Admin or the project Creator or in the team'})
        else:
            return Response({'Status': 'User not authenticated or is disabled'})

    @action(methods=['get',], detail=True, url_path='wiki_update', url_name='wiki_update', permission_classes=[AllowAny])
    def update_wiki(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            project = Project.objects.get(pk =pk)
            creator = project.creator
            if user == creator or user.user_role == 2 or user in project.members.all():
                wiki = request.GET.get('wiki')
                print(wiki)
                project.wiki = wiki
                project.save()
                instance = Mailer()
                instance.updateProjectWiki(project_name= project.name, wiki= wiki, team_members=project.members.all())
                return Response({'Status': 'Wiki Updated'})
            else:
                return Response({'Status': 'User not an Admin or the project Creator or in the team'})
        else:
            return Response({'Status': 'User not authenticated or is disabled'})

    @action(methods=['get',], detail=True, url_path='add_team_members', url_name='add_team_members', permission_classes=[AllowAny])
    def add_team_members(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            project = Project.objects.get(pk =pk)
            creator = project.creator
            if user == creator or user.user_role == 2:
                members = []
                for x in range(len(request.GET)):
                    members.append(request.GET.get('add_members[%d]' % x))
                team_members = []
                for m in members:
                    team_members.append(AppUser.objects.get(pk = m))
                instance = Mailer()
                instance.updateProjectTeam(project_name= project.name, team_members=team_members)
                project.members.set(team_members)
                return Response({'Status': 'More Team Members Added'})
            else:
                return Response({'Status': 'User not an Admin or the project Creator'})
        else:
            return Response({'Status': 'User Disabled or not authenticated'})
    
    @action(methods=['get',], detail=True, url_path='delete_project', url_name='delete_project', permission_classes=[AllowAny])
    def delete_project(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            project = Project.objects.get(pk= pk)
            creator = project.creator
            if user == creator or user.user_role == 2:
                instance = Mailer()
                instance.deleteProject(project_name= project.name, team_members= project.members.all())
                project.delete()
                return Response({'Status': 'Project Deleted'})
            else:
                return Response({'Status': 'User not an Admin or the project Creator'})
        else:
            return Response({'Status': 'User Disable or not authenticated'})

