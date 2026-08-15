from rest_framework import serializers
from .models import Media

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'title', 'type', 'status', 'rating', 'owner', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']

    def validate_title(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def validate(self, data):
        # Retrieve fields for validation, considering updates where fields might be omitted
        status = data.get('status')
        rating = data.get('rating')

        # For partial updates (PATCH), retrieve current values from self.instance
        if self.instance:
            if status is None:
                status = self.instance.status
            if rating is None and 'rating' not in data:
                rating = self.instance.rating

        # Validate rating range if it is set
        if rating is not None:
            if rating < 1 or rating > 5:
                raise serializers.ValidationError({"rating": "Rating must be between 1 and 5."})
            
            # If status is Unwatched, item cannot have a rating
            if status == 'Unwatched':
                raise serializers.ValidationError({"rating": "Unwatched items cannot have a rating."})

        return data
