from django.db import models
from django.contrib.auth import get_user_model
from roadmap.models import RoadmapNode

User = get_user_model()


class UserNodeProgress(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="node_progress"
    )
    node = models.ForeignKey(
        RoadmapNode,
        on_delete=models.CASCADE,
        related_name="user_progress"
    )
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "node")

    def __str__(self):
        return f"{self.user} - {self.node}"
