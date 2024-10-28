from django.urls import path
from . import views


urlpatterns = [
    path('api/login', views.login, name='user_login'),
    path('api/logout', views.logout, name='user_logout'),
    path('api/signup', views.singup, name='user_signup'),
    path('api/get_users', views.get_users, name='user_details'),
    path('api/get_user_by_id/<int:id>/', views.get_user_by_id,
         name='user_details_by_id'),

    path('api/get_taxes', views.get_taxes, name='get_taxes'),
    path('api/set_tax', views.set_tax, name='set_tax'),
    path('api/edit_tax/<int:id>/', views.edit_tax, name='edit_tax'),

    path('api/', views.schema_view.with_ui('swagger'),
         name='schema-swagger-ui'),
    path('redoc/', views.schema_view.with_ui('redoc'),
         name='schema-redoc'),



    # path('api/logout/', views.Logout(), name='logout'),
]
