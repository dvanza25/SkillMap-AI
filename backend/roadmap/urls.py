from django.urls import path, include
from rest_framework.routers import DefaultRouter
from roadmap.views import RoadmapNodeViewSet, RoadmapEdgeViewSet

router = DefaultRouter()
router.register("nodes", RoadmapNodeViewSet, basename="roadmap-nodes")
router.register("edges", RoadmapEdgeViewSet, basename="roadmap-edges")

urlpatterns = [
    path("", include(router.urls)),
]
