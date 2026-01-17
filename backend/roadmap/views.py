from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from roadmap.models import RoadmapNode, RoadmapEdge, UserNodeProgress
from roadmap.serializers import RoadmapNodeSerializer, RoadmapEdgeSerializer


class RoadmapNodeViewSet(ReadOnlyModelViewSet):
    serializer_class = RoadmapNodeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "node_id"

    def get_queryset(self):
        return RoadmapNode.objects.all().order_by("position_x")

    # ✅ USER-SPECIFIC TOGGLE (PERSISTENT)
    @action(detail=True, methods=["POST"])
    def toggle(self, request, node_id=None):
        node = self.get_object()

        progress, _ = UserNodeProgress.objects.get_or_create(
            user=request.user,
            node=node,
        )

        progress.completed = not progress.completed
        progress.save()

        return Response(
            {
                "node_id": node.node_id,
                "completed": progress.completed,
            },
            status=status.HTTP_200_OK
        )


class RoadmapEdgeViewSet(ReadOnlyModelViewSet):
    queryset = RoadmapEdge.objects.all()
    serializer_class = RoadmapEdgeSerializer
    permission_classes = [IsAuthenticated]
