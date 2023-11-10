from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from api.app import create_app
from .config import STOCKFISH_PATH
from .socket import manager
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

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
    engine.configure({"Skill Level": 1})
    limit = chess.engine.Limit(time=0.3)
    board = chess.Board()
    try:
        while True:
            data = await websocket.receive_text()
            board.push(chess.Move.from_uci(data))
            result = engine.play(board, limit)
            board.push(result.move)
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
