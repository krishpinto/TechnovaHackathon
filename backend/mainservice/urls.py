from django.urls import path
from .views import get_optimized_workflow, upload_video

urlpatterns = [
    path('optimized-workflow/', get_optimized_workflow, name='optimized_workflow'),
    path('upload', upload_video, name='upload_video'),
    # Add more URL patterns as needed
]

