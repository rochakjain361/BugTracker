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
                'client_id':'gfZHj4O7eZKrzv8Vpgqi1s5kKWgvgyFCf5vt822c',
                'client_secret':'0DTRwGP07h4r4gF7IUGdEvpw6jp9mvk7hYchwDldW1PjnqvbhBacIFXBeFSA0etDI8CBouTGeJb42t9hEOhraSXcRWkUrSZ2bidOjawPD4QZBCGiuZV0F4emsGSmYxMz',
                'grant_type':'authorization_code',
                'redirect_url':'http://127.0.0.1:8000/appusers/onlogin',
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
            print(user_data['person']['displayPicture'])
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
        user.display_picture = user_data['person']['displayPicture']
        user.save()
        login(request, user)
        return Response({'Status': 'User Exists', 'access_token': acs_token})

    @action(methods = ['get', 'options',], detail=False, url_path='my_page', url_name='my_page', permission_classes=[AllowAny])
    def get_my_page(self, request):
        if request.user.is_authenticated and not request.user.is_disabled:
            code = request.GET.get('code')
            user = AppUser.objects.get(access_token = code)
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
        
        elif request.user.is_disabled:
            return Response({'Status' : 'User is disabled'})
        else:
            return Response({'Status' : 'User not Authenticated'})

    @action(methods = ['get',], detail = True, url_path='convert_role', url_name='convert_role')
    def convert_user_role(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            if request.user.user_role == 2:
                user = AppUser.objects.get(pk=pk)
                user.user_role = request.GET.get('new_role')
                user.save()
                return Response({'Status': 'Role Upgraded'})
            else: 
                return Response({'Status': 'User is not an Admin'})
        elif request.user.is_disabled:
            return Response({'Status' : 'User is disabled'})
        else:
            return Response({'Status' : 'User not Authenticated'})

    @action(methods = ['get',], detail=True, url_path='disable_user', url_name='disable_user')
    def disable_user(self, request, pk):
        if request.user.user_role == 2 and not request.user.is_disabled and request.user.is_authenticated:
            user = AppUser.objects.get(pk = pk)
            user.is_disabled = request.GET.get('is_disabled')
            user.save()
            return Response({'status': 'User Status Changed'})
        else: 
            return Response({'status': 'User is not an Admin'})

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectPOSTSerializer
        else:
            return ProjectGETSerializer

    @action(methods=['get', ], detail=True, url_path='issues', url_name='issues')
    def get_issues(self, request, pk):
        try:
            issues_list = Issues.objects.filter(project=pk)
        except KeyError:
            return Response({'Empty': 'No Issues for this project yet'}, status = status.HTTP_204_NO_CONTENT)
        ser = IssueGETSerializer(issues_list, many=True)
        return Response(ser.data)

    @action(methods=['get', 'options'], detail=False, url_path='add_project', url_name='add_path')
    def add_project(self, request):
        if request.user.is_authenticated and not request.user.is_disabled:
            code = request.GET
            name = request.GET.get('name')
            wiki = request.GET.get('wiki')
            status = request.GET.get('status')
            creator = request.GET.get('creator')
            members = []
            for x in range(len(code) - 4):
                members.append(request.GET.get('members[%d]' % x))
            creator_user = AppUser.objects.get(pk = creator)
            team_members = []
            for m in members:
                team_members.append(AppUser.objects.get(pk = m))
            newProject = Project(name = name, wiki = wiki, status = status, creator = creator_user)
            newProject.save()
            newProject.members.set(team_members)
            instance = Mailer()
            instance.newProjectStarted(project_name=name, project_creator=creator_user, team_members=team_members)
            return Response({'Status':'Project Created'})
        else:
            return Response({'Status':'User Not Authenticated.'})

    @action(methods=['get',], detail=True, url_path='status_update', url_name='status_update')
    def update_status(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            project = Project.objects.get(pk =pk)
            creator = project.creator
            if request.user == creator or request.user.user_role == 2 or request.user in project.members.all():
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

    @action(methods=['get',], detail=True, url_path='wiki_update', url_name='wiki_update')
    def update_wiki(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            project = Project.objects.get(pk =pk)
            creator = project.creator
            if request.user == creator or request.user.user_role == 2 or request.user in project.members.all():
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

    @action(methods=['get',], detail=True, url_path='add_team_members', url_name='add_team_members')
    def add_team_members(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            project = Project.objects.get(pk =pk)
            creator = project.creator
            if request.user == creator or request.user.user_role == 2:
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
    
    @action(methods=['get',], detail=True, url_path='delete_project', url_name='delete_project')
    def delete_project(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            project = Project.objects.get(pk= pk)
            creator = project.creator
            if request.user == creator or request.user.user_role == 2:
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
        
    @action(methods=['get',], detail=True, url_path='comments', url_name='comments')
    def get_issue_comments(self, request, pk):
        issue = Issues.objects.get(pk=pk)
        comments = Comment.objects.filter(issue=issue)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(methods=['get',], detail=False, url_path='add_issue', url_name='add_issue')
    def add_issue(self, request):
        if request.user.is_authenticated and not request.user.is_disabled:
            code = request.GET
            title = request.GET.get('title')
            description = request.GET.get('description')
            bug_status = request.GET.get('bug_status')
            reported_by = request.user
            project_id = request.GET.get('project')
            project = Project.objects.get(pk = project_id)
            print(code)
            tags = []
            for x in range(len(code) - 4):
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

    @action(methods=['get',], detail=True, url_path='assign', url_name='assign')
    def assign_issue(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            member_id = request.GET.get('memberId')
            issue = Issues.objects.get(pk=pk)
            project = issue.project
            if request.user == creator or request.user.user_role == 2 or request.user in issue.project.members.all():
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

    @action(methods=['get',], detail=True, url_path='close_issue', url_name='close_issue')
    def close_issue(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            issue = Issues.objects.get(pk = pk)
            project = issue.project
            if request.user == creator or request.user.user_role == 2 or request.user in project.members.all() or request.user == issue.assigned_to:
                issue.bug_status = 3
                instance = Mailer()
                instance.closeIssue(issue= issue, project_name= issue.project, reported_by= issue.reported_by, team_members= issue.project.members.all())
                issue.save()
                return Response({'Response': 'Issue Closed'})
            else:
                return Response({'Response': 'User cannot close this issue'})
        else:
            return Response({'Response': 'User not authenticated or is disabled'})

    @action(methods=['get',], detail=True, url_path='delete_issue', url_name='delete_issue')
    def delete_issue(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            issue = Issues.objects.get(pk = pk)
            project = issue.project
            if request.user == project.creator or request.user.user_role == 2 or request.user in project.members.all() or request.user == issue.assigned_to:
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

    @action(methods=['get',], detail=False, url_path='new_tag', url_name='new_tag')
    def new_tag(self, request):
        if request.user.is_authenticated and not request.user.is_disabled:
            if request.user.user_role == 2:
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
    
    @action(methods=['get',], detail=True, url_path='tag_issues', url_name='tag_issues')
    def tag_issues(self, request, pk):
        if request.user.is_authenticated and not request.user.is_disabled:
            tag = Tags.objects.get(pk = pk)
            issues = Issues.objects.filter(tags = tag)
            serializer = IssueGETSerializer(issues, many=True)
            #print(issues)
            return Response({'Response': serializer.data})
        else:
            return Response({'Response':'User disabled or not authenticated'})
