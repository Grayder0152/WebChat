from django import forms
from django.contrib.auth.forms import AuthenticationForm
from captcha.fields import CaptchaField, CaptchaTextInput

from .models import ChatUser


class RegistrationUserForm(forms.ModelForm):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Username'
            }
        ),
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                'autocomplete': 'new-password',
                'placeholder': 'Password'
            }
        ),
    )
    password2 = forms.CharField(
        label="Password (again)",
        widget=forms.PasswordInput(
            attrs={
                'autocomplete': 'new-password',
                'placeholder': 'Confirm password'
            }
        ),
        strip=False,
    )
    captcha = CaptchaField(
        widget=CaptchaTextInput(attrs={'placeholder': 'Captcha'})
    )

    class Meta:
        model = ChatUser
        fields = (
            'username',
            'password',
            'avatar'
        )


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Username'
            }
        ),
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                'autocomplete': 'new-password',
                'placeholder': 'Password'
            }
        ),
    )
    captcha = CaptchaField(
        widget=CaptchaTextInput(attrs={'placeholder': 'Captcha'})
    )
