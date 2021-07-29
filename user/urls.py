from django.urls import path

from . import views


urlpatterns = [
    path('registration/', views.RegistrationUserFormView.as_view(), name='user_registration'),
    path('login/', views.LoginUserFormView.as_view(), name='user_login'),
    path('logout/', views.LogoutView.as_view(), name='user_logout'),
    path('profile/<int:pk>/', views.ProfileView.as_view(), name='user_profile'),
    path('change-data/', views.change_user_data, name='change_user_data'),
    path('user-status/', views.user_status, name='user_status'),

]
