from rest_framework.serializers import ModelSerializer, ValidationError
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


from base.models import *


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


class ProductSerializer(ModelSerializer):
    class Meta(object):
        model = Product
        fields = '__all__'

    def validate_serial_number(self, value):
        if Product.objects.filter(serial_number=value).exists():
            raise ValidationError(
                "A product with this serial number already exists.")
        return value


class ProductSupplierSerializer(ModelSerializer):
    class Meta(object):
        model = Product_Supplier
        fields = '__all__'
