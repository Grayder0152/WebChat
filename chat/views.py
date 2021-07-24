from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from django.contrib.auth import logout
from django.shortcuts import render
from django.http import JsonResponse

from user.models import ChatUser
from .models import ChatMessage


def handler404(request, exception=None):
    return render(request, '404.html')


class ChatView(LoginRequiredMixin, ListView):
    model = ChatMessage
    template_name = 'chat/chat.html'
    context_object_name = 'messages_list'
    login_url = '/auth/login/'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        chat_users = ChatUser.objects.all()
        context['chat_users_count'] = chat_users.count()
        context['chat_users_online'] = chat_users.filter(online=True).count()
        return context

    def get_queryset(self):
        return list(ChatMessage.objects.order_by('sent_at').select_related('author'))

    def get(self, request, *args, **kwargs):
        count_load_messages = request.GET.get('countLoadMessages')
        if count_load_messages is not None:
            count_load_messages = int(count_load_messages)
            more_message = ChatMessage.objects.order_by('sent_at').select_related('author')
            if not more_message:
                return JsonResponse({'more_messages': False})
            data_more_message = []
            for message in list(more_message)[-(count_load_messages + 20):-count_load_messages]:
                obj = {
                    'message': message.message,
                    'author_username': message.author.username,
                    'author_avatar': message.author.avatar.url,
                    'sent_at': message.sent_at.strftime('%H:%M')
                }
                data_more_message.append(obj)
            return JsonResponse({'more_messages': data_more_message})

        if request.GET.get('close') is not None:
            request.user.online = False
            request.user.save()
            logout(request)
            return JsonResponse({'close': True})
        return super().get(request, *args, **kwargs)
