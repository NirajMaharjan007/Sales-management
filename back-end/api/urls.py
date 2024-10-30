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
    path('api/delete_tax/<int:id>/', views.delete_tax, name='delete_tax'),

    path('api/set_category', views.set_category, name='set_category'),
    path('api/get_categories', views.get_categories, name='get_categories'),
    path('api/delete_category/<int:id>/', views.delete_category,
         name='delete_category'),
    path('api/edit_category/<int:id>/', views.updated_category,
         name='updated_category'),
    path('api/get_category/<int:id>/', views.get_category_by_id,
         name='get_category_by_id'),

    path('api/', views.schema_view.with_ui('swagger'),
         name='schema-swagger-ui'),
    path('redoc/', views.schema_view.with_ui('redoc'),
         name='schema-redoc'),



    # path('api/logout/', views.Logout(), name='logout'),
]
