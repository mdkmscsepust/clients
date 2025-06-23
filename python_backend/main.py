from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import ollama
import asyncio
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/chat-stream")
async def chat_stream(prompt: str):
    async def event_generator():
        stream = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
        buffer = ""
        for chunk in stream:
            buffer += chunk["message"]["content"]
            while ' ' in buffer:
                word, buffer = buffer.split(' ', 1)
                yield f"data: {word} \n\n"
                await asyncio.sleep(0.05)
        if buffer:
            yield f"data: {buffer.strip()} \n\n"
        yield "data: [END]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
