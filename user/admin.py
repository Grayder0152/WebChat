from .models import ChatUser
from django.contrib import admin
from django.contrib.auth.models import Group


@admin.register(ChatUser)
class ChatUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'id')
    readonly_fields = ('is_active', 'is_superuser', 'is_staff', 'groups', 'user_permissions', 'last_login', 'password')


admin.site.unregister(Group)
