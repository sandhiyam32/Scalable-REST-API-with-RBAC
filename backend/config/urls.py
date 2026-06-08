from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

# Admin panel titles
admin.site.site_header  = 'RBAC Admin Panel'
admin.site.site_title   = 'RBAC Admin'
admin.site.index_title  = 'Manage Users & Tasks'

urlpatterns = [
    path('', lambda request: redirect('/api/docs/', permanent=False)),
    path('admin/', admin.site.urls),

    # API v1
    path('api/v1/', include('accounts.urls')),
    path('api/v1/', include('tasks.urls')),

    # API Schema & Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
