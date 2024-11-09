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


class ProductSupplierSerializer(ModelSerializer):
    supplier_id = IntegerField()
    purchase_price = IntegerField()

    class Meta:
        model = Product_Supplier
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    suppliers = ProductSupplierSerializer(many=True)

    class Meta(object):
        model = Product
        fields = '__all__'

    def validate_serial_number(self, value):
        if Product.objects.filter(serial_number=value).exists():
            raise ValidationError(
                "A product with this serial number already exists.")
        return value

    def create(self, validated_data):
        suppliers_data = validated_data.pop('suppliers')
        product = Product.objects.create(**validated_data)

        for supplier_data in suppliers_data:
            Product_Supplier.objects.create(
                product=product,
                supplier_id=supplier_data['supplier_id'],
                purchase_price=supplier_data['purchase_price']
            )
        return product
