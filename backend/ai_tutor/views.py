from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from roadmap.services import get_next_node
from roadmap.models import RoadmapNode
from .rag import generate_answer


class TutorChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("message")
        node_id = request.data.get("node_id")

        if not question or not node_id:
            return Response(
                {"error": "message and node_id are required"},
                status=400
            )
        
        # ✅ Validate node exists
        try:
            current_node = RoadmapNode.objects.get(node_id=node_id)
        except RoadmapNode.DoesNotExist:
            return Response(
                {"error": "Invalid node_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Get next node from roadmap graph
        next_node = get_next_node(node_id)

        if next_node:
            roadmap_hint = (
                f"According to the roadmap, after **{current_node.label}**, "
                f"the next topic is **{next_node.label}**."
            )
        else:
            roadmap_hint = (
                f"**{current_node.label}** is the final topic in your roadmap."
            )

        try:
            result = generate_answer(question, node_id, roadmap_hint)
            return Response(result)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=500
            )
