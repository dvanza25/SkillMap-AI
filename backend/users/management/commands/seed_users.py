from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = "Seed a demo user for SkillMap AI"

    def handle(self, *args, **options):
        username = "demo"
        password = "demo123"

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING("Demo user already exists")
            )
            return

        User.objects.create_user(
            username=username,
            password=password,
            is_staff=True,
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Demo user created:\n"
                "Username: demo\n"
                "Password: demo123"
            )
        )
