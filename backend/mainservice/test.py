from .service import initialize_environment, initialize_gemini_components, save_faiss_to_redis, load_faiss_from_redis
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

# Initialize environment and Gemini components
redis_client, databases = initialize_environment()
llm, embeddings = initialize_gemini_components()

# Define database and collection IDs
DATABASE_ID = '6794bb42002580a97f67'  # Replace with your database ID
COLLECTION_ID = '6794da710037caa79f81'  # Replace with your collection ID

def fetch_employee_documents(databases):
    """Fetch employee documents from Appwrite."""
    try:
        response = databases.list_documents(
            database_id=DATABASE_ID,
            collection_id=COLLECTION_ID,
        )
        return response['documents']
    except Exception as e:
        print(f"Error fetching employee documents: {str(e)}")
        return None

def create_employee_vector_store(redis_client, databases, embeddings):
    """Create or update the vector store for employee data."""
    employee_docs = fetch_employee_documents(databases)
    
    if not employee_docs:
        print("No employee documents found.")
        return None
    
    # Convert to Langchain documents
    langchain_docs = [
        Document(
            page_content=doc.get("role", ""),
            metadata={
                "name": doc.get("name", "Unknown"),
                "email": doc.get("email", ""),
                "company": doc.get("company", ""),
                "github": doc.get("github", ""),
                "current_project": doc.get("current-project", []),
                "daily_schedule": doc.get("daily-schedule", []),
                "document_id": doc.get("$id", "")
            }
        ) for doc in employee_docs
    ]
    
    # Create new vector store
    vector_store = FAISS.from_documents(langchain_docs, embeddings)
    
    # Update cache
    save_faiss_to_redis(vector_store, "employee_store", redis_client)
    return vector_store

def main():
    vector_store = create_employee_vector_store(redis_client, databases, embeddings)
    
    if not vector_store:
        print("Failed to create vector store for employee data.")
        return
    
    # Example query for optimized workflow suggestions
    query = "Suggest optimized workflow for the given employee "
    results = vector_store.similarity_search(query, k=2)
    
    print("\nTop suggestions for optimized workflow:")
    for doc in results:
        print(f"- {doc.page_content}")
        print(f"  Name: {doc.metadata['name']}")
        print(f"  Email: {doc.metadata['email']}")
        print(f"  Company: {doc.metadata['company']}")
        print(f"  Current Projects: {doc.metadata['current_project']}")
        print(f"  Daily Schedule: {doc.metadata['daily_schedule']}\n")
    
    # LLM integration example
    response = llm.invoke(f"Based on the following employee data: {[doc.page_content for doc in results]}, suggest an optimized workflow for a web developer at Blingo.")
    print("\nGemini response:")
    print(response.content)

if __name__ == "__main__":
    main()
