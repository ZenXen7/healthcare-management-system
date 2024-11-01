from django.db import models
from django.contrib.auth.models import User


class Provider(models.Model):
    account = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.account.username})"
    

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=30)
    birthday = models.DateField(null=False)
    contact_number = models.CharField(max_length=15)
    address = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    height = models.PositiveIntegerField()
    weight = models.PositiveIntegerField()

    def __str__(self):
        return self.last_name
    
class MedicationHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_prescribed = models.DateField(null=False)
    generic_name = models.CharField(max_length=30)
    dosage = models.CharField(max_length=30)
    quantity = models.PositiveIntegerField()
    instructions = models.TextField()

class VaccinationHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_added = models.DateField(null=False)
    date_administered = models.DateField(null=False)
    vaccine_name = models.CharField(max_length=30)
    provider = models.CharField(max_length=30)
    site_given = models.CharField(max_length=30)
    dose_ml = models.CharField(max_length=20)
    next_dose_date = models.DateField(null=False)



