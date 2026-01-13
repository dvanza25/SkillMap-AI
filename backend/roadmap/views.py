from rest_framework.viewsets import ReadOnlyModelViewSet
from roadmap.models import RoadmapNode, RoadmapEdge
from roadmap.serializers import RoadmapNodeSerializer, RoadmapEdgeSerializer


class RoadmapNodeViewSet(ReadOnlyModelViewSet):
    queryset = RoadmapNode.objects.all().order_by("position_x")
    serializer_class = RoadmapNodeSerializer


class RoadmapEdgeViewSet(ReadOnlyModelViewSet):
    queryset = RoadmapEdge.objects.all()
    serializer_class = RoadmapEdgeSerializer
