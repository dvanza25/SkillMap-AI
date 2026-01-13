from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from roadmap.models import RoadmapNode, UserNodeProgress


class CompleteNodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        node_id = request.data.get("node_id")

        try:
            node = RoadmapNode.objects.get(node_id=node_id)
        except RoadmapNode.DoesNotExist:
            return Response({"error": "Node not found"}, status=404)

        progress, created = UserNodeProgress.objects.get_or_create(
            user=request.user,
            node=node,
        )

        # Toggle completion status
        if progress.completed:
            progress.completed = False
            message = "Node uncompleted"
        else:
            progress.completed = True
            message = "Node completed"

        progress.save()

        return Response(
            {
                "message": message,
                "completed": progress.completed,
                "earned_xp": node.xp if progress.completed else 0,
                "total_xp": self._total_xp(request.user),
            }
        )

    def _total_xp(self, user):
        return sum(
            p.node.xp
            for p in UserNodeProgress.objects.filter(user=user, completed=True)
        )
