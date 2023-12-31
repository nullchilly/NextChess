from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from socketio import AsyncServer
from sqlalchemy.orm import Session

from api.app import create_app
from .app.helper.db import db_session
from .app.model import Game
from .app.model.game_user import GameUser
from .app.service.puzzle import PuzzleService
from api.app.service.insert_moves import insert_game_move, get_game_id_from_slug
from api.app.service.insert_game_user import insert_game_user
from api.app.helper.db import db_session
from sqlalchemy.orm import Session
from api.app.dto.core.insert_game_user import InsertGameUserRequest
from api.app.dto.core.insert_moves import InsertMoveRequest
from .config import STOCKFISH_PATH
from .socket import manager, WebSocketConnectionManager
from fastapi.staticfiles import StaticFiles
import json
import socketio
import chess.engine
from .chess_timer import ChessTimer

from typing import Annotated, Dict, List, Set

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
    winner = 3  # Unknown
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
        all_uci_moves = list(
            map(lambda move: move.uci(), game_states[gameID]['board'].move_stack))
        if (game_states[gameID]['userID'] > 0):
            with next(db_session()) as db:
                game_id_num = await get_game_id_from_slug(db, slug=gameID)
                insert_move_request = InsertMoveRequest(
                    game_id=game_id_num,
                    user_id=game_states[gameID]['userID'],  # FIXME, or not...
                    move_details=all_uci_moves
                )
                insert_game_user_request = InsertGameUserRequest(
                    game_id=game_id_num,
                    user_id=game_states[gameID]['userID'],  # FIXME, or not...
                    win=winner,
                    rating_change=0,  # Bot-game doesn't affect rating
                )
                await insert_game_move(db, request=insert_move_request)

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
        all_uci_moves = list(
            map(lambda move: move.uci(), game_states[gameID]['board'].move_stack))
        if (game_states[gameID]['userID'] > 0):
            with next(db_session()) as db:
                game_id_num = await get_game_id_from_slug(db, slug=gameID)
                insert_move_request = InsertMoveRequest(
                    game_id=game_id_num,
                    user_id=game_states[gameID]['userID'],  # FIXME, or not...
                    move_details=all_uci_moves
                )
                insert_game_user_request = InsertGameUserRequest(
                    game_id=game_id_num,
                    user_id=game_states[gameID]['userID'],  # FIXME, or not...
                    win=winner,
                    rating_change=0,  # Bot-game doesn't affect rating
                )

                await insert_game_user(db, request=insert_game_user_request)
                await insert_game_move(db, request=insert_move_request)

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
    if (gameID in game_states and not game_states[gameID]['status']):
        game_states[gameID]['status'] = True
        game_states[gameID]['result'] = 2  # Black win
        all_uci_moves = list(
            map(lambda move: move.uci(), game_states[gameID]['board'].move_stack))
        if (game_states[gameID]['userID'] > 0):
            with next(db_session()) as db:
                game_id_num = await get_game_id_from_slug(db, slug=gameID)
                insert_move_request = InsertMoveRequest(
                    game_id=game_id_num,
                    user_id=game_states[gameID]['userID'],  # FIXME, or not...
                    move_details=all_uci_moves
                )
                insert_game_user_request = InsertGameUserRequest(
                    game_id=game_id_num,
                    user_id=game_states[gameID]['userID'],  # FIXME, or not...
                    win=2,
                    rating_change=0,  # Bot-game doesn't affect rating
                )

                await insert_game_user(db, request=insert_game_user_request)
                await insert_game_move(db, request=insert_move_request)

    message = "White forfeited"  # TODO: Return match info for modal rendering?
    await sio.emit("user-forfeit", message, room=sid)


@sio.on("start-game")
async def start_game(sid, msg):
    try:
        data = json.loads(msg)
        gameID = data["id"]
        userID = data["userId"]
        config = data["config"]
        strength = config["strength"]
        variant = config["variant"]
        gameTime = config["timeMode"] * 60

        all_game_ids.discard(gameID)  # safe removal
        all_game_ids.add(gameID)
        engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
        engine.configure({"Skill Level": 1})  # Parameterize this
        limit = chess.engine.Limit(time=1.2)
        board = chess.Board()

        if (variant == 2):
            # Hardcode Chess960 starting FEN
            board.set_fen(
                "bnnqrkrb/pppppppp/8/8/8/8/PPPPPPPP/BNNQRKRB w KQkq - 0 1")

        wTimer = ChessTimer(time_left=gameTime)
        bTimer = ChessTimer(time_left=gameTime)

        current_state = dict()
        current_state['engine'] = engine
        current_state['board'] = board
        current_state['limit'] = limit
        current_state['status'] = False  # Unfinished game
        current_state['result'] = 3  # Unknown result
        current_state['userID'] = userID

        timer_dict = dict()
        timer_dict['wPlayer'] = wTimer
        timer_dict['bPlayer'] = bTimer

        current_state['time'] = timer_dict
        if (gameTime > 0):
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


@sio.on("fetch-saved-game")
async def fetch_saved_game(sid, msg):
    try:
        data = json.loads(msg)
        gameID = data["id"]
        if (gameID in game_states):
            response = {"ok": True, "winner": game_states[gameID]["result"]}
            await sio.emit("fetch-saved-game", json.dumps(response), room=sid)
            return
        else:
            response = {"ok": False, "error": "Game not exist"}
            await sio.emit("fetch-saved-game", json.dumps(response), room=sid)
            return
    except Exception as e:
        failMessage = {"ok": False,
                       "error": "Error when fetching saved data"}
        await sio.emit("fetch-saved-game", json.dumps(failMessage), room=sid)

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


