from .models import ChatMessage
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from django.http import HttpResponseRedirect


def send_message(request):
    if request.method == 'POST':
        message = ChatMessage(author=request.user, message=request.POST.get('message'))
        message.save()
    return HttpResponseRedirect('/')


class ChatView(LoginRequiredMixin, ListView):
    model = ChatMessage
    template_name = 'chat/chat.html'
    context_object_name = 'messages_list'
    login_url = '/auth/login/'

    def get_queryset(self):
        return ChatMessage.objects.order_by('sent_at').select_related('author')
