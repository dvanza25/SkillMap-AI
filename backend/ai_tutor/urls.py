from django.urls import path
from .views import TutorChatView

urlpatterns = [
    path("chat/", TutorChatView.as_view()),
]
