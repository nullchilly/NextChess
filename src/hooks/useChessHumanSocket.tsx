import { CustomSquares, ShortMove } from "@/types";
import { Chess, Move, Square } from "chess.js";
import { useCallback, useEffect, useReducer, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GameConfig, WINNER } from "@/helpers/types";
import { useLocalStorage } from "./useLocalStorage";

type Props = {
  id: string;
  userId: number | undefined;
  name: string | undefined;
};

function squareReducer(squares: CustomSquares, action: Partial<CustomSquares>) {
  return { ...squares, ...action };
}

const useChessHumanSocket = ({ id, userId, name }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [_playersInLobby, setPlayersInLobby] = useState<number>(0); // May not using it anw
  const [pieceColor, setPieceColor] = useState<"w" | "b">("w");
  const [playable, setPlayable] = useState<boolean>(false); // True when there're 2 players in lobby
  const [game, setGame] = useState(new Chess());
  const [gameFen, setGameFen] = useState<string>("start");
  const [opponentName, setOpponentName] = useState<string>("");
  const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
    check: {},
  });
  const [winner, setWinner] = useState<WINNER>("unknown");
  // Handle prev-next move button in game review
  const [moveIndex, setMoveIndex] = useState(0);
  const [allGameStates, setAllGameStates] = useState<Chess[]>([]);

  function getChessPosisition() {
    return new Chess()
  }

  function handleGameEnd(winner: WINNER) {
    setWinner(winner);
    // Save all moves for review
    const allMoves = game.history({ verbose: true });
    console.log(allMoves)
    let allStates: Chess[] = [getChessPosisition()];
    console.log("handle state: ", allGameStates);

    for (let i = 0; i < allMoves.length; i++) {
      let tempState: Chess = getChessPosisition();
      // console.log(`tempState: ${i}`, tempState.fen());
      for (let j = 0; j <= i; j++) {
        try {
          tempState.move(allMoves[j]);
        } catch (error) {
          // console.log("[ERR]: ", i, j, allMoves[j], tempState.fen(), error);
          console.log("[ERR]: ", error);
        }
      }
      console.log("TEMPSTATE", tempState.fen())
      allStates.push(tempState);
    }
    setAllGameStates(allStates);
    setMoveIndex(allStates.length - 1);
    disconnectSocket();
  }

  const disconnectSocket = useCallback(() => {
    socket?.close();
    setSocket(null);
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.connect();
      socket.on("connect", () => {
        console.log("Connected", socket.id);
      });
      socket.on("human-user-forfeit", async (msg) => {
        console.log(msg)
        handleGameEnd("white")
      })

      socket.on("human-new-player-join", async (msg) => {
        console.log("JOINED:", msg);
        try {
          const response = JSON.parse(msg);
          if (response["ok"]) {
            const currentNumberPlayer = response["numberPlayer"];
            const color = response["config"]["color"];
            const opponentName = response["config"]["opponentName"];
            setPlayersInLobby(currentNumberPlayer);
            setPlayable(currentNumberPlayer === 2);
            if (color === "w" || color === "b") setPieceColor(color);
            if (typeof opponentName === "string") {
              setOpponentName(opponentName);
            }
          } else {
            if (typeof response["playable"] === "boolean") {
              setPlayable(response["playable"]);
            }
            if (response["color"] === "w" || response["color"] === "b") {
              setPieceColor(response["color"]);
            }
          }
        } catch (error) {
          console.error("[!!!] Error when new user join: ", error);
        }
      });

      socket.on("human-play-chess", async (msg) => {
        console.log("MOVE socket: ", msg);
        try {
          const response = JSON.parse(msg);
          if(response["ok"]) {
            if (response["result"]) {
              const winner_id = response["result"]["winner"];
              const reason = response["result"]["reason"];
              console.log("Reason: ", reason);
              await new Promise((r) => setTimeout(r, 1200));
              handleGameEnd(
                winner_id === 0 ? "draw" : winner_id === 1 ? "white" : "black"
              );
            }
            console.log("Opponent move: ", response["move"]);
            makeMove(response["move"]);
          } else {
            console.error("[!!!] response not ok: ", response["error"]);
          }

        } catch(error) {
          console.error("[!!!] Error when new user join: ", error);
        }
      })
    }
  }, [disconnectSocket, socket]);

  useEffect(() => {
    if (!socket && userId && !playable) connectSocket();
  }, [userId]);

  const connectSocket = () => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      autoConnect: false,
      reconnection: true,
    });
    if (!playable && userId) onNewPlayer(userId ?? 1, socket);
    setSocket(socket);
  };

  const onNewPlayer = (userId: number, socket: Socket) => {
    const newPlayerData = { id, userId, name };
    socket.emit("human-new-player-join", JSON.stringify(newPlayerData));
  };

  const [moves, setMoves] = useLocalStorage<Move[]>({
    name: `${id}-moves`,
    defaultValue: [],
  });

  const makeMove = (move: string | ShortMove) => {
    console.log(move);
    const gameCopy = game;
    const result = gameCopy.move(move);

    if (result) {
      // setMoves(gameCopy.history({ verbose: true }));
      setGameFen(gameCopy.fen());
      setGame(gameCopy);
      let kingSquare = undefined;
      console.log(game.inCheck())
      if (game.inCheck()) {
        const kingPos = game.board().reduce((acc, row, index) => {
          const squareIndex = row.findIndex(
            (square) => {
              if (square?.type == "k") {
                console.log(square)
              }
              return square && square.type === "k" && square.color === game.turn()
            }
          );
          return squareIndex >= 0
            ? `${String.fromCharCode(squareIndex + 97)}${8 - index}`
            : acc;
        }, "");
        kingSquare = {
          [kingPos]: {
            background:
              "radial-gradient(red, rgba(255,0,0,.8), transparent 70%)",
            borderRadius: "50%",
          },
        };
      }
      console.log(kingSquare)
      updateCustomSquares({
        check: kingSquare,
      });

    }
    return result;
  };

  const sendMove = (move: string) => {
    console.log("MOVE: ", move);
    const emitData = { move, id, turn: pieceColor };
    socket?.emit("human-play-chess", JSON.stringify(emitData));
  };

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (!playable) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;
    sendMove(move.from + move.to + (move.promotion ? move.promotion : ""));
    return true;
  };

  const forfeitGame = () => {
    const gameForfeited = { id: id, winner: opponentName };
    socket?.emit("human-user-forfeit", JSON.stringify(gameForfeited));
    handleGameEnd("black");
  };

  const prevMove = () => {
    const newMoveIndex = Math.max(moveIndex - 1, 0);
    const currentGame = allGameStates[newMoveIndex];
    setGameFen(currentGame.fen())
    console.log("ALL: ", moveIndex, allGameStates);
    setMoveIndex(newMoveIndex);
    setGame(currentGame);
    let kingSquare = undefined;
    if (currentGame.inCheck()) {
      const kingPos = currentGame.board().reduce((acc, row, index) => {
        const squareIndex = row.findIndex(
          (square) =>
            square && square.type === "k" && square.color === currentGame.turn()
        );
        return squareIndex >= 0
          ? `${String.fromCharCode(squareIndex + 97)}${8 - index}`
          : acc;
      }, "");
      kingSquare = {
        [kingPos]: {
          background:
            "radial-gradient(red, rgba(255,0,0,.8), transparent 70%)",
          borderRadius: "50%",
        },
      };
    }
    updateCustomSquares({ check: kingSquare }); // Reset style
  };

  const nextMove = () => {
    const newMoveIndex = Math.min(moveIndex + 1, allGameStates.length - 1);
    const currentGame = allGameStates[newMoveIndex];
    setGameFen(currentGame.fen())
    setMoveIndex(newMoveIndex);
    setGame(currentGame);
    let kingSquare = undefined;
    if (currentGame.inCheck()) {
      const kingPos = currentGame.board().reduce((acc, row, index) => {
        const squareIndex = row.findIndex(
          (square) =>
            square && square.type === "k" && square.color === currentGame.turn()
        );
        return squareIndex >= 0
          ? `${String.fromCharCode(squareIndex + 97)}${8 - index}`
          : acc;
      }, "");
      kingSquare = {
        [kingPos]: {
          background:
            "radial-gradient(red, rgba(255,0,0,.8), transparent 70%)",
          borderRadius: "50%",
        },
      };
    }
    updateCustomSquares({ check: kingSquare }); // Reset style
  };

  return {
    socket,
    winner,
    forfeitGame,
    customSquares,
    playable,
    pieceColor,
    onPieceDrop,
    game,
    gameFen,
    setGameFen,
    opponentName,
    prevMove,
    nextMove,
  };
};

export default useChessHumanSocket;
