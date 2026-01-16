from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from roadmap.models import RoadmapNode, RoadmapEdge
from roadmap.serializers import RoadmapNodeSerializer, RoadmapEdgeSerializer


class RoadmapNodeViewSet(ReadOnlyModelViewSet):
    queryset = RoadmapNode.objects.all().order_by("position_x")
    serializer_class = RoadmapNodeSerializer
    lookup_field = "node_id"   # 🔴 IMPORTANT

    @action(detail=True, methods=["post"])
    def complete(self, request, node_id=None):
        try:
            node = RoadmapNode.objects.get(node_id=node_id)
        except RoadmapNode.DoesNotExist:
            return Response(
                {"error": "Node not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Demo behavior: just acknowledge completion
        return Response(
            {
                "message": "Node marked as completed",
                "node_id": node.node_id,
                "xp_earned": 10,
            },
            status=status.HTTP_200_OK,
        )



class RoadmapEdgeViewSet(ReadOnlyModelViewSet):
    queryset = RoadmapEdge.objects.all()
    serializer_class = RoadmapEdgeSerializer
    permission_classes = [IsAuthenticated]
