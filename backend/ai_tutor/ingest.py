import os
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores.pgvector import PGVector

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "ai_data")

# Use 'db' for Docker, 'localhost' for local development
CONNECTION_STRING = "postgresql+psycopg2://postgres:postgres@db:5432/skillmap"


def ingest():
    documents = []

    for file in os.listdir(DATA_DIR):
        if file.endswith(".txt"):
            loader = TextLoader(os.path.join(DATA_DIR, file))
            documents.extend(loader.load())

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    # Using OpenAI embeddings as they are more reliable and cost-effective
    embeddings = OpenAIEmbeddings()

    PGVector.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name="skillmap_docs",
        connection_string=CONNECTION_STRING,
    )

    print("✅ Ingestion completed successfully!")


if __name__ == "__main__":
    ingest()