puzzle_list_per_game_id = dict()
participant: Dict[int, Set[int]] = dict()
puzzle_solved_by_user: Dict[int, Dict[int, Set[int]]] = dict()


@sio.on("puzzle-duel")
async def puzzle_duel(sid, msg):
    print('connect', sid)
    data = msg
    if msg["status"] == "start":
        game_id = data["message"]["gameId"]
        if puzzle_list_per_game_id.get(game_id) is None:
            with next(db_session()) as db:
                puzzle_list = PuzzleService.get_random_ten_puzzle(db)
                puzzle_list_per_game_id[game_id] = puzzle_list
            participant[game_id] = set()
            puzzle_solved_by_user[game_id] = dict()
        puzzle_list = puzzle_list_per_game_id[game_id]
        user_id = msg["message"]["userId"]
        with next(db_session()) as db:
            # update number player of game gameId in db
            game = db.query(Game).filter(Game.id == game_id).first()
            game.number_player += 1
            # add new game_user to game_user table
            game_user = GameUser(
                user_id=user_id,
                game_id=game_id,
                win=0,
                rating_change=0
            )
            db.add(game_user)
            db.commit()

        response = {
            "status": "ready",
            "message": {
                "puzzle": puzzle_list.to_json(),
                "user_id": user_id,
                "game_id": game_id
            }
        }
        participant[game_id].add(user_id)
        puzzle_solved_by_user[game_id][user_id] = set()
        await sio.emit("puzzle-duel", json.dumps(response))
        response = {
            "status": "join_noti",
            "message": {
                "content": f"User {user_id} joined game {game_id}",
                "game_id": game_id,
                "user_id": user_id
            }
        }
        await sio.emit("puzzle-duel", json.dumps(response))
    elif msg["status"] == "submit":
        user_id = msg["message"]["userId"]
        game_id = msg["message"]["gameId"]
        puzzle_id = msg["message"]["puzzleId"]
        solved = msg["message"]["solved"]
        if not solved:
            response = {
                "status": "submit_noti",
                "message": {
                    "content": f"User {user_id} failed puzzle {puzzle_id}",
                    "game_id": game_id,
                    "user_id": user_id,
                    "solved": solved
                }
            }
            await sio.emit("puzzle-duel", json.dumps(response))
            return
        if user_id not in participant[game_id]:
            response = {
                "status": "error",
                "message": {
                    "content": f"User {user_id} not in game"
                }
            }
            await sio.emit("puzzle-duel", json.dumps(response))
            return
        if puzzle_id not in puzzle_list_per_game_id[game_id].puzzles:
            response = {
                "status": "error",
                "message": {
                    "content": f"Puzzle {puzzle_id} not in game"
                }
            }
            await sio.emit("puzzle-duel", json.dumps(response))
            return
        puzzle_solved_by_user[game_id][user_id].add(puzzle_id)
        total_remaining_puzzle = (len(puzzle_list_per_game_id[game_id].puzzles)
                                  - len(puzzle_solved_by_user[game_id][user_id]))
        remaining_puzzle = [puzzle for puzzle in puzzle_list_per_game_id[game_id].puzzles
                            if puzzle.id not in puzzle_solved_by_user[game_id][user_id]]
        response = {
            "status": "solved",
            "message": {
                "num_remaining": total_remaining_puzzle,
                "remaining_puzzle": [puzzle.to_json() for puzzle in remaining_puzzle],
                "user_id": user_id,
                "game_id": game_id
            }
        }
        await sio.emit("puzzle-duel", json.dumps(response))
        response = {
            "status": "submit_noti",
            "message": {
                "content": f"User {user_id} solved puzzle {puzzle_id}",
                "game_id": game_id,
                "user_id": user_id,
                "solved": solved
            }
        }
        await sio.emit("puzzle-duel", json.dumps(response))
        if total_remaining_puzzle == 0:
            response = {
                "status": "end",
                "message": {
                    "gameId": game_id,
                    "userId": user_id,
                    "content": f"User {user_id} won"
                }
            }
            with next(db_session()) as db:
                game_user = db.query(GameUser).filter(GameUser.user_id == user_id,
                                                      GameUser.game_id == game_id).first()
                game_user.win = 1
                db.commit()
            await sio.emit("puzzle-duel", json.dumps(response))
            return
    elif msg["status"] == "end_game":
        user_id_win = ""
        game_id = msg["message"]["gameId"]
        max_puzzle_solved = 0
        for user_id in participant[game_id]:
            if len(puzzle_solved_by_user[game_id][user_id]) >= max_puzzle_solved:
                user_id_win = user_id
                max_puzzle_solved = len(
                    puzzle_solved_by_user[game_id][user_id])
        response = {
            "status": "end",
            "message": {
                "gameId": game_id,
                "userId": user_id_win,
                "content": f"User {user_id_win} won"
            }
        }
        with next(db_session()) as db:
            game_user = db.query(GameUser).filter(GameUser.user_id == user_id_win,
                                                  GameUser.game_id == game_id).first()
            game_user.win = 1
            db.commit()
        await sio.emit("puzzle-duel", json.dumps(response))
        return

app.mount("/", socketio.ASGIApp(sio))

# app.mount("/", StaticFiles(directory="out", html=True), name="static")
# if __name__ == '__main__':
#     uvicorn.run(combined_asgi_app, host='127.0.0.1', port=8000)
