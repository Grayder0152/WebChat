from .models import ChatMessage
from django.contrib import admin


@admin.register(ChatMessage)
class ChatUserAdmin(admin.ModelAdmin):
    list_display = ('author', 'sent_at', 'id')

