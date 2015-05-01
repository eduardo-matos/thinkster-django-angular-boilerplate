from django.db import models
from authentication.models import Account

class Post(models.Model):
    author = models.ForeignKey(Account, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=True)

    def __unicode__(self):
        return self.content
