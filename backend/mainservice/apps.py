from django.apps import AppConfig
from .views import logger

class MainserviceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mainservice'

    def ready(self):
        # Warm up cache on startup
        try:
            from .service import get_vector_store
            get_vector_store()  # Initialize cache
        except Exception as e:
            logger.error(f"Startup initialization error: {str(e)}")