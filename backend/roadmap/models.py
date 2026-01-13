from django.db import models
from django.contrib.auth.models import User


class Roadmap(models.Model):
    title = models.CharField(max_length=255, default="")
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return self.title


class RoadmapNode(models.Model):
    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name="nodes",
    )

    node_id = models.CharField(max_length=50, default="")
    label = models.CharField(max_length=255, default="")
    xp = models.IntegerField(default=10)

    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)

    def __str__(self):
        return self.label


class RoadmapEdge(models.Model):
    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name="edges",
    )
    source = models.CharField(max_length=50, default="")
    target = models.CharField(max_length=50, default="")


class UserNodeProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    node = models.ForeignKey(RoadmapNode, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "node")
