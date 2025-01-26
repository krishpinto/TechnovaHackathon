from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from dotenv import load_dotenv
import os
import redis
import hashlib
from appwrite.client import Client
from appwrite.services.databases import Databases
import logging

logger = logging.getLogger(__name__)
__all__ = ['get_vector_store', 'get_llm', 'initialize_environment']

# Global cache with lazy initialization
_redis_client = None
_embeddings = None
_llm = None
_databases = None
def initialize_environment():
    """Initialize environment variables and connections once"""
    global _redis_client, _databases, _embeddings, _llm
    if all([_redis_client, _databases, _embeddings, _llm]):
        return  # Already initialized

    load_dotenv()
    
    # Initialize Redis
    _redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=int(os.getenv("REDIS_DB", 0)),
        decode_responses=False
    )
    
    # Initialize Appwrite
    client = Client()
    client.set_endpoint('https://cloud.appwrite.io/v1')
    client.set_project('679488e900145226ee46')
    client.set_key("standard_094edfce936fa13f633c6981834cc7402f978188e68fa7784af04f7471d5eedde098cec76df42b39ce643a570edabf1e6924e91b06bd278f050bcad62a48a21604737cf527ba3f494bb8cdcc2eb0c8beafec8c7be75153bfe2c5e6610c934e61343268d417ac626bee9ed90255ae18eda580bec0f134298b16bc0311913a2198")
    _databases = Databases(client)
    
    # Initialize Gemini components
    try:
        _embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=os.environ["GENERATIVEAI_API_KEY"],
        )
        _llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            api_key=os.environ["GENERATIVEAI_API_KEY"],
        )
        return _redis_client, _databases, _embeddings, _llm
    except KeyError as e:
        logger.error(f"Missing environment variable: {str(e)}")
        raise

def get_llm():
    """Get initialized LLM instance"""
    if not _llm:
        initialize_environment()
    return _llm

def get_vector_store():
    """Get cached vector store instance"""
    if not _embeddings:
        initialize_environment()
    return _cached_vector_store()

def get_redis_client():
    """Get initialized Redis client"""
    if not _redis_client:
        initialize_environment()
    return _redis_client

def _generate_data_hash(documents):
    """Generate MD5 hash of document data for change detection"""
    doc_strings = [f"{doc.get('$id')}{doc.get('_updatedAt')}" for doc in documents]
    return hashlib.md5("".join(doc_strings).encode()).hexdigest()

def _fetch_employee_documents():
    """Fetch employee documents with error handling"""
    try:
        user_details = _databases.list_documents(
            database_id='67948c8e001f38c2bb1b',
            collection_id='67948ce50021a1213c91'
        )
        projects_details = _databases.list_documents(
            database_id='67948c8e001f38c2bb1b',
            collection_id='679495110022ef6b7d1c',
        )

        return user_details['documents'],projects_details['documents']
    except Exception as e:
        logger.error(f"Appwrite error: {str(e)}")
        return None

def _create_vector_store(documents):
    for doc in documents:
        print(doc)
    """Create FAISS store from documents"""
    langchain_docs = [
        Document(
            page_content =doc.get("des_position",),
            metadata={
                "user-id": doc.get("$id", "Unknown"),
                "ph_no": doc.get("ph_no", "Unknown"),
                "email": doc.get("email", "Unknown"),
                "post": doc.get("post", "Unknown"),
                "department": doc.get("department", "Unknown"),
                "des_position": doc.get("des_position", "Unknown"),
                "username": doc.get("username", "Unknown"),
                "userId": doc.get("userId", "Unknown"),
                "github": doc.get("github", "Unknown"),
                "daily-schedule": doc.get("daily-schedule", "Unknown"),

            }
        ) for doc in documents
    ]
    
    return FAISS.from_documents(langchain_docs, _embeddings)

def _cache_vector_store(store, data_hash):
    """Serialize and cache vector store with hash"""
    try:
        # Serialize directly to bytes
        index_bytes = store.serialize_to_bytes()
        pkl_bytes = store.serialize_to_bytes()  # Adjust based on actual FAISS serialization
        
        # Use pipeline for atomic updates
        pipeline = _redis_client.pipeline()
        pipeline.set("employee_store_index", index_bytes)
        pipeline.set("employee_store_pkl", pkl_bytes)
        pipeline.set("employee_store_hash", data_hash)
        pipeline.execute()
    except Exception as e:
        logger.error(f"Redis caching error: {str(e)}")
PROJECT_HISTORY_KEY = "projects:history"
PROJECT_HASH_KEY = "project_store_hash"
PROJECT_INDEX_KEY = "project_store_index"
PROJECT_PKL_KEY = "project_store_pkl"

def _fetch_project_documents():
    """Fetch project documents with error handling"""
    try:
        return _databases.list_documents(
            database_id='67948c8e001f38c2bb1b',
            collection_id='679495110022ef6b7d1c',
        )['documents']
    except Exception as e:
        logger.error(f"Appwrite projects error: {str(e)}")
        return None

def _create_project_vector_store(documents):
    """Create FAISS store from project documents"""
    langchain_docs = [
        Document(
            page_content=doc.get("description", "") + " " + doc.get("tech_stack", ""),
            metadata={
                "project_id": doc.get("$id", "Unknown"),
                "name": doc.get("name", "Unknown"),
                "team": ", ".join(doc.get("team", [])),
                "deadline": doc.get("deadline", "Unknown"),
                "status": doc.get("status", "Unknown"),
                "dependencies": ", ".join(doc.get("dependencies", []))
            }
        ) for doc in documents
    ]
    return FAISS.from_documents(langchain_docs, _embeddings)

