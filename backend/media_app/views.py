from rest_framework import viewsets, permissions
from .models import Media
from .serializers import MediaSerializer

class MediaViewSet(viewsets.ModelViewSet):
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Explicitly scope queryset to only the authenticated user's records
        return Media.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Save the media item, setting the owner from the request context
        serializer.save(owner=self.request.user)
