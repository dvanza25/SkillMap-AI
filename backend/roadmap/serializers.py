from rest_framework import serializers
from roadmap.models import RoadmapNode, RoadmapEdge, UserNodeProgress


class RoadmapNodeSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()

    class Meta:
        model = RoadmapNode
        fields = [
            "node_id",
            "label",
            "xp",
            "position_x",
            "position_y",
            "completed",
        ]

    def get_completed(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        progress = UserNodeProgress.objects.filter(
            user=request.user,
            node=obj
        ).first()

        return progress.completed if progress else False


class RoadmapEdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapEdge
        fields = ["source", "target"]
