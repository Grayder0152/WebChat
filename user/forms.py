from .models import ChatUser
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm


class RegistrationUserForm(forms.ModelForm):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(attrs={'placeholder': 'Username'}),
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'placeholder': 'Password'}),
    )
    password2 = forms.CharField(
        label="Password (again)",
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'placeholder': 'Confirm password'}),
        strip=False,
    )
    avatar = forms.ImageField(
        label="Avatar",
        widget=forms.FileInput(),
        required=False
    )

    class Meta:
        model = ChatUser
        fields = ('username', 'password', 'avatar')


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(attrs={'placeholder': 'Username'}),
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password', 'placeholder': 'Password'}),
    )
