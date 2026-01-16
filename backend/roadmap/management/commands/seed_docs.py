from django.core.management.base import BaseCommand
from roadmap.models import RoadmapNode

from langchain_community.vectorstores.pgvector import PGVector
from langchain_community.embeddings import FakeEmbeddings
from langchain.schema import Document


CONNECTION_STRING = "postgresql+psycopg2://postgres:postgres@db:5432/skillmap"
COLLECTION_NAME = "skillmap_docs"


class Command(BaseCommand):
    help = "Seed roadmap nodes into PGVector using FakeEmbeddings (demo-only)"

    def handle(self, *args, **options):
        self.stdout.write("Initializing vectorstore (FakeEmbeddings)...")

        # ✅ ZERO download, ZERO GPU, ZERO API
        embeddings = FakeEmbeddings(size=384)

        vectorstore = PGVector(
            collection_name=COLLECTION_NAME,
            connection_string=CONNECTION_STRING,
            embedding_function=embeddings,
        )

        self.stdout.write(self.style.SUCCESS("✓ Vectorstore initialized"))

        nodes = RoadmapNode.objects.all()
        self.stdout.write(f"Processing {nodes.count()} nodes...")

        if not nodes.exists():
            self.stdout.write(
                self.style.WARNING("No roadmap nodes found. Run seed_roadmap first.")
            )
            return

        documents = []
        for node in nodes:
            documents.append(
                Document(
                    page_content=node.label,
                    metadata={
                        "node_id": node.node_id,
                        "title": node.label,
                    },
                )
            )

        vectorstore.add_documents(documents)

        self.stdout.write(
            self.style.SUCCESS(
                f"✓ Seeded {len(documents)}/{len(documents)} documents into vector store"
            )
        )
