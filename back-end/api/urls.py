from django.urls import re_path
from . import views

urlpatterns = [
    re_path('api/login', views.login, name='user_login'),
    re_path('api/signup', views.singup, name='user_signup'),
    re_path('api/get_users', views.get_users, name='user_details'),

    # path('api/logout/', views.Logout(), name='logout'),
]
