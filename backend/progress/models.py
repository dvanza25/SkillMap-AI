from django.conf import settings
from django.db import models
from roadmap.models import RoadmapNode
from django.contrib.auth.models import User

User = settings.AUTH_USER_MODEL


class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    node = models.ForeignKey(RoadmapNode, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "node")
