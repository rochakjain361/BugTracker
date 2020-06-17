from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from BugTracker import consumers

websocket_urlpatterns = [
        re_path(r'^ws/comments/(?P<issue_id>[^/]+)$', consumers.CommentConsumer)        ]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
            )
        ),
})
