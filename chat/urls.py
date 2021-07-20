from . import views
from django.urls import path

urlpatterns = [
    path('', views.ChatView.as_view(), name='chat'),
    path('send-message/', views.send_message, name='send_message')
]
