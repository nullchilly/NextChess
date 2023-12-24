from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from api.app import create_app
from .config import STOCKFISH_PATH
from .socket import manager
from fastapi.staticfiles import StaticFiles
import json
import socketio
import chess.engine
from .chess_timer import ChessTimer

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

all_game_ids = set()
game_states = dict()

# Return each player time left
@app.get("/api/get-timer-info/{gameID}")
def get_timer_info(gameID: str):
    if (gameID in all_game_ids):
        w_time_left = game_states[gameID]['time']['wPlayer'].get_time_left()
        b_time_left = game_states[gameID]['time']['bPlayer'].get_time_left()
        return {
            "status": 200,
            "data": {
                "w": w_time_left,
                "b": b_time_left
            }
        }
    else:
        return {"status": 422, "error": "Game not exist"}

@sio.on("play-chess")
async def play_chess(sid, msg):
    data = json.loads(msg)
    gameID = data["id"]
    move = data["move"]
    if (gameID not in all_game_ids):
        message = {"ok": False, "error": "Can't find game ID"}
        await sio.emit("play-chess", json.dumps(message), room=sid)
        return

    if (game_states[gameID]['status'] is True):
        message = {"ok": False, "error": "Game ended"}
        await sio.emit("play-chess", json.dumps(message), room=sid)
        return

    # Switch timer
    game_states[gameID]['time']['wPlayer'].pause_time()
    game_states[gameID]['time']['bPlayer'].run_clock()

    # Insert user's move
    game_states[gameID]['board'].push(chess.Move.from_uci(move))

    # Winner check
    winner = 3 # Unknown
    reason = ""

    outcome = game_states[gameID]['board'].outcome()
    # Check if the last move makes user win
    if (outcome):
        reason = outcome.termination.name
        winner_color = outcome.winner
        winner = 0 if winner_color is None else 1 if winner_color is True else 2
        message = {
            "ok": True,
            "result": {
                "winner": winner,
                "reason": reason
            }
        }
        game_states[gameID]['status'] = True
        game_states[gameID]['result'] = winner
        # TODO: Insert moves into database
        await sio.emit("play-chess", json.dumps(message), room=sid)
        return

    result = game_states[gameID]['engine'].play(
        game_states[gameID]['board'], game_states[gameID]['limit'])
    # TODO: Check whether game state is over
    game_states[gameID]['board'].push(result.move)
    move = result.move

    # NOTE: When checkmated, there's no available move, hence no `from_square`, please hanlde it.
    from_square = chess.square_name(move.from_square)
    to_square = chess.square_name(move.to_square)
    outcome = game_states[gameID]['board'].outcome()
    if (outcome):
        reason = outcome.termination.name
        winner_color = outcome.winner
        winner = 0 if winner_color is None else 1 if winner_color is True else 2
        game_states[gameID]['status'] = True
        game_states[gameID]['result'] = winner
        # TODO: Insert moves into database

    message = {
        "ok": True,
        "move": {
            "from": from_square,
            "to": to_square,
            "promotion": "q"
        },
        "result": {
            "winner": winner,
            "reason": reason
        }
    }

    # Switch again
    game_states[gameID]['time']['wPlayer'].run_clock()
    game_states[gameID]['time']['bPlayer'].pause_time()
    await sio.emit("play-chess", json.dumps(message), room=sid)

# Clean up after game is ended, TODO: Check auth-user?
@sio.on("end-game")
async def end_game(sid, msg):
    data = json.loads(msg)
    gameID = data["id"]
    print("Inp end: ", gameID)
    all_game_ids.discard(gameID)  # safe removal
    if (gameID in game_states):
        game_states.pop(gameID)

    message = "Successfully cleaned up"
    await sio.emit("end-game", message, room=sid)

@sio.on("user-forfeit")
async def user_forfeit(sid, msg):
    data = json.loads(msg)
    gameID = data["id"]
    if (gameID in game_states):
        game_states[gameID]['status'] = True
        game_states[gameID]['result'] = 2 # Black win

    message = "White forfeited" # TODO: Return match info for modal rendering?
    await sio.emit("user-forfeit", message, room=sid)

@sio.on("start-game")
async def start_game(sid, msg):
    try:
        data = json.loads(msg)
        gameID = data["id"]
        all_game_ids.discard(gameID)  # safe removal
        all_game_ids.add(gameID)
        engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
        engine.configure({"Skill Level": 1})  # Parameterize this
        limit = chess.engine.Limit(time=1.2)
        board = chess.Board()

        wTimer = ChessTimer(time_left=120)  # 120s
        bTimer = ChessTimer(time_left=120)  # 120s

        current_state = dict()
        current_state['engine'] = engine
        current_state['board'] = board
        current_state['limit'] = limit
        current_state['status'] = False # Unfinished game
        current_state['result'] = 3 # Unknown result

        timer_dict = dict()
        timer_dict['wPlayer'] = wTimer
        timer_dict['bPlayer'] = bTimer

        current_state['time'] = timer_dict
        current_state['time']['wPlayer'].run_clock()

        game_states[gameID] = current_state

        successMessage = {"ok": True}
        await sio.emit("start-game", json.dumps(successMessage), room=sid)

    except Exception as e:
        failMessage = {"ok": False,
                       "error": "Error when initializing new game"}
        await sio.emit("start-game", json.dumps(failMessage), room=sid)


@sio.on("undo")
async def undo(sid, msg):
    data = json.loads(msg)
    gameID = data["id"]
    if (gameID in game_states):
        # Pop twice, engine move + user move, refine later!
        try:
            game_states[gameID]['board'].pop()
            game_states[gameID]['board'].pop()
        except IndexError:
            print("No move yet!")


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
