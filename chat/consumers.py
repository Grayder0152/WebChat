from .models import ChatMessage
from user.models import ChatUser

import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.group_name = 'chat'

        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user = ChatUser.objects.get(username=text_data_json['username'])
        message = ChatMessage(author=user, message=text_data_json['message'])
        message.save()

        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'chat_message',
                'message': message.message,
                'sent_at': message.sent_at.strftime('%H:%M'),
                'avatar_url': message.author.avatar.url,
                'count_messages': text_data_json['count_messages']
            }
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'message': event['message'],
            'sent_at': event['sent_at'],
            'avatar_url': event['avatar_url'],
            'count_messages': event['count_messages'],
        }))
