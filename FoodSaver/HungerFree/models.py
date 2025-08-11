from django.db import models

# Create your models here.
class Food(models.Model):
    name = models.CharField(max_length=200)
    status = models.CharField(choices = (('Available', 'Available'), ('Expired', 'Expired')),default='Available', max_length=100)
    quantity = models.IntegerField()
    expiryDate = models.DateField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name