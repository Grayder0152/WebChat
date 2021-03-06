from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic.edit import FormView
from django.contrib.auth import login, logout
from django.views.generic import View, DetailView

from .forms import RegistrationUserForm, LoginUserForm
from .models import ChatUser
from .services import change_error_message


def change_user_data(request):
    user = request.user
    user.username = request.POST.get('username', user.username)
    user.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


def user_status(request):
    data = {'data': request.POST}
    form = LoginUserForm(**data)
    if form.is_valid():
        return JsonResponse({'login': True})
    else:
        return JsonResponse({'login': False})


class RegistrationUserFormView(FormView):
    form_class = RegistrationUserForm
    success_url = '/auth/login/'
    template_name = 'user/registration.html'

    def form_valid(self, form):
        form.instance.set_password(self.request.POST['password'])
        form.save()
        return super().form_valid(form)

    def get(self, request, *args, **kwargs):
        username = request.GET.get('username')
        if username is not None:
            data = {'exists': False}
            if ChatUser.objects.filter(username=username):
                data = {'exists': True}
            return JsonResponse(data)
        return super().get(request, *args, **kwargs)


class LoginUserFormView(FormView):
    form_class = LoginUserForm
    success_url = "/"
    template_name = "user/login.html"

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            change_error_message(form, '__all__', 'Invalid username or password')
            change_error_message(form, 'username', 'Username field is required.')
            change_error_message(form, 'password', 'Password field is required.')
            return self.form_invalid(form)

    def form_valid(self, form):
        self.user = form.get_user()
        self.user.online = True
        self.user.save()
        login(self.request, self.user)
        return super().form_valid(form)


class LogoutView(View):
    def get(self, request):
        request.user.online = False
        request.user.save()
        logout(request)
        return HttpResponseRedirect("/")


class ProfileView(DetailView):
    model = ChatUser
    template_name = 'user/profile.html'
    context_object_name = 'user'

    def get(self, request, *args, **kwargs):
        if request.user.id != kwargs.get('pk'):
            return HttpResponseRedirect('/')
        return super().get(request, *args, **kwargs)
