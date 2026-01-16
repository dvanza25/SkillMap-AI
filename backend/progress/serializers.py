from rest_framework import serializers
from .models import UserNodeProgress

class UserNodeProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNodeProgress
        fields = "__all__"
        read_only_fields = ("user", "earned_xp")

class CompleteNodeSerializer(serializers.Serializer):
    node_id = serializers.CharField()