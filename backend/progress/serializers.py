from rest_framework import serializers
from .models import UserProgress


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = "__all__"

class CompleteNodeSerializer(serializers.Serializer):
    node_id = serializers.CharField()