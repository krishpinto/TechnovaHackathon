from typing import TypedDict, List, Annotated
import google.generativeai as genai
from langgraph.graph import StateGraph, END
import os

# Install required package if needed
# pip install google-generativeai

# Define the state structure
class AgentState(TypedDict):
    messages: Annotated[List[dict], "chat_history"]

# Initialize Gemini
genai.configure(api_key=os.environ["GENERATIVEAI_API_KEY"])
model = genai.GenerativeModel('gemini-pro')

# Define the agent node
def run_agent(state: AgentState):
    # Start chat with history
    chat = model.start_chat(history=state['messages'])
    
    # Get last user message
    user_message = [m for m in state['messages'] if m['role'] == 'user'][-1]
    
    # Send message and get response
    response = chat.send_message(user_message['parts'][0])
    
    # Return updated history
    return {"messages": chat.history}

# Set up the graph workflow
workflow = StateGraph(AgentState)

# Add nodes to the graph
workflow.add_node("assistant", run_agent)
workflow.set_entry_point("assistant")
workflow.add_edge("assistant", END)
app = workflow.compile()

# Example usage
if __name__ == "__main__":
    # Initialize state with empty chat history
    state = {"messages": []}
    
    while True:
        user_input = input("You: ")
        
        if user_input.lower() == 'exit':
            break
            
        # Add user message to state (Gemini-specific format)
        state['messages'].append({
            'role': 'user',
            'parts': [user_input]
        })
        
        # Execute the graph
        output = app.invoke(state)
        
        # Get the AI response
        ai_response = output['messages'][-1]['parts'][0]
        
        # Update state
        state = output
        
        print(f"Assistant: {ai_response}")