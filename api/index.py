from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from api.app import create_app
from fastapi.staticfiles import StaticFiles
from .socket import manager
import json

app = create_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success", "message": "Integrate FastAPI Framework with Next.js"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = {"time": "current_time", "message": data}
            await manager.send_personal_message(json.dumps(message), websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        message = {"time": "current_time", "message": "Offline"}
        await manager.send_personal_message(json.dumps(message), websocket)

app.mount("/", StaticFiles(directory="out", html=True), name="static")
