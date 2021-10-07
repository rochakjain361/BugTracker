from rest_framework import viewsets
from BugTracker.serializers import *
from BugTracker.models import *

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
