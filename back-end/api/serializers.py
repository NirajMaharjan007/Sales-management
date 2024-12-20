from rest_framework.serializers import ModelSerializer, ValidationError
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


from .models import *


class UserSerializer(ModelSerializer):
    class Meta(object):
        model = User
        exclude = ['password']


class TokenSerializer(ModelSerializer):
    class Meta(object):
        model = Token
        fields = '__all__'


class TaxSerializer(ModelSerializer):
    class Meta(object):
        model = Tax
        fields = '__all__'


class CategorySerializer(ModelSerializer):
    class Meta(object):
        model = Category
        fields = '__all__'


class UnitSerializer(ModelSerializer):
    class Meta(object):
        model = Unit
        fields = '__all__'


class SupplierSerializer(ModelSerializer):
    class Meta(object):
        model = Supplier
        fields = '__all__'


class ProductSupplierSerializer(ModelSerializer):
    supplier_id = IntegerField()
    purchase_price = IntegerField()

    class Meta:
        model = Product_Supplier
        fields = '__all__'


class ProductSerializer(ModelSerializer):

    class Meta(object):
        model = Product
        fields = '__all__'


class InvoiceSerializer(ModelSerializer):
    class Meta(object):
        model = Invoice
        fields = '__all__'


class SaleSerializer(ModelSerializer):
    class Meta(object):
        model = Sales
        fields = '__all__'


class UserDetailSerializer(ModelSerializer):
    class Meta(object):
        model = UserDetails
        fields = '__all__'
