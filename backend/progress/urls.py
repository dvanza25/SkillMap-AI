from django.urls import path
from .views import CompleteNodeView

urlpatterns = [
    path("complete-node/", CompleteNodeView.as_view()),
]
