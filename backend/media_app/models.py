from django.db import models
from django.contrib.auth.models import User

class Media(models.Model):
    TYPE_CHOICES = [
        ('Movie', 'Movie'),
        ('TV', 'TV'),
    ]

    STATUS_CHOICES = [
        ('Watched', 'Watched'),
        ('Unwatched', 'Unwatched'),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Unwatched')
    rating = models.PositiveIntegerField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='media_items')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.type}) - {self.status}"
