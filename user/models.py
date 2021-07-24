from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class ChatUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, password, avatar):
        if not username:
            raise ValueError('The given username must be set')
        user = self.model(username=username, password=password, avatar=avatar)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        user = self.create_user(username, password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True

        user.save(using=self._db)
        return user

    def get_by_natural_key(self, username):
        return self.get(username=username)


class ChatUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    avatar = models.ImageField(upload_to='avatars/', default='default_avatar.jpg', null=True, blank=True)
    online = models.BooleanField(default=False)

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'username'
    objects = ChatUserManager()

    def __str__(self):
        return f'{self.username}'

    def get_short_name(self):
        return self.username

    def save(self, *args, **kwargs):
        self.set_password(self.password)
        super().save(*args, **kwargs)