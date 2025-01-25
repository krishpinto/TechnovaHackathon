# import os
# from typing import Annotated, List

# from typing_extensions import TypedDict
# from langgraph.graph import StateGraph, START, END
# from langgraph.graph.message import add_messages
# from langchain_google_genai import ChatGoogleGenerativeAI

# # Define the state type
# class State(TypedDict):
#     messages: Annotated[List[dict], add_messages]

# # Initialize the StateGraph with the State type
# graph_builder = StateGraph(State)

# def initialize_llm():
#     if "GENERATIVEAI_API_KEY" not in os.environ:
#         raise EnvironmentError("Please set the 'GENERATIVEAI_API_KEY' environment variable.")
    
#     return ChatGoogleGenerativeAI(
#         model="gemini-1.5-pro",
#         api_key=os.environ["GENERATIVEAI_API_KEY"],
#         temperature=0,
#         max_tokens=None,
#         timeout=None,
#         max_retries=2,
#     )

# llm = initialize_llm()

# # Simulated text database
# class TextDB:
#     def __init__(self):
#         self.data = {}

#     def get(self, key: str):
#         return self.data.get(key, "Data not found.")

#     def set(self, key: str, value: str):
#         self.data[key] = value

# # Initialize the text database
# text_db = TextDB()

# def chatbot(state: State):
#     try:
#         # Check for special commands to interact with the text database
#         user_message = state["messages"][-1]["content"]
#         if user_message.startswith("get "):
#             key = user_message[4:]
#             content = text_db.get(key)
#         elif user_message.startswith("set "):
#             key_value = user_message[4:].split(" ", 1)
#             if len(key_value) == 2:
#                 key, value = key_value
#                 text_db.set(key, value)
#                 content = f"Data set for key '{key}'."
#             else:
#                 content = "Invalid set command format. Use 'set <key> <value>'."
#         else:
#             response = llm.invoke(state["messages"])
#             content = response.content
        
#         return {"messages": state["messages"] + [{"role": "assistant", "content": content}]}
#     except Exception as e:
#         print(f"Error during LLM invocation: {e}")
#         return {"messages": state["messages"] + [{"role": "assistant", "content": "Sorry, something went wrong."}]}

# graph_builder.add_node("chatbot", chatbot)
# graph_builder.add_edge(START, "chatbot")
# graph_builder.add_edge("chatbot", END)
# graph = graph_builder.compile()

# def stream_graph_updates(user_input: str):
#     try:
#         for event in graph.stream({"messages": [{"role": "user", "content": user_input}]}):
#             for value in event.values():
#                 print("Assistant:", value["messages"][-1]["content"])
#     except Exception as e:
#         print("Error while processing the graph:", str(e))

# def main_loop():
#     print("Chatbot is running! Type 'quit', 'exit', or 'q' to stop.")
#     while True:
#         try:
#             user_input = input("User: ")
#             if user_input.lower() in ["quit", "exit"]:
#                 print("Goodbye!")
#                 break
#             stream_graph_updates(user_input)
#         except KeyboardInterrupt:
#             print("\nGoodbye!")
#             break
#         except Exception as e:
#             print("Error:", str(e))
#             break

# if __name__ == "__main__":
#     main_loop()
# import os
# import re
# from typing import Annotated, List
# from typing_extensions import TypedDict
# from langgraph.graph import StateGraph, START, END
# from langgraph.graph.message import add_messages
# from langchain_google_genai import ChatGoogleGenerativeAI

# # Define the state type
# class State(TypedDict):
#     messages: Annotated[List[dict], add_messages]

# # Initialize the StateGraph with the State type
# graph_builder = StateGraph(State)

# def initialize_llm():
#     if "GENERATIVEAI_API_KEY" not in os.environ:
#         raise EnvironmentError("Please set the 'GENERATIVEAI_API_KEY' environment variable.")
    
#     return ChatGoogleGenerativeAI(
#         model="gemini-1.5-pro",
#         api_key=os.environ["GENERATIVEAI_API_KEY"],
#         temperature=0,
#         max_tokens=None,
#         timeout=None,
#         max_retries=2,
#     )

# llm = initialize_llm()

# class RealTimeDBCache:
#     def __init__(self):
#         self.cache = {}
#         # Simulated real-time database (replace with actual DB connection)
#         self.real_time_db = {
#             "weather": "Sunny, 25°C",
#             "news": "Breaking news: AI achieves milestone!",
#             "stock_goog": "1500 USD",
#             "system_status": "All systems operational",
#             "user_count": "1423 active users"
#         }

