from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from api.app import create_app
from fastapi.staticfiles import StaticFiles
import json
import chess.engine

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


class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = WebSocketConnectionManager();

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    engine = chess.engine.SimpleEngine.popen_uci("/home/nullchilly/code/git/stockfish/stockfish-ubuntu-x86-64")
    limit = chess.engine.Limit(time=0.01)
    board = chess.Board()
    try:
        while True:
            data = await websocket.receive_text()
            # print(data)
            print(data)
            board.push(chess.Move.from_uci(data))
            print(board)
            result = engine.play(board, limit)
            board.push(result.move)
            print(board)
            move = result.move
            from_square = chess.square_name(move.from_square)
            to_square = chess.square_name(move.to_square)

            message = {"time": "current_time", "message": {"from": from_square, "to": to_square, "promotion": "q"}}
            await manager.send_personal_message(json.dumps(message), websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        message = {"time": "current_time", "message": "Offline"}
        await manager.send_personal_message(json.dumps(message), websocket)

app.mount("/", StaticFiles(directory="out", html=True), name="static")
