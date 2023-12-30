from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from api.app import create_app
from .app.helper.db import db_session
from .app.service.puzzle import PuzzleService
from api.app.service.insert_moves import insert_game_move, get_game_id_from_slug
from api.app.helper.db import db_session
from sqlalchemy.orm import Session
from api.app.dto.core.insert_moves import InsertMoveRequest
from .config import STOCKFISH_PATH
from .socket import manager, WebSocketConnectionManager
from fastapi.staticfiles import StaticFiles
import json
import socketio
import chess.engine
from .chess_timer import ChessTimer

from typing import Annotated, List

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
        all_uci_moves = list(map(lambda move: move.uci(), game_states[gameID]['board'].move_stack))
        with next(db_session()) as db:
            game_id_num = await get_game_id_from_slug(db, slug=gameID)
            insert_move_request = InsertMoveRequest(
                game_id = game_id_num,
                user_id = game_states[gameID]['userID'], #FIXME, or not...
                move_details = all_uci_moves
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
        all_uci_moves = list(map(lambda move: move.uci(), game_states[gameID]['board'].move_stack))
        with next(db_session()) as db:
            game_id_num = await get_game_id_from_slug(db, slug=gameID)
            insert_move_request = InsertMoveRequest(
                game_id = game_id_num,
                user_id = game_states[gameID]['userID'], #FIXME, or not...
                move_details = all_uci_moves
            )
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
    if (gameID in game_states):
        game_states[gameID]['status'] = True
        game_states[gameID]['result'] = 2 # Black win
        all_uci_moves = list(map(lambda move: move.uci(), game_states[gameID]['board'].move_stack))
        with next(db_session()) as db:
            game_id_num = await get_game_id_from_slug(db, slug=gameID)
            insert_move_request = InsertMoveRequest(
                game_id = game_id_num,
                user_id = game_states[gameID]['userID'], #FIXME, or not...
                move_details = all_uci_moves
            )
            await insert_game_move(db, request=insert_move_request)

    message = "White forfeited" # TODO: Return match info for modal rendering?
    await sio.emit("user-forfeit", message, room=sid)

@sio.on("start-game")
async def start_game(sid, msg):
    try:
        data = json.loads(msg)
        gameID = data["id"]
        userID = data["userId"]
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
        current_state['userID'] = userID

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


@app.websocket("/puzzle/{gameID}/ws")
async def websocket_puzzle(*, websocket: WebSocket, gameID: str, db: Session = Depends(db_session)):
    await manager.connect(websocket)
    puzzle_list = PuzzleService().get_random_ten_puzzle(db)
    # set puzzle solved by user is map of user_id -> set of puzzle_id
    puzzle_solved_by_user = dict()
    list_player: List[str] = []
    def get_opponent(player: str) -> List[str]:
        if len(list_player) < 2:
            return []
        else:
            return [s for s in list_player if s != player]

    """
	two form of json data:
	//
	{
	    
	}
	// type 1 request
	{
	"status": "start",
	"message": {
		"user_id" : 1,
	}
	// type 1 response
	{
	    
		"status": "start",
		"message": {
			"user_id" : 1,
			"game_id" : 1,
			"opponent": []
			"puzzle": [{
				"id": 1,
				"fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
				"rating": 1000,
				"rating_deviation": 350,
				"popularity": 0,
				"nb_plays": 0,
				"themes": [],
				"game_url": "https://lichess.org/7hJ3U0YB",
				"puzzle_url": "https://lichess.org/training/7hJ3U0YB",
				"fen_url": "https://lichess.org/editor/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
			}]
		} // puzzle list
	}
    
    // noti message
    {
    "status": "noti",
    "message": {
        "content": "User 1 joined the game",
    }
    
	// type 2
	{
		"status": "submit",
		"message": {
			"user_id": 1,
			"submitPuzzleId": 18181,
		}
	}
    
	// response of type 2
	{
		"status": "success",
		"message": {
			"user_id": 1,
			"remaining_quiz": 9,
		}
	}
	
	// response of type 2 notify to other player
	{
	    "status": "message",
        "message": {
            "user_id": 1,
            "remaining_quiz": 9,
            "solved": 18181,
        }
    }
    
    // request of message to end game
    {
        "status": "end",
        "message": {
            
        }
    }
	
	// response of message to end game
	{
	    "status": "end",
	    "message": {
            "user_id": 1,
        }
	}
	
	"""
    try:
        while True:
            data = await websocket.receive_text()
            response = json.loads(data)
            if response["status"] == "start":
                user_id = response["message"]["user_id"]
                sent_response = {
                    "status": "start",
                    "message": {
                        "user_id": user_id,
                        "game_id": gameID,
                        "opponent": get_opponent(user_id),
                        "puzzle": puzzle_list.to_json()
                    }
                }
                await manager.send_personal_message(json.dumps(sent_response), websocket)
                sent_message = {
                    "status": "noti",
                    "message": {
                        "content": f"User {user_id} joined the game",
                    }
                }
                await manager.send_personal_message(json.dumps(sent_message), websocket)
            elif response["status"] == "submit":
                user_id = response["message"]["user_id"]
                puzzle_id = response["message"]["submitPuzzleId"]
                if user_id not in puzzle_solved_by_user:
                    puzzle_solved_by_user[user_id] = set()
                if puzzle_id in puzzle_solved_by_user[user_id]:
                    response = {
                        "status": "error",
                        "message": {
                            "user_id": user_id,
                            "error": "Puzzle already solved",
                        }
                    }
                    await manager.send_personal_message(json.dumps(response), websocket)
                else:
                    puzzle_solved_by_user[user_id].add(puzzle_id)
                    response = {
                        "status": "success",
                        "message": {
                            "user_id": user_id,
                            "remaining_quiz": len(puzzle_list.puzzles) - len(puzzle_solved_by_user[user_id]),
                        }
                    }
                    await manager.send_personal_message(json.dumps(response), websocket)
                    response = {
                        "status": "message",
                        "message": {
                            "user_id": user_id,
                            "remaining_quiz": len(puzzle_list.puzzles) - len(puzzle_solved_by_user[user_id]),
                            "solved": puzzle_id,
                        }
                    }
                    await manager.send_personal_message(json.dumps(response), websocket)
                    if len(puzzle_solved_by_user[user_id]) == len(puzzle_list.puzzles):
                        response = {
                            "status": "end",
                            "message": {
                                "user_id": user_id,
                            }
                        }
                        await manager.send_personal_message(json.dumps(response), websocket)
                        raise WebSocketDisconnect()
            elif response["status"] == "end":
                # find the win user
                user_id_win = ""
                max_solved = 0
                for user_id in puzzle_solved_by_user:
                    if len(puzzle_solved_by_user[user_id]) >= max_solved:
                        max_solved = len(puzzle_solved_by_user[user_id])
                        user_id_win = user_id
                response = {
                    "status": "end",
                    "message": {
                        "user_id": user_id_win,
                    }
                }
                await manager.send_personal_message(json.dumps(response), websocket)
                raise WebSocketDisconnect()

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        pass


app.mount("/", socketio.ASGIApp(sio))

# app.mount("/", StaticFiles(directory="out", html=True), name="static")
# if __name__ == '__main__':
#     uvicorn.run(combined_asgi_app, host='127.0.0.1', port=8000)
