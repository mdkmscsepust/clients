from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import ollama


app = FastAPI()
connected_clients = []
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
@app.get("/me")
async def root(content: str):
    response = ollama.chat(
    model='llama3',
    messages=[
        {'role': 'user', 'content': content}
    ]
    )
    return response['message']['content'].replace('\\','\n')

@app.websocket("/ws")
async def websocketendpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    while True:
        data = await websocket.receive_text()
        #await websocket.send_text(f"Message text was: {data}")
        for client in connected_clients:
            await client.send_text(data)
        if data == "exit":
            await websocket.close()
            break