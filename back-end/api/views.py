from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib import auth
from django.contrib.auth.models import User
from rest_framework import status
# from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer


# class UserView(APIView):
@api_view(['GET'])
def get_users(request):
    serializer = UserSerializer()
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, email=request.data['email'])
    if not user.check_password(request.data['password']):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    auth.login(user)
    return Response({"token": token.key, "user": serializer.data})


@api_view(['POST'])
def singup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=request.data['email'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['POST'])
def logout(request):
    return Response({})
