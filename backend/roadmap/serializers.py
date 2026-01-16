from rest_framework import serializers
from roadmap.models import RoadmapNode, RoadmapEdge


class RoadmapNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapNode
        fields = [
            "node_id",
            "label",
            "xp",
            "completed",      # ✅ NEW
            "position_x",
            "position_y",
        ]


class RoadmapEdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapEdge
        fields = [
            "source",
            "target",
        ]
