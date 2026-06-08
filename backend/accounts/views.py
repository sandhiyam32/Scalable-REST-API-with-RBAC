from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.utils import extend_schema
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, UserSerializer
from .permissions import IsAdmin

User = get_user_model()


# Adds role + username into the JWT payload
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role']     = user.role
        token['username'] = user.username
        return token


class LoginView(TokenObtainPairView):
    """Login with username & password — returns access + refresh tokens."""
    serializer_class = CustomTokenObtainPairSerializer

    @extend_schema(summary='Login — returns JWT access + refresh tokens')
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class RegisterView(generics.CreateAPIView):
    """Register a new user. No authentication required."""
    queryset           = User.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(summary='Register a new user (public)')
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    """Blacklist the refresh token so it can no longer be used."""

    @extend_schema(summary='Logout — blacklists the refresh token')
    def post(self, request):
        try:
            RefreshToken(request.data['refresh']).blacklist()
            return Response({'detail': 'Logged out successfully.'})
        except Exception:
            return Response(
                {'detail': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProfileView(generics.RetrieveUpdateAPIView):
    """View or update the currently logged-in user's profile."""
    serializer_class   = UserSerializer
    http_method_names  = ['get', 'patch']

    @extend_schema(summary='Get or update your own profile')
    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """List all registered users. Admin only."""
    queryset           = User.objects.all().order_by('-date_joined')
    serializer_class   = UserSerializer
    permission_classes = [IsAdmin]

    @extend_schema(summary='List all users (admin only)')
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
