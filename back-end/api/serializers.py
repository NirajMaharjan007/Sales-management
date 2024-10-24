from rest_framework.serializers import ModelSerializer, Serializer, CharField
from base.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class LoginSerializer(Serializer):
    username = CharField(required=True)
    password = CharField(required=True, write_only=True)