#     def get(self, key: str):
#         # Check cache first
#         if key in self.cache:
#             return self.cache[key]
        
#         # Fetch from real-time database if not in cache
#         value = self.real_time_db.get(key)
#         if value is not None:
#             self.cache[key] = value  # Cache the fetched value
#             return value
#         return None

# # Initialize real-time database cache
# real_time_db_cache = RealTimeDBCache()

# class TextDB:
#     def __init__(self):
#         self.data = {}

#     def get(self, key: str):
#         return self.data.get(key, "Data not found.")

#     def set(self, key: str, value: str):
#         self.data[key] = value

# text_db = TextDB()

# def extract_context_keys(user_input: str):
#     # Simple pattern matching for context extraction
#     words = re.findall(r'\b\w+\b', user_input.lower())
#     return [word for word in words if word in real_time_db_cache.real_time_db]

# # Update the chatbot function as follows:
# def chatbot(state: State):
#     try:
#         # Get the last message properly
#         last_message = state["messages"][-1]
#         content = last_message.content if hasattr(last_message, 'content') else last_message["content"]
        
#         # Handle special TextDB commands
#         if content.startswith("get "):
#             key = content[4:]
#             response = text_db.get(key)
#             return {"messages": state["messages"] + [{"role": "assistant", "content": response}]}
        
#         if content.startswith("set "):
#             parts = content[4:].split(maxsplit=1)
#             if len(parts) == 2:
#                 key, value = parts
#                 text_db.set(key, value)
#                 response = f"Set '{key}' in TextDB"
#             else:
#                 response = "Invalid set command. Usage: set <key> <value>"
#             return {"messages": state["messages"] + [{"role": "assistant", "content": response}]}

#         # Normal query processing with real-time DB context
#         context_keys = extract_context_keys(content)
#         context = []
#         for key in context_keys:
#             value = real_time_db_cache.get(key)
#             if value:
#                 context.append(f"{key}: {value}")

#         # Prepare messages in proper format
#         messages = [msg.dict() if hasattr(msg, 'dict') else msg for msg in state["messages"]]
        
#         if context:
#             context_msg = "Current context:\n" + "\n".join(context)
#             messages.insert(-1, {"role": "system", "content": context_msg})

#         # Get LLM response with proper message handling
#         llm_response = llm.invoke(messages)
#         response_content = llm_response.content

#         return {"messages": state["messages"] + [{"role": "assistant", "content": response_content}]}

#     except Exception as e:
#         print(f"Detailed error: {str(e)}")
#         return {"messages": state["messages"] + [{"role": "assistant", "content": "Sorry, I encountered an error processing your request."}]}
        
        
# # Build the graph
# graph_builder.add_node("chatbot", chatbot)
# graph_builder.add_edge(START, "chatbot")
# graph_builder.add_edge("chatbot", END)
# graph = graph_builder.compile()

# def stream_graph_updates(user_input: str):
#     try:
#         for event in graph.stream({"messages": [{"role": "user", "content": user_input}]}):
#             for value in event.values():
#                 print("Assistant:", value["messages"][-1]["content"])
#     except Exception as e:
#         print("Error while processing the graph:", str(e))

# def main_loop():
#     print("Chatbot is running! Type 'quit', 'exit', or 'q' to stop.")
#     print("Available real-time data keys:", list(real_time_db_cache.real_time_db.keys()))
#     while True:
#         try:
#             user_input = input("User: ")
#             if user_input.lower() in ["quit", "exit", "q"]:
#                 print("Goodbye!")
#                 break
#             stream_graph_updates(user_input)
#         except KeyboardInterrupt:
#             print("\nGoodbye!")
#             break
#         except Exception as e:
#             print("Error:", str(e))
#             break

# if __name__ == "__main__":
#     main_loop()


import os
import numpy as np
from typing import Annotated, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from sentence_transformers import SentenceTransformer
from faiss import IndexFlatIP

# Define the state type
class State(TypedDict):
    messages: Annotated[List[dict], add_messages]

# Initialize the StateGraph with the State type
graph_builder = StateGraph(State)

# Initialize embedding model
EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')

