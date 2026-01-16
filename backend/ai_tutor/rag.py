from django.conf import settings

from google import genai
from langchain_community.vectorstores.pgvector import PGVector
from langchain_community.embeddings import FakeEmbeddings
from roadmap.models import RoadmapNode, RoadmapEdge

# -----------------------------------
# Configuration
# -----------------------------------
CONNECTION_STRING = "postgresql+psycopg2://postgres:postgres@db:5432/skillmap"
COLLECTION_NAME = "skillmap_docs"

# Gemini client (NEW, SUPPORTED)
client = genai.Client(api_key=settings.GEMINI_API_KEY)

GEMINI_MODEL = "gemini-2.5-flash"

def get_roadmap_sequence(node_id: str):
    """
    Returns previous and next nodes in the roadmap graph.
    """
    try:
        edge = RoadmapEdge.objects.get(source=node_id)
        next_node = RoadmapNode.objects.get(node_id=edge.target)
    except RoadmapEdge.DoesNotExist:
        next_node = None

    return next_node


# -----------------------------------
# Vectorstore
# -----------------------------------
def get_vectorstore():
    embeddings = FakeEmbeddings(size=384)

    return PGVector(
        connection_string=CONNECTION_STRING,
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
    )


# -----------------------------------
# Retrieval
# -----------------------------------
def retrieve_context(question: str, node_id: int, k: int = 3):
    vectorstore = get_vectorstore()

    retriever = vectorstore.as_retriever(
        search_kwargs={
            "k": k,
            "filter": {"node_id": node_id},
        }
    )

    docs = retriever.invoke(question)
    return docs


# -----------------------------------
# Gemini Answer Generation
# -----------------------------------
def generate_answer(question: str, node_id: str, roadmap_hint: str):
    vectorstore = get_vectorstore()

    docs = vectorstore.similarity_search(
        question,
        k=4,
        filter={"node_id": node_id},
    )

    context = "\n".join(doc.page_content for doc in docs) or "No context found."

    prompt = f"""
You are an AI Tutor.

STRICT RULES:
- You MUST follow the roadmap order.
- You MUST NOT suggest topics outside the roadmap.
- If no next topic exists, say so clearly.

{roadmap_hint}

Context:
{context}

Question:
{question}

Answer:
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "answer": response.text,
        "sources": [doc.metadata.get("title") for doc in docs],
    }
