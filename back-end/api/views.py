import mimetypes
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib import auth
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.viewsets import ViewSet
from rest_framework.authtoken.models import Token
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from .serializers import *


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


class UserViewSet(ViewSet):
    def list(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        try:
            user = User.objects.get(id=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            user = User.objects.get(id=pk)
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print(str(serializer.errors))
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist as e:
            print(str(e))
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(str(e))
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def signup(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Create user instance but don't save yet
            user = User.objects.create_user(
                username=request.data['username'],
                email=request.data['email'],
                password=request.data['password']
            )
            token = Token.objects.create(user=user)
            return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        user = get_object_or_404(User, email=request.data['email'])
        if not user.check_password(request.data['password']):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        auth.login(request, user)
        return Response({"token": token.key, "user": serializer.data})

    # Logout endpoint
    @action(detail=False, methods=['post'])
    def logout(self, request):
        if hasattr(request.user, 'authtoken_token'):
            request.user.auth_token.delete()

        request.session.flush()
        auth.logout(request=request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class UserDetailViewSet(ViewSet):
    parser_classes = (MultiPartParser, FormParser)

    def list(self, request):
        user_details = UserDetails.objects.all()
        serializer = UserDetailSerializer(user_details, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        try:
            user_detail = UserDetails.objects.get(user_id=pk)
            serializer = UserDetailSerializer(user_detail)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist as e:
            print(str(e))
            return Response({"error": "User details not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='image/(?P<pk>[^/.]+)')
    def get_user_image(self, request, *args, **kwargs):
        try:
            user_id = self.kwargs.get('pk')
            user = UserDetails.objects.get(user_id=user_id)
            content_type, _ = mimetypes.guess_type(user.profile_picture.path)

            if user.profile_picture:
                return FileResponse(user.profile_picture.open(), content_type=content_type, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Image not available for this User"}, status=status.HTTP_204_NO_CONTENT)
        except UserDetails.DoesNotExist as e:
            print(str(e))
            return Response({"error": "User Image not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        try:
            user_detail = UserDetails.objects.get(user_id=pk)
            serializer = UserDetailSerializer(user_detail, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print(str(serializer.errors))
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist as error:
            print(str(error))
            return Response({"error": "User details not found"}, status=status.HTTP_404_NOT_FOUND)


class TaxViewSet(ViewSet):
    def list(self, request):
        taxes = Tax.objects.all()
        serializer = TaxSerializer(taxes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = TaxSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            tax = Tax.objects.get(id=pk)
            tax.delete()
            return Response({"message": "Tax deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Tax.DoesNotExist:
            return Response({"error": "Tax not found"}, status=status.HTTP_404_NOT_FOUND)


class CategoryViewSet(ViewSet):
    def list(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            category = Category.objects.get(id=pk)
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            category = Category.objects.get(id=pk)
            category.delete()
            return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, pk=None):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(
            category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenViewSet(ViewSet):
    @action(detail=False, methods=['get'], url_path='by-token/(?P<token>[^/.]+)')
    def retrieve_by_token(self, request, token=None):
        try:
            token_instance = Token.objects.get(tokens=token)
            serializer = TokenSerializer(token_instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Token.DoesNotExist as e:
            print("Token does not exist", str(e))
            return Response(
                {"error": "Token not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print("An unexpected error occurred", str(e))
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, pk=None):
        try:
            token = Token.objects.get(key=pk)
            token.delete()
            return Response({"message": "Token deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

        except Token.DoesNotExist:
            return Response({"error": "Token not found"}, status=status.HTTP_404_NOT_FOUND)


class UnitViewSet(ViewSet):
    def list(self, request):
        units = Unit.objects.all()
        serializer = UnitSerializer(units, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = UnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            unit = Unit.objects.get(id=pk)
            serializer = UnitSerializer(unit)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Unit.DoesNotExist:
            return Response({"error": "Unit not found"}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, pk=None):
        try:
            category = Unit.objects.get(pk=pk)
        except Unit.DoesNotExist:
            return Response({'error': 'Unit not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UnitSerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            unit = Unit.objects.get(id=pk)
            unit.delete()
            return Response({"message": "Unit deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

        except Token.DoesNotExist:
            return Response({"error": "Unit not found"}, status=status.HTTP_404_NOT_FOUND)


class SupplierViewSet(ViewSet):
    def list(self, request):
        suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(suppliers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = SupplierSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            supplier = Supplier.objects.get(id=pk)
            serializer = SupplierSerializer(supplier)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Supplier.DoesNotExist:
            return Response({"error": "Supplier not found"}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, pk=None):
        try:
            supplier = Supplier.objects.get(pk=pk)
        except Supplier.DoesNotExist:
            return Response({'error': 'Supplier not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SupplierSerializer(
            supplier, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            supplier = Supplier.objects.get(id=pk)
            supplier.delete()
            return Response({"message": "Supplier deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

        except Supplier.DoesNotExist:
            return Response({"error": "Supplier not found"}, status=status.HTTP_404_NOT_FOUND)


class ProductViewSet(ViewSet):
    parser_classes = (MultiPartParser, FormParser)

    def list(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='image')
    def get_images(self, request):
        try:
            product = Product.objects.get()
            content_type, _ = mimetypes.guess_type(product.image.path)
            if product.image:
                return FileResponse(product.image.open(), content_type=content_type, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Image not available"}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not available"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='image/(?P<id>[^/.]+)')
    def get_image_by_id(self, request, *args, **kwargs):
        try:
            product_id = self.kwargs.get('id')
            product = Product.objects.get(id=product_id)
            content_type, _ = mimetypes.guess_type(product.image.path)

            if product.image:
                return FileResponse(product.image.open(), content_type=content_type, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Image not available for this product"}, status=status.HTTP_204_NO_CONTENT)

        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='serial/(?P<serial_number>[^/.]+)')
    def get_by_serial(self, request, serial_number=None):
        try:
            product = Product.objects.get(serial_number=serial_number)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product's Serial number not found"}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        serializer = ProductSerializer(data=request.data)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as exc:
            return Response({"message": exc.detail}, status=status.HTTP_409_CONFLICT)

    def retrieve(self, request, pk=None):
        try:
            product = Product.objects.get(id=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    def partial_update(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(
            product, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Product not Updated."}, status=status.HTTP_400_BAD_REQUEST)


class ProductSupplierViewSet(ViewSet):
    @action(detail=False, methods=['get'], url_path='product_id/(?P<product_id>[^/.]+)')
    def get_product_id(self, request, product_id=None):
        try:
            # Fetch all product suppliers with the given product_id
            product_suppliers = Product_Supplier.objects.filter(
                product_id=product_id)
            if not product_suppliers.exists():
                return Response({"message": "No suppliers found for this product."}, status=status.HTTP_404_NOT_FOUND)

            # Serialize the data
            serializer = ProductSupplierSerializer(
                product_suppliers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        product_suppliers = Product_Supplier.objects.all()
        serializer = ProductSupplierSerializer(product_suppliers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        try:
            # Check if the payload is a list
            if isinstance(request.data, list):
                # Validate and save each object in the list
                serializer = ProductSupplierSerializer(
                    data=request.data, many=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                # If the payload is a single object, process as usual
                serializer = ProductSupplierSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request):
        try:
            product_supplier = Product_Supplier.objects.get(
                id=request.data.get('id'))
            product_supplier.delete()
            return Response({"message": "Product's Supplier deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Product_Supplier.DoesNotExist:
            return Response({"error": "Product's Supplier not found"}, status=status.HTTP_404_NOT_FOUND)


class InvoiceViewSet(ViewSet):

    def list(self, request):
        invoices = Invoice.objects.all()
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = InvoiceSerializer(data=request.data)

        # serializer.is_valid()
        # print(serializer.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        try:
            invoice = Invoice.objects.get(id=pk)
            serializer = InvoiceSerializer(invoice)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            invoice = Invoice.objects.get(id=pk)
            invoice.delete()
            return Response({"message": "Invoice deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)


class SalesViewSet(ViewSet):
    parser_classes = (MultiPartParser, FormParser)

    def list(self, request):
        sales = Sales.objects.all()
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        try:
            # Check if the payload is a list
            if isinstance(request.data, list):
                # Validate and save each object in the list
                serializer = SaleSerializer(
                    data=request.data, many=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                # If the payload is a single object, process as usual
                serializer = SaleSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(str(e))
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            sale = Sales.objects.get(id=pk)
            serializer = SaleSerializer(sale)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Sales.DoesNotExist:
            return Response({"error": "Sale not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        try:
            sale = Sales.objects.get(id=pk)
            sale.delete()
            return Response({"message": "Sale deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Sales.DoesNotExist:
            return Response({"error": "Sale not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='product_id/(?P<pk>[^/.]+)')
    def get_by_product_id(self, request, pk=None):
        try:
            sales = Sales.objects.filter(product_id=pk)
            serializer = SaleSerializer(sales, many=True)

            if not sales.exists():
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("error", str(e))
            return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='created_at/(?P<pk>[^/.]+)')
    def get_by_date(self, request, pk=None):
        try:
            sales = Sales.objects.filter(created_at=pk)
            serializer = SaleSerializer(sales, many=True)

            if not sales.exists():
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("error", str(e))
            return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
