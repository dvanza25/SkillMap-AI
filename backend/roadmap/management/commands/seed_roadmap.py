from django.core.management.base import BaseCommand
from roadmap.models import Roadmap, RoadmapNode, RoadmapEdge


class Command(BaseCommand):
    help = "Seed demo roadmap data for SkillMap AI"

    def handle(self, *args, **options):
        # Clean slate (safe for demo)
        RoadmapEdge.objects.all().delete()
        RoadmapNode.objects.all().delete()
        Roadmap.objects.all().delete()

        roadmap = Roadmap.objects.create(
            title="Backend Python Developer",
            description="Backend learning roadmap with Django and APIs",
        )

        nodes = [
            {
                "node_id": "python",
                "label": "Python Basics",
                "xp": 20,
                "position_x": 0,
                "position_y": 0,
            },
            {
                "node_id": "django",
                "label": "Django Fundamentals",
                "xp": 20,
                "position_x": 200,
                "position_y": 0,
            },
            {
                "node_id": "drf",
                "label": "Django Rest Framework",
                "xp": 20,
                "position_x": 400,
                "position_y": 0,
            },
            {
                "node_id": "auth",
                "label": "JWT Authentication",
                "xp": 20,
                "position_x": 600,
                "position_y": 0,
            },
        ]

        node_map = {}

        for node in nodes:
            obj = RoadmapNode.objects.create(
                roadmap=roadmap,
                **node,
            )
            node_map[node["node_id"]] = obj

        edges = [
            ("python", "django"),
            ("django", "drf"),
            ("drf", "auth"),
        ]

        for source, target in edges:
            RoadmapEdge.objects.create(
                roadmap=roadmap,
                source=source,
                target=target,
            )

        self.stdout.write(self.style.SUCCESS("✅ Roadmap seeded successfully"))
