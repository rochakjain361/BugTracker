from rest_framework import routers
from BugTracker.views import *

url_router = routers.DefaultRouter()

url_router.register(r'appusers', AppUserViewSet)
url_router.register(r'project', ProjectViewSet)
url_router.register(r'issues', IssuesViewSet)
url_router.register(r'comment', CommentViewSet)
url_router.register(r'issue_images', IssueImageViewSet)
url_router.register(r'tags', TagViewSet)
