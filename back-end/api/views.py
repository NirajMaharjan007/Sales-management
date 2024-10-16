from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def get(request):
    person = {"Name": "John", "Email": "example@example.com",
              "Gender": "Male", "Age": "69"}
    return Response(person)