def _cache_project_store(store, data_hash):
    """Serialize and cache project vector store"""
    try:
        index_bytes = store.serialize_to_bytes()
        pkl_bytes = store.serialize_to_bytes()
        
        pipeline = _redis_client.pipeline()
        pipeline.set(PROJECT_INDEX_KEY, index_bytes)
        pipeline.set(PROJECT_PKL_KEY, pkl_bytes)
        pipeline.set(PROJECT_HASH_KEY, data_hash)
        pipeline.execute()
    except Exception as e:
        logger.error(f"Project cache error: {str(e)}")

def get_project_store():
    """Get cached project store or create new one"""
    redis = get_redis_client()
    project_docs = _fetch_project_documents()
    
    if not project_docs:
        logger.warning("No project documents found")
        return FAISS.from_texts([], _embeddings)
    
    current_hash = _generate_data_hash(project_docs)
    cached_hash = redis.get(PROJECT_HASH_KEY)
    
    if cached_hash and cached_hash.decode() == current_hash:
        try:
            return FAISS.deserialize_from_bytes(
                serialized=redis.get(PROJECT_INDEX_KEY),
                embeddings=_embeddings,
                allow_dangerous_deserialization=True
            )
        except Exception as e:
            logger.error(f"Project store load failed: {str(e)}")
    
    # Create and cache new project store
    logger.info("Building new project vector store")
    store = _create_project_vector_store(project_docs)
    _cache_project_store(store, current_hash)
    return store

# Update the existing _cached_vector_store function
def _cached_vector_store():
    """Get cached user store or create new one if outdated"""
    # Check cache existence
    cached_hash = _redis_client.get("employee_store_hash")
    user_documents,projects_details = _fetch_employee_documents()
    
    if not user_documents:
        logger.warning("No user_documents found, using empty store")
        return FAISS.from_texts([], _embeddings)
    
    current_hash = _generate_data_hash(user_documents)
    
    if cached_hash and cached_hash.decode() == current_hash:
        try:
            # Deserialize directly from bytes
            index_bytes = _redis_client.get("employee_store_index")
            pkl_bytes = _redis_client.get("employee_store_pkl")
            return FAISS.deserialize_from_bytes(
                serialized=index_bytes,
                embeddings=_embeddings,
                allow_dangerous_deserialization=True
            )
        except Exception as e:
            logger.error(f"Cache deserialization error: {str(e)}")
            # Fall through to rebuild
    
    # Create and cache new store
    logger.info("Building new vector store")
    store = _create_vector_store(user_documents)
    _cache_vector_store(store, current_hash)
    return store

database = _databases
# service.py
MEETING_HISTORY_KEY = "meetings:history"
MEETING_HASH_KEY = "meeting_store_hash"
MEETING_INDEX_KEY = "meeting_store_index"
MEETING_PKL_KEY = "meeting_store_pkl"

def _fetch_meeting_documents():
    """Fetch meeting documents from Appwrite"""
    try:
        return _databases.list_documents(
            database_id='67948c8e001f38c2bb1b',
            collection_id='67957e96002d76018877',  # Replace with actual ID
        )['documents']
    except Exception as e:
        logger.error(f"Appwrite meetings error: {str(e)}")
        return None

def _create_meeting_vector_store(documents):
    """Create FAISS store from meeting documents"""
    langchain_docs = [
        Document(
            page_content=doc.get("summary", "") + " " + doc.get("action_items", ""),
            metadata={
                "meeting_id": doc.get("$id", "Unknown"),
                "project_id": doc.get("project_id", "Unknown"),
                "participants": ", ".join(doc.get("user_ids", [])),
            }
        ) for doc in documents
    ]
    return FAISS.from_documents(langchain_docs, _embeddings)

def _cache_meeting_store(store, data_hash):
    """Serialize and cache meeting vector store"""
    try:
        index_bytes = store.serialize_to_bytes()
        pkl_bytes = store.serialize_to_bytes()
        
        pipeline = _redis_client.pipeline()
        pipeline.set(MEETING_INDEX_KEY, index_bytes)
        pipeline.set(MEETING_PKL_KEY, pkl_bytes)
        pipeline.set(MEETING_HASH_KEY, data_hash)
        pipeline.execute()
    except Exception as e:
        logger.error(f"Meeting cache error: {str(e)}")

def get_meeting_store():
    """Get cached meeting store or create new one"""
    redis = get_redis_client()
    meeting_docs = _fetch_meeting_documents()
    
    if not meeting_docs:
        logger.warning("No meeting documents found")
        return FAISS.from_texts([], _embeddings)
    
    current_hash = _generate_data_hash(meeting_docs)
    cached_hash = redis.get(MEETING_HASH_KEY)
    
    if cached_hash and cached_hash.decode() == current_hash:
        try:
            return FAISS.deserialize_from_bytes(
                serialized=redis.get(MEETING_INDEX_KEY),
                embeddings=_embeddings,
                allow_dangerous_deserialization=True
            )
        except Exception as e:
            logger.error(f"Meeting store load failed: {str(e)}")
    
    # Create and cache new meeting store
    logger.info("Building new meeting vector store")
    store = _create_meeting_vector_store(meeting_docs)
    _cache_meeting_store(store, current_hash)
    return store