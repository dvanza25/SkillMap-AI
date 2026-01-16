from django.conf import settings

from google import genai
from langchain_community.vectorstores.pgvector import PGVector
from langchain_community.embeddings import FakeEmbeddings

# -----------------------------------
# Configuration
# -----------------------------------
CONNECTION_STRING = "postgresql+psycopg2://postgres:postgres@db:5432/skillmap"
COLLECTION_NAME = "skillmap_docs"

# Gemini client (NEW, SUPPORTED)
client = genai.Client(api_key=settings.GEMINI_API_KEY)

GEMINI_MODEL = "gemini-2.5-flash"


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
def generate_answer(question: str, node_id: int):
    docs = retrieve_context(question, node_id)

    if not docs:
        context = "No relevant study material found."
    else:
        context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are an AI Tutor helping a student learn software development.

Use the context below to answer the question clearly and concisely.

Context:
{context}

Question:
{question}

Answer:
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return {
        "answer": response.text,
        "sources": [doc.metadata.get("title", "Roadmap Doc") for doc in docs],
    }
