from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from django.http import JsonResponse
from .serializers import LoginSerializer


@api_view(['GET'])
def get(request):
    person = {"Name": "John", "Email": "example@example.com",
              "Gender": "Male", "Age": "69"}
    return Response(person)


@api_view(['GET'])
def get_view(request, format=None):
    content = {
        'user': str(request.user),
        'auth': str(request.auth),
    }
    return Response(content)


@api_view(['POST'])
class Login(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user is not None:
                # Perform login action (e.g., create a session)
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
class Logout(APIView):
    @api_view(['POST'])
    def logout_view(request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
