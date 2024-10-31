from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


from base.models import *


class UserSerializer(ModelSerializer):
    class Meta(object):
        model = User
        exclude = ['password']


class TaxSerializer(ModelSerializer):
    class Meta(object):
        model = Tax
        fields = '__all__'


class CategorySerializer(ModelSerializer):
    class Meta(object):
        model = Category
        fields = '__all__'


class TokenSerializer(ModelSerializer):
    class Meta(object):
        model = Token
        fields = '__all__'
