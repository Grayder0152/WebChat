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

    class Meta:
        model = ChatUser
        fields = ('username', 'password')

    def clean_password(self):
        password = self.cleaned_data.get("password")
        if len(password) < 6:
            raise ValidationError(
                'Min. 6 characters'
            )
        return password

    def clean_password2(self):
        password = self.cleaned_data.get("password")
        password2 = self.cleaned_data.get("password2")
        if password and password2 and password != password2:
            raise ValidationError(
                'Passwords not same'
            )
        return password2


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

