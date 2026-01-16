from django.core.management.base import BaseCommand
from roadmap.models import Roadmap, RoadmapNode


class Command(BaseCommand):
    help = "Seed initial roadmap and roadmap nodes"

    def handle(self, *args, **options):
        self.stdout.write("Seeding roadmap data...")

        # Clear old data (safe for demo)
        RoadmapNode.objects.all().delete()
        Roadmap.objects.all().delete()

        roadmap = Roadmap.objects.create(
            title="Backend Developer Roadmap"
        )

        nodes = [
            {
                "node_id": "python-basics",
                "label": "Python Basics",
                "xp": 100,
                "position_x": 100,
                "position_y": 100,
            },
            {
                "node_id": "django-fundamentals",
                "label": "Django Fundamentals",
                "xp": 150,
                "position_x": 300,
                "position_y": 100,
            },
            {
                "node_id": "django-rest",
                "label": "Django REST Framework",
                "xp": 200,
                "position_x": 500,
                "position_y": 100,
            },
            {
                "node_id": "jwt-auth",
                "label": "JWT Authentication",
                "xp": 150,
                "position_x": 700,
                "position_y": 100,
            },
        ]

        for node in nodes:
            RoadmapNode.objects.create(
                roadmap=roadmap,
                **node
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"✓ Seeded roadmap with {len(nodes)} nodes"
            )
        )
