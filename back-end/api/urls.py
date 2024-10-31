from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'token', views.TokenViewSet, basename='token')
router.register(r'tax', views.TaxViewSet, basename='tax')
router.register(r'category', views.CategoryViewSet, basename='category')
router.register(r'unit', views.UnitViewSet, basename='unit')
router.register(r'supplier', views.SupplierViewSet, basename='supplier')


urlpatterns = [
    path('swagger/', views.schema_view.with_ui('swagger'),
         name='schema-swagger-ui'),
    path('redoc/', views.schema_view.with_ui('redoc'),
         name='schema-redoc'),

    path('api/', include(router.urls)),
]
