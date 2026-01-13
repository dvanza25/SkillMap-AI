from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/roadmap/", include("roadmap.urls")),
    path("api/progress/", include("progress.urls")),
    path("api/ai/", include("ai_tutor.urls")),
]
