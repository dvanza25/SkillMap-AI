from django.db import models


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
    xp = models.IntegerField(default=0)

    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)

    # ✅ NEW (needed for interactive roadmap)
    completed = models.BooleanField(default=False)

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
