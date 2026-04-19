# Generative UI with CopilotKit

The code base is built on top of the below
- [CopilotKit Quickstart](https://docs.copilotkit.ai/langgraph/quickstart?agent=bring-your-own)
- [CopilotKit Tool Rendering](https://docs.copilotkit.ai/langgraph/generative-ui/tool-rendering)

## Prerequisites
Python is used for backend, and Node.js for frontend. Please install the dependencies by:

**Python**
```
cd backend

# Create and activate virtual environment
uv venv
source venv/Script/activate

# Install dependencies
uv run
```

**Node.js**
```
cd frontend
npm install
```

## How to use

Start the backend by the below, the LangGraph AGUI Agent will be reachable on http://localhost:8123
```
cd backend
python main.py
```

For testing, we can issue a `POST` request to the endpoint
```
{
    "threadId": "f3acbbc9-e897-47fb-a9d3-bde8d99a560c",
    "runId": "a90e7e01-0685-4de1-964d-0c9a268a428c",
    "tools": [],
    "context": [],
    "forwardedProps": {},
    "state": {},
    "messages": [
        {
            "id": "190645d3-0f62-4e43-9020-f1f4f41af212",
            "role": "user",
            "content":"How's the weather in Tokyo today?"
        }
    ]
}
```

Then, start the frontend by the below, the UI is served at http://localhost:3000/

```
cd frontend
npm run dev
```
