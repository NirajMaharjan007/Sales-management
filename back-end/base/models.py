from django.db.models import *


# class User(Model):
#     name = CharField(max_length=100)
#     email = EmailField(unique=True)


class Tax(Model):
    id = BigIntegerField(primary_key=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta(object):
        db_table = 'taxes'

    def __str__(self):
        return self.name
