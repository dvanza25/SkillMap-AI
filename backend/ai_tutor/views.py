from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .rag import get_qa_chain


class TutorChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question")

        if not question:
            return Response({"error": "Question is required"}, status=400)

        try:
            qa = get_qa_chain()
            answer = qa.run(question)
            return Response({"answer": answer})
        except ModuleNotFoundError as e:
            return Response(
                {
                    "error": f"LangChain module error: {str(e)}. Please check your requirements.txt",
                    "type": "import_error",
                },
                status=500,
            )
        except Exception as e:
            error_msg = str(e)
            if "OPENAI_API_KEY" in error_msg or "API key" in error_msg:
                return Response(
                    {
                        "error": "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
                        "type": "missing_api_key",
                    },
                    status=500,
                )
            elif "skillmap_docs" in error_msg or "collection" in error_msg:
                return Response(
                    {
                        "error": "Knowledge base not initialized. Please run the data ingestion script first.",
                        "type": "missing_knowledge_base",
                    },
                    status=500,
                )
            else:
                return Response(
                    {
                        "error": f"Error processing your question: {error_msg}",
                        "type": "general_error",
                    },
                    status=500,
                )
