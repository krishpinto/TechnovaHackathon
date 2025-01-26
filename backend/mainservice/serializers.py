# serializers.py
from rest_framework import serializers

class OptimizedWorkflowRequestSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=1000)  # Query to be passed from frontend
