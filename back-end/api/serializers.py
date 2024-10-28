from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User

from base.models import Tax


class UserSerializer(ModelSerializer):
    class Meta(object):
        model = User
        exclude = ['password']


class TaxSerializer(ModelSerializer):
    class Meta(object):
        model = Tax
        fields = '__all__'
