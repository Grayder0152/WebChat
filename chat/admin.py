from django.contrib import admin

from .models import ChatMessage


@admin.register(ChatMessage)
class ChatUserAdmin(admin.ModelAdmin):
    list_display = ('author', 'sent_at', 'id')

