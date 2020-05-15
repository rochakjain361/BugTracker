from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from BugTracker.permissions import *
from rest_framework.response import Response
from django.http import Http404
from rest_framework.decorators import action, permission_classes
import requests
from django.contrib.auth import login, logout
# Create your views here.

# View for displaying the AppUser Content
class AppUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(methods=['post', 'options', 'get',], detail=False, url_name='onlogin', url_path='onlogin')
    def on_login(self, request):
        code = self.request.query_params.get('code')

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

        acs_token = user_data['access_token']
        #GET ACCESS TOKEN
        headers={
                'Authorisation':'Bearer' + acs_token
                }
        user_data = requests.get(url='https://internet.channeli.in/open_auth/get_user_data/', headers=headers).json()
        return Response(user_data)

        #CHECK IF USER EXISTS

        try:
            user = AppUser.objects.get(enrNo=user_data['student']['enrolmentNumber'])
        except AppUser.DoesNotExist:
            # CHECK IMG MEMBER OR NOT
            in_img = False
            for role in user_data["person"]["roles"]:
                if role["role"] == "Maintainer":
                    in_img = True
                    break
            if im_img:
                #CREATE USER
                enrNum = user_data["student"]["enrolmentNumber"]
                email = user_data["contactInformation"]["instituteWebmailAddress"]

                name = (user_data["person"]["fullName"]).split()
                firstname = name[0]
                fullName = user_data["person"]["fullName"]

                user_role_assigned = 1
                if user_data['student']['currentYear'] >= 3:
                    user_role_assigned = 2

                newUser = AppUser(enrNo = enrNum, email=email, first_name = firstName, username=fullName, user_role = user_role_assigned, access_token = acs_token)
                newUser.save()

                return Response({'status': 'User Created', 'access_token': ac_tok}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({'status': 'User not in IMG'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request=request, user=user)
        return Response({'Status': 'User Exits', 'access_token': acs_token})

    @action(methods=['post', 'options', ], detail=False, url_name='login', url_path='login')
    def login(self, request):

        data = self.request.data
        token = data['access_token']

        try:
            user = AppUser.objects.get(access_token=token)
        except AppUser.DoesNot.Exist:
            return Response({'status': 'user does not exist in database'}, status=status.HTTP_403_FORBIDDEN)
        login(request=request, user=user)
        return Response({'status': 'user found'}, status=status.HTTP_202_ACCEPTED)

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
        return Response(ser.data)

    @action(methods=['get', ], detail=True, url_path='creator', url_name='creator')
    def get_creator(self, request, pk):
        project = Project.objects.get(pk = pk)
        creator = project.creator

        ser = AppUserSerializer(creator)
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
