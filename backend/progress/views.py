from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from roadmap.models import RoadmapNode
from .models import UserNodeProgress


class CompleteNodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        node_id = request.data.get("node_id")

        if not node_id:
            return Response(
                {"error": "node_id is required"},
                status=400,
            )

        node = get_object_or_404(RoadmapNode, id=node_id)

        progress, created = UserNodeProgress.objects.get_or_create(
            user=request.user,
            node=node,
        )

        if progress.completed:
            return Response(
                {"message": "Node already completed"},
                status=200,
            )

        progress.completed = True
        progress.earned_xp = node.xp
        progress.save()

        total_xp = (
            UserNodeProgress.objects
            .filter(user=request.user, completed=True)
            .aggregate(models.Sum("earned_xp"))["earned_xp__sum"] or 0
        )

        return Response(
            {
                "message": "Node completed",
                "node": node.label,
                "earned_xp": node.xp,
                "total_xp": total_xp,
            }
        )
