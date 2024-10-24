from django.urls import path
from . import views

urlpatterns = [
    path('api/login', views.Login, name='login'),
    # path('api/logout/', views.Logout(), name='logout'),
]
