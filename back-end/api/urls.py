from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.urls import re_path
from . import views


schema_view = get_schema_view(
    openapi.Info(
        title="Sales-management API Title",
        default_version='v1',
        description="API documentation for your project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="niraj.mhrjn770@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    re_path('api/login', views.login, name='user_login'),
    re_path('api/signup', views.singup, name='user_signup'),
    re_path('api/get_users', views.get_users, name='user_details'),
    re_path('api/', schema_view.with_ui('swagger',
            cache_timeout=0),
            name='schema-swagger-ui'),
    re_path('redoc/', schema_view.with_ui('redoc',
            cache_timeout=0),
            name='schema-redoc'),

    # path('api/logout/', views.Logout(), name='logout'),
]
