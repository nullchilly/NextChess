from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from api.app import create_app
from .config import STOCKFISH_PATH
from .socket import manager
from fastapi.staticfiles import StaticFiles
import json
import socketio
import uvicorn
import chess.engine

from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

app = create_app()
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode='asgi')
combined_asgi_app = socketio.ASGIApp(sio, app)

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

            message = {"time": "current_time", "message": {
                "from": from_square, "to": to_square, "promotion": "q"}}
            await manager.send_personal_message(json.dumps(message), websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        pass

all_games_sid = set()
game_states = dict()

# TODO: Clean up old game state?
@sio.on("play-chess")
async def play_chess(sid, msg):
    if (sid not in all_games_sid):
        all_games_sid.add(sid);
        engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
        engine.configure({"Skill Level": 1})
        limit = chess.engine.Limit(time=0.3)
        board = chess.Board()

        current_state = dict()
        current_state['engine'] = engine
        current_state['board'] = board
        current_state['limit'] = limit

        game_states[sid] = current_state

    game_states[sid]['board'].push(chess.Move.from_uci(msg))
    result = game_states[sid]['engine'].play(
        game_states[sid]['board'], game_states[sid]['limit'])
    game_states[sid]['board'].push(result.move)
    move = result.move
    from_square = chess.square_name(move.from_square)
    to_square = chess.square_name(move.to_square)
    message = {"time": "current_time", "message": {
        "from": from_square, "to": to_square, "promotion": "q"}}

    await sio.emit("play-chess", json.dumps(message), room=sid)


@sio.on("connect")
async def connect(sid, env):
    print("Fucking connected")


@sio.on("direct")
async def direct(sid, msg):
    print(f"direct {msg}")
    # we can send message to specific sid
    await sio.emit("response", msg, room=sid)


@sio.on("broadcast")
async def broadcast(sid, msg):
    print(f"broadcast {msg}")
    await sio.emit("event_name", msg)  # or send to everyone


@sio.on("disconnect")
async def disconnect(sid):
    print("on disconnect")

app.mount("/", socketio.ASGIApp(sio))

# app.mount("/", StaticFiles(directory="out", html=True), name="static")
# if __name__ == '__main__':
#     uvicorn.run(combined_asgi_app, host='127.0.0.1', port=8000)
