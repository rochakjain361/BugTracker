from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from BugTracker.permissions import *
from rest_framework.response import Response
from .mailer import Mailer
from rest_framework import status
from django.http import Http404
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import requests
from django.contrib.auth import login, logout
from django.http import HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.authentication import BasicAuthentication
from IMG_Summer_Project.settings import base_config, BASE_DIR
#from django.middleware import csrf;
# Create your views here.

# View for displaying the AppUser Content
class AppUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()

    @action(methods=['get', ], detail=False, url_name='onlogin', url_path='onlogin', permission_classes=[AllowAny])
    def on_login(self, request):
        code = request.GET.get('code')
        print(code)
        #GETTING THE AUTHORISATION CODE
        
        url = 'https://internet.channeli.in/open_auth/token/'
        data = {
                'client_id': base_config['secrets']['clientID'],
                'client_secret': base_config['secrets']['clientSecret'],
                'grant_type': 'authorization_code',
                'redirect_uri': 'http://localhost:3000/onlogin/',
                'code': code
                } 
        
        user_data = requests.post(url=url, data=data).json()
        print(user_data)
        acs_token = user_data['access_token']
        #print(acs_token)
        
        #GET ACCESS TOKEN
        
        headers={
                'Authorization':'Bearer ' + acs_token
                }
        user_data = requests.get(url='https://internet.channeli.in/open_auth/get_user_data/', headers=headers)
        #return HttpResponse(user_data)
        
        #CHECK IF USER EXISTS
        print(user_data.json())
        try:
            user_data = user_data.json()
            user = AppUser.objects.get(enrNo=user_data["student"]["enrolmentNumber"])
        except AppUser.DoesNotExist:
            #CHECK IMG MEMBER OR NOT
            in_img = False
            for role in user_data["person"]["roles"]:
                
                if role["role"] == "Maintainer":
                    in_img = True
                    break
            
            if in_img:
                enrNum = user_data["student"]["enrolmentNumber"]
                email = user_data["contactInformation"]["instituteWebmailAddress"]
                if user_data['person']['displayPicture'] == None:
                    dp = ""
                else:
                    dp = user_data['person']['displayPicture']

                name = (user_data["person"]["fullName"]).split()
                firstname = name[0]
                fullName = user_data["person"]["fullName"]

                user_role_assigned = 1
                if user_data['student']['currentYear'] >= 2:
                    user_role_assigned = 2

                newUser = AppUser(enrNo = enrNum, email=email, first_name = firstname, username=fullName, user_role = user_role_assigned, access_token = acs_token, display_picture = dp)
                newUser.is_staff = True
                newUser.save()
                login(request, newUser)

                return Response({'status': 'User Created', 'access_token': acs_token}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({'status': 'User not in IMG'}, status=status.HTTP_401_UNAUTHORIZED)
        user.access_token = acs_token
        if user_data['person']['displayPicture'] == None:
            user.display_picture = ""
        else: 
            user.display_picture = user_data['person']['displayPicture']
        user.save()
        login(request=request, user=user)
        return Response({'status': 'User Exists', 'access_token': acs_token})

    @action(methods = ['get', 'options',], detail=False, url_path='my_page', url_name='my_page', permission_classes=[AllowAny])
    def get_my_page(self, request):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            serializer = AppUserSerializer(user)
            login(request=request, user=user)

            user_projects = Project.objects.filter(members=user.pk)
            serializer2 = ProjectGETSerializer(user_projects, many=True)

            user_assigned_issues = Issues.objects.filter(assigned_to=user.pk)
            serializer3 = IssueGETSerializer(user_assigned_issues, many=True)

            user_reported_issues = Issues.objects.filter(reported_by=user.pk)
            serializer4 = IssueGETSerializer(user_reported_issues, many=True)
        
            return Response({'user_data': serializer.data,
                            'projects': serializer2.data,
                            'assigned_issues': serializer3.data,
                            'reported_issues': serializer4.data})
        
        elif user.is_disabled:
            return Response({'Status' : 'User is disabled'})
        else:
            return Response({'Status' : 'User not Authenticated'})

    @action(methods = ['get',], detail = True, url_path='convert_role', url_name='convert_role', permission_classes=[AllowAny])
    def convert_user_role(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            if user.user_role == 2:
                user = AppUser.objects.get(pk=pk)
                user.user_role = request.GET.get('new_role')
                user.save()
                return Response({'Status': 'Role Upgraded'})
            else: 
                return Response({'Status': 'User is not an Admin'})
        elif user.is_disabled:
            return Response({'Status' : 'User is disabled'})
        else:
            return Response({'Status' : 'User not Authenticated'})

    @action(methods = ['get',], detail=True, url_path='disable_user', url_name='disable_user', permission_classes=[AllowAny])
    def disable_user(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.user_role == 2 and not user.is_disabled and user.is_authenticated:
            user = AppUser.objects.get(pk = pk)
            user.is_disabled = request.GET.get('is_disabled')
            user.save()
            return Response({'status': 'User Status Changed'})
        else: 
            return Response({'status': 'User is not an Admin'})

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

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class IssueImageViewSet(viewsets.ModelViewSet):
    queryset = IssueImages.objects.all()
    serializer_class = IssueImageSerializer
    authentication_classes = [BasicAuthentication]

    @action(methods=['get',], detail=False, url_path='get_image_url', url_name='get_image_url')
    def get_images(self, request):
        issue_id = request.GET.get('issue')
        issue = Issues.objects.get(pk = issue_id)
        print(issue)
        images = IssueImages.objects.filter(issue = issue)
        print(images)
        serializer = IssueImageSerializer(images, many=True)
        return Response({'data': serializer.data})

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tags.objects.all()
    serializer_class = TagSerializer

    @action(methods=['get',], detail=False, url_path='new_tag', url_name='new_tag', permission_classes=[AllowAny])
    def new_tag(self, request):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            if user.user_role == 2:
                tagName = request.GET.get('tagName')
                icon = request.GET.get('icon')
                color = request.GET.get('color')
                tag = Tags(tagName=tagName, icon=icon, color=color)
                tag.save()
                return Response({'Response': 'New Tag Created'})
            else:
                return Response({'Response': 'User not Admin'})
        else:
            return Response({'Response': 'User not authenticated'})
    
    @action(methods=['get',], detail=True, url_path='tag_issues', url_name='tag_issues', permission_classes=[AllowAny])
    def tag_issues(self, request, pk):
        code = request.GET.get('code')
        user = AppUser.objects.get(access_token = code)
        if user.is_authenticated and not user.is_disabled:
            tag = Tags.objects.get(pk = pk)
            issues = Issues.objects.filter(tags = tag)
            serializer = IssueGETSerializer(issues, many=True)
            #print(issues)
            return Response({'Response': serializer.data})
        else:
            return Response({'Response':'User disabled or not authenticated'})
