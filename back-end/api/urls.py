from django.urls import re_path
from . import views


urlpatterns = [
    re_path('api/login', views.login, name='user_login'),
    re_path('api/signup', views.singup, name='user_signup'),
    re_path('api/get_users', views.get_users, name='user_details'),
    re_path('api/', views.schema_view.with_ui('swagger',
            cache_timeout=0),
            name='schema-swagger-ui'),
    re_path('redoc/', views.schema_view.with_ui('redoc',
            cache_timeout=0),
            name='schema-redoc'),

    # path('api/logout/', views.Logout(), name='logout'),
]
