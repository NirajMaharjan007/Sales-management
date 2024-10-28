from django.db.models import Model, CharField, IntegerField


# class User(Model):
#     name = CharField(max_length=100)
#     email = EmailField(unique=True)


class Tax(Model):
    tax = IntegerField()
