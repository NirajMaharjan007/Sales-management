from django.db.models import *


class Tax(Model):
    id = IntegerField(primary_key=True)
    created_at = DateTimeField(auto_now_add=True)

    class Meta(object):
        db_table = 'taxes'

    def __str__(self):
        return self.name


class Category(Model):
    id = AutoField(primary_key=True)
    name = CharField(max_length=256)
    active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        db_table = 'categories'


class Unit(Model):
    id = AutoField(primary_key=True)
    name = CharField(max_length=256)
    active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        db_table = 'units'


class Supplier(Model):
    id = AutoField(primary_key=True)
    name = CharField(max_length=255)
    mobile = CharField(max_length=12)
    address = TextField(blank=True, null=True)
    details = TextField(blank=True, null=True)
    previous_balance = IntegerField(default=0)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        db_table = 'suppliers'
        ordering = ['-created_at', '-updated_at']

    def __str__(self) -> str:
        return self.name


class Product(Model):
    id = AutoField(primary_key=True)
    name = CharField(max_length=255)
    serial_number = CharField(max_length=128, unique=True)
    model = CharField(max_length=100)
    category_id = ForeignKey(
        Category, on_delete=CASCADE, db_column='category_id')
    sales_price = IntegerField(default=0)
    qty = IntegerField(default=0)
    unit_id = ForeignKey(Unit, on_delete=CASCADE, db_column='unit_id')
    image = ImageField(upload_to='item_images', null=True,
                       blank=True, max_length=None)
    tax_id = ForeignKey(Tax, on_delete=SET_NULL, null=True, db_column='tax_id')
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        db_table = 'product'
        ordering = ['-created_at', '-updated_at']

    def __str__(self):
        return self.name


class Product_Supplier(Model):
    id = AutoField(primary_key=True)
    product_id = ForeignKey(Product, on_delete=CASCADE, db_column='product_id')
    supplier_id = ForeignKey(
        Supplier, on_delete=CASCADE, db_column='supplier_id')
    purchase_price = IntegerField(default=0)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        db_table = 'product_supplier'
        ordering = ['-created_at', '-updated_at']
        unique_together = ('product_id', 'supplier_id')

    def __str__(self):
        return self.name


class Invoice(Model):
    id = AutoField(primary_key=True)
    customer_code = CharField(unique=True, max_length=7)
    total = FloatField()
    created_at = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'invoices'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Sales(Model):
    id = AutoField(primary_key=True)
    invoice_id = ForeignKey(Invoice, on_delete=CASCADE, db_column='invoice_id')
    product_id = ForeignKey(Product, on_delete=CASCADE, db_column='product_id')
    qty = IntegerField()
    price = IntegerField()
    discount = IntegerField(default=0)
    amount = DecimalField(max_digits=10, decimal_places=4, default=0.0000)
    created_at = DateField(auto_now_add=True)
    updated_at = DateField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'sales'
        ordering = ['-created_at']
