from django import forms
from django.core.exceptions import ValidationError
from django.forms.utils import ErrorList


def change_error_message(form: forms.Form, error: str, new_error_message: str):
    if form.errors.get(error) is not None:
        form.errors[error] = ErrorList([ValidationError(new_error_message)])
