import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Comment, Issues, AppUser
from asgiref.sync import sync_to_async

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        url = self.scope['url_route']['kwargs']['issue_id']
        self.room_name = 'room' + url
        self.room_group_name = 'comment_' + self.room_name 
        print(url)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        json_data = json.loads(text_data)
        print(json_data)
        print(json_data['command'])
        await self.commands[json_data['command']](self, json_data)
         
    async def init_comments(self, data):
        acs_token = data['access_token']
        user = AppUser.objects.get(access_token = acs_token)
        print(user)
        content = {
                'command': 'init_comments'
                }
        if not user:
            content['error'] = 'Unable to get the user'
            print(content['error'])
        content['success'] = 'Chatting success with username :' + user.username
        print(content['success'])
        self.send(text_data=json.dumps(content))

    async def fetch_comments(self, data):
        url = self.scope['url_route']['kwargs'] 
        issue = Issues.objects.get(pk = url['issue_id'])
        print(issue)
        comments = Comment.objects.filter(issue = issue).order_by('created_at')
        print(comments)
        comments_list = []
        print('This is working')
        for comment in comments:
            comments_list.append({
                'id': str(comment.id),
                'commented_by': comment.commented_by.username,
                'comment': comment.comment,
                'created_at': str(comment.created_at)
                })
        content = {
                'command' : 'comments',
                'comments': comments_list
                }
        print(content)
        await self.send(text_data=json.dumps(content))

    async def new_comment(self, data):
        comment_by = data['from']
        comment_text = data['text'] 
        issue = data['issue_id']
        comment_user = AppUser.objects.get(access_token = comment_by)
        comment_issue = Issues.objects.get(pk=issue)
        comment = Comment.objects.create(commented_by = comment_user, issue = comment_issue, comment=comment_text)
        content = {
                'command': 'new_comment',
                'comment': {
                    'id': str(comment.id),
                    'commented_by': comment_user.username,
                    'comment': comment.comment,
                    'created_at': str(comment.created_at)
                    }
                }
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'receive_comment',
                    'comment': content
                    }
                )

    commands = {
            'init_comments': init_comments,
            'fetch_comments': fetch_comments,
            'new_comment': new_comment
            }
    
    async def receive_comment(self, event):
        comment = event['comment']
        print(comment)
        await self.send(text_data=json.dumps(comment))