class VectorDBCache:
    def __init__(self, real_time_data):
        self.data = real_time_data
        self.keys = list(real_time_data.keys())
        
        # Create FAISS index
        self.index = IndexFlatIP(EMBEDDING_MODEL.get_sentence_embedding_dimension())
        
        # Generate embeddings for all keys
        key_embeddings = EMBEDDING_MODEL.encode(self.keys, normalize_embeddings=True)
        self.index.add(np.array(key_embeddings))
    
    def semantic_search(self, query: str, threshold=0.3, top_k=2):
        # Encode query
        query_embedding = EMBEDDING_MODEL.encode(query, normalize_embeddings=True)
        
        # Search the index
        scores, indices = self.index.search(np.array([query_embedding]), top_k)
        
        # Return matches above threshold
        results = []
        for i, score in zip(indices[0], scores[0]):
            if score > threshold:
                results.append((self.keys[i], score))
        return results

class RealTimeDBCache:
    def __init__(self):
        self.cache = {}
        self.real_time_db = {
            "weather": "Sunny, 25°C",
            "news": "Breaking news: AI achieves milestone!",
            "stock_goog": "1500 USD",
            "system_status": "All systems operational",
            "user_count": "1423 active users"
        }
        self.vector_db = VectorDBCache(self.real_time_db)

    def get(self, key: str):
        # Check cache first
        if key in self.cache:
            return self.cache[key]
        
        # Fetch from real-time database if not in cache
        value = self.real_time_db.get(key)
        if value is not None:
            self.cache[key] = value  # Cache the fetched value
            return value
        return None

    def get_context(self, query: str):
        # Perform semantic search
        matches = self.vector_db.semantic_search(query)
        
        # Get values from cache/db
        context = []
        for key, score in matches:
            value = self.get(key)
            if value:
                context.append(f"{key}: {value} (confidence: {score:.2f})")
        return context

# Initialize real-time database cache
real_time_db_cache = RealTimeDBCache()

class TextDB:
    def __init__(self):
        self.data = {}

    def get(self, key: str):
        return self.data.get(key, "Data not found.")

    def set(self, key: str, value: str):
        self.data[key] = value

text_db = TextDB()

def initialize_llm():
    if "GENERATIVEAI_API_KEY" not in os.environ:
        raise EnvironmentError("Please set the 'GENERATIVEAI_API_KEY' environment variable.")
    
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        api_key=os.environ["GENERATIVEAI_API_KEY"],
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )

llm = initialize_llm()

def chatbot(state: State):
    try:
        # Get the last message properly
        last_message = state["messages"][-1]
        content = last_message.content if hasattr(last_message, 'content') else last_message["content"]

        # Handle TextDB commands
        if content.startswith("get "):
            key = content[4:]
            response = text_db.get(key)
            return {"messages": state["messages"] + [{"role": "assistant", "content": response}]}
        
        if content.startswith("set "):
            parts = content[4:].split(maxsplit=1)
            if len(parts) == 2:
                key, value = parts
                text_db.set(key, value)
                response = f"Set '{key}' in TextDB"
            else:
                response = "Invalid set command. Usage: set <key> <value>"
            return {"messages": state["messages"] + [{"role": "assistant", "content": response}]}

        # Get semantic context
        context = real_time_db_cache.get_context(content)
        
        # Prepare messages in proper format
        messages = [msg.dict() if hasattr(msg, 'dict') else msg for msg in state["messages"]]
        
        if context:
            context_msg = "Relevant Context:\n" + "\n".join(context)
            messages.insert(-1, {"role": "system", "content": context_msg})

        # Get LLM response
        llm_response = llm.invoke(messages)
        response_content = llm_response.content

        return {"messages": state["messages"] + [{"role": "assistant", "content": response_content}]}

    except Exception as e:
        print(f"Error: {str(e)}")
        return {"messages": state["messages"] + [{"role": "assistant", "content": "Sorry, I encountered an error processing your request."}]}

# Build the graph
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile()

def stream_graph_updates(user_input: str):
    try:
        for event in graph.stream({"messages": [{"role": "user", "content": user_input}]}):
            for value in event.values():
                print("Assistant:", value["messages"][-1]["content"])
    except Exception as e:
        print("Error while processing the graph:", str(e))

def main_loop():
    print("Chatbot is running! Type 'quit', 'exit', or 'q' to stop.")
    print("Available real-time data keys:", list(real_time_db_cache.real_time_db.keys()))
    while True:
        try:
            user_input = input("User: ")
            if user_input.lower() in ["quit", "exit", "q"]:
                print("Goodbye!")
                break
            stream_graph_updates(user_input)
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print("Error:", str(e))
            break

if __name__ == "__main__":
    main_loop()