import os
from typing import Annotated, List

from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_google_genai import ChatGoogleGenerativeAI

# Define the state type
class State(TypedDict):
    # Messages have the type "list". The `add_messages` function
    # in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[List[dict], add_messages]


# Initialize the StateGraph with the State type
graph_builder = StateGraph(State)

# Ensure the API key is set
if "GENERATIVEAI_API_KEY" not in os.environ:
    raise EnvironmentError("Please set the 'GENERATIVEAI_API_KEY' environment variable.")

# Initialize the LLM (ChatGemini)
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    api_key=os.environ["GENERATIVEAI_API_KEY"],
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# Define the chatbot function to process the state
def chatbot(state: State):
    try:
        # Call the LLM
        response = llm.invoke(state["messages"])
        
        # Extract content from AIMessage
        content = response.content
        
        # Append the response to the state's messages
        return {"messages": state["messages"] + [{"role": "assistant", "content": content}]}
    except Exception as e:
        print(f"Error during LLM invocation: {e}")
        # Handle errors gracefully by appending a fallback message
        return {"messages": state["messages"] + [{"role": "assistant", "content": "Sorry, something went wrong."}]}
# Add the chatbot node to the graph
graph_builder.add_node("chatbot", chatbot)

# Define the flow of the graph
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)

# Compile the graph
graph = graph_builder.compile()

# Function to stream graph updates
def stream_graph_updates(user_input: str):
    try:
        # Initialize the graph with user input as the first message
        for event in graph.stream({"messages": [{"role": "user", "content": user_input}]}):
            for value in event.values():
                # Print the assistant's response
                print("Assistant:", value["messages"][-1]["content"])
    except Exception as e:
        print("Error while processing the graph:", str(e))


# Main loop for user interaction
if __name__ == "__main__":
    print("Chatbot is running! Type 'quit', 'exit', or 'q' to stop.")
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
