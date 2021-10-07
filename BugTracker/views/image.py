from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *
from BugTracker.permissions import *
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import BasicAuthentication


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
