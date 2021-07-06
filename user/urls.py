from . import views
from django.urls import path

urlpatterns = [
    path('registration/', views.RegistrationUserFormView.as_view(), name='user_registration'),
    path('login/', views.LoginUserFormView.as_view(), name='user_login'),
    path('logout/', views.LogoutView.as_view(), name='user_logout'),

]
