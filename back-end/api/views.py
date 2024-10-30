from random import randint
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib import auth
from django.contrib.auth.models import User
from rest_framework import status
# from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


from .serializers import *


# class UserView(APIView):
@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user_by_id(request, id: int):
    try:
        user = User.objects.get(id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, email=request.data['email'])
    if not user.check_password(request.data['password']):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    auth.login(request, user)
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
    if hasattr(request.user, 'authtoken_token'):
        request.user.auth_token.delete()
        request.session.flush()
        auth.logout(request=request)

    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


schema_view = get_schema_view(
    openapi.Info(
        title="Sales-management API Title",
        default_version='v1',
        description="API documentation for your project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="niraj.mhrjn770@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


@api_view(['GET'])
def get_taxes(request):
    taxes = Tax.objects.all()
    serializer = TaxSerializer(taxes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
def edit_tax(request, id: int):
    try:
        tax = Tax.objects.get(pk=id)
    except Tax.DoesNotExist:
        return Response({'error': 'Tax not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaxSerializer(tax, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def set_tax(request):
    serializer = TaxSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_tax(request, id: int):
    try:
        tax = Tax.objects.get(id=id)
        tax.delete()
        return Response({"message": "Tax deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Tax.DoesNotExist:
        return Response({"error": "Tax not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def set_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_category_by_id(request, id: int):
    try:
        category = Category.objects.get(id=id)
        serializer = UserSerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_category(request, id: int):
    try:
        category = Category.objects.get(id=id)
        category.delete()
        return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Tax.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
def updated_category(request, id: int):
    try:
        category = Category.objects.get(id=id)
        category.save()
        return Response({"message": "Category updated successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Tax.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
