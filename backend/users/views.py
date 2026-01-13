from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import LoginSerializer, UserSerializer, SignupSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create profile for new user
            from users.models import Profile
            Profile.objects.create(user=user, xp=0)
            
            # Generate tokens for immediate login
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Account created successfully",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            })
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

