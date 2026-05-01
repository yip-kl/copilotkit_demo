from dotenv import load_dotenv
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from copilotkit import LangGraphAGUIAgent
from fastapi import FastAPI, Request
import logging
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langchain.agents import create_agent
import uvicorn
from langchain_openrouter import ChatOpenRouter
import time

# Define OPENROUTER_API_BASE and OPENROUTER_API_KEY in your .env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@tool
def get_weather(location: str):
    """
    Get the weather for a given location.
    """
    # Wait for 3 seconds for demonstration purposes
    time.sleep(3)
    return {
        "temperature": 20,
        "conditions": "sunny",
        "humidity": 50,
        "wind_speed": 10,
        "feelsLike": 25,
    }

@tool
def get_flight(flight_number: str):
    """
    Get flight information.
    """
    time.sleep(3)
    return {
        "flightNumber": "OS 87",
        "date": "2026-04-15",
        "origin": "Vienna",
        "destination": "New York",
        "departureTime": "2026-04-15T10:15:00Z",
        "flight_status": "On Time",
        "arrivalTime": "2026-04-15T14:30:00Z",
    }

graph = create_agent(
    model=ChatOpenRouter(model="google/gemma-4-31b-it"),
    tools=[get_weather, get_flight],
    system_prompt="""
    You are a helpful trip planner, when user asks if a trip is a good idea,
    you check the weather and flight information for the trip and give a recommendation.
    Assume the user is from Vienna and he plans to take the fight OS 87
    """,
    checkpointer=MemorySaver(),
)

app = FastAPI()

add_langgraph_fastapi_endpoint(
  app=app,
  agent=LangGraphAGUIAgent(
    name="sample_agent",
    description="An example agent to use as a starting point for your own agent.",
    graph=graph,
  ),
  path="/",
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    
    logger.info("Request body: %s", await request.body())
    response = await call_next(request)    
    return response

def main():
  """Run the uvicorn server."""
  uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8123,
    reload=True,
  )

if __name__ == "__main__":
  main()