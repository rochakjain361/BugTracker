from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

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
