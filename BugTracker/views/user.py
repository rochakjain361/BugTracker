from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
import requests
from django.contrib.auth import login
from IMG_Summer_Project.settings import base_config

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
