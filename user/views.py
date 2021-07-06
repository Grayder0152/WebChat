from .forms import RegistrationUserForm, LoginUserForm
from .models import ChatUser
from django.http import HttpResponseRedirect
from django.views.generic.edit import FormView
from django.contrib.auth import login, logout
from django.views.generic.base import View


class RegistrationUserFormView(FormView):
    form_class = RegistrationUserForm
    success_url = '/auth/authentication/'
    template_name = 'user/registration.html'

    def form_valid(self, form):
        ChatUser.objects.create_user(
            username=self.request.POST.get('username'),
            password=self.request.POST.get('password')
        )
        return super().form_valid(form)


class LoginUserFormView(FormView):
    form_class = LoginUserForm
    success_url = "/"
    template_name = "user/login.html"

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        self.user = form.get_user()
        login(self.request, self.user)
        return super().form_valid(form)


class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect("/")
