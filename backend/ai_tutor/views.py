from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

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

        try:
            result = generate_answer(question, node_id)
            return Response(result)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=500
            )
