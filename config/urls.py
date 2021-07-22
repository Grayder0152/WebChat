from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
handler404 = 'chat.views.handler404'
app_name = "chat"
urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('user.urls')),
    path('', include('chat.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)