import { useReducer, useState } from "react";
import React from "react";
import { Chess, Move, Square } from "chess.js";
import { io, Socket } from "socket.io-client";
import { CustomSquares, ShortMove } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { httpGetPlayerTimeLeft } from "@/modules/backend-client/httpGetPlayerTimeLeft";
import { WINNER } from "@/helpers/types";

export type ChessType = "random" | "computer" | "minimax";

type Props = {
  id: string;
  type: ChessType;
};

enum ConnectionStatus {
  Open = "open",
  Connecting = "connecting",
  Disconnected = "disconnected",
}

type EmitData = {
  move: string | ShortMove;
  id: string;
};

function squareReducer(squares: CustomSquares, action: Partial<CustomSquares>) {
  return { ...squares, ...action };
}

const useChessSocket = ({ type, id }: Props) => {
  // Start of socket
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionStatus>(ConnectionStatus.Disconnected);

  const [wPlayerTimeLeft, setWPlayerTimeLeft] = React.useState<number>(120000); // 120s
  const [isWPlayerActive, setWPlayerActive] = React.useState<boolean>(false);

  const [bPlayerTimeLeft, setBPlayerTimeLeft] = React.useState<number>(120000); // 120s
  const [isBPlayerActive, setBPlayerActive] = React.useState<boolean>(false);

  const [winner, setWinner] = React.useState<WINNER>("unknown");

  const disconnectSocket = React.useCallback(() => {
    socket?.close();
    setSocket(null);
    setConnectionStatus(ConnectionStatus.Disconnected);
  }, [socket, setConnectionStatus]);

  React.useEffect(() => {
    if (socket) {
      socket.connect();
      socket.on("connect", () => {
        console.log("Connected", socket.id);
      });

      socket.on("disconnect", () => {
        disconnectSocket();
      });

      socket.on("play-chess", async (msg) => {
        console.log("Response", msg);
        try {
          const message = JSON.parse(msg);
          if (message["ok"]) {
            if (message["move"]) {
              makeMove({
                from: message["move"]["from"],
                to: message["move"]["to"],
                promotion: "q",
              });
            }
            if (message["result"]["winner"] !== 3) {
              const winner_id = message["result"]["winner"];
              const reason = message["result"]["reason"];
              console.log("Reason: ", reason);
              await new Promise(r => setTimeout(r, 1200));
              setWinner(
                winner_id === 0 ? "draw" : winner_id === 1 ? "white" : "black"
              );
              setWPlayerActive(false);
              setBPlayerActive(false);
            }
          } else {
            console.error("[!!!] Play chess socket error: ", message["error"]);
          }
        } catch (error) {
          console.error("[!!!] Play chess socket error: ", error);
        }
      });

      socket.on("start-game", (msg) => {
        console.log("Start game info: ", msg);
        const message = JSON.parse(msg);
        console.log("Given mess: ", message, message["ok"]);
        if (message["ok"]) {
          // White time running
          setWPlayerActive(true);
          setBPlayerActive(false);
        }
      });

      socket.on("end-game", (msg) => {
        console.log("clean up state: ", msg);
      });

      socket.on("user-forfeit", (msg) => {
        console.log("user-forfeit socket message: ", msg);
      });
    }
  }, [disconnectSocket, setConnectionStatus, socket]);

  React.useEffect(() => {
    // Auto open socket connection on page load
    connectSocket();
    const savedMoves = localStorage.getItem(
      `@stockchess/useLocalStorage/${id}-moves`
    );
    if (savedMoves) {
      const parsedSavedMoves = JSON.parse(savedMoves) as Move[];
      const newGame = new Chess();
      try {
        parsedSavedMoves.forEach((move) => newGame.move(move));
      } catch (error) {
        console.log("[!!!] Error in initializing saved game: ", error);
      }
      setGame(newGame);
    }

    async function getTime() {
      const response = await httpGetPlayerTimeLeft({ gameID: id });
      if (response.ok && response.data) {
        setWPlayerTimeLeft(response.data.w * 1000);
        setBPlayerTimeLeft(response.data.b * 1000);
        if (game.turn() === "w") {
          setWPlayerActive(true);
          setBPlayerActive(false);
        } else {
          setWPlayerActive(false);
          setBPlayerActive(true);
        }
      }
    }
    getTime();
  }, []);

  // Send latest move over socket
  const sendMove = (move: string) => {
    console.log("MOVE: ", move);
    const emitData: EmitData = { move, id };
    socket?.emit("play-chess", JSON.stringify(emitData));
  };

  // Make sure new game id not appeared in BE
  const cleanOldGame = () => {
    const endGameData = { id: id };
    socket?.emit("end-game", JSON.stringify(endGameData));
  };

  const onInitGame = () => {
    console.log("Running init...");
    const initNewGame = { id: id }; // TODO: Add preferences (difficulty, timer, ...)
    socket?.emit("start-game", JSON.stringify(initNewGame));
  };

  const undoMoveSocket = () => {
    const undoMoveData = { id: id };
    socket?.emit("undo", JSON.stringify(undoMoveData));
  };

  const connectSocket = () => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      autoConnect: false,
      reconnection: true,
    });
    // onInitGame(socket);
    setSocket(socket);
  };

  // End of socket
  const [game, setGame] = useState(new Chess());
  const [playing, setPlaying] = useLocalStorage({
    name: `${id}-is-playing`,
    defaultValue: false,
  });
  const [moves, setMoves] = useLocalStorage<Move[]>({
    name: `${id}-moves`,
    defaultValue: [],
  });
  // const [moves, setMoves] = useState<Move[]>([]);
  // const [gameFen, setGameFen] = useState<string>("start");
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
  const [customSquares, updateCustomSquares] = useReducer(squareReducer, {
    check: {},
  });

  const makeMove = (move: string | ShortMove) => {
    console.log(move);
    const gameCopy = game;
    const result = gameCopy.move(move);

    if (result) {
      setMoves(gameCopy.history({ verbose: true }));
      setGame(gameCopy);

      let kingSquare = undefined;
      if (game.inCheck()) {
        const kingPos = game.board().reduce((acc, row, index) => {
          const squareIndex = row.findIndex(
            (square) =>
              square && square.type === "k" && square.color === game.turn()
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
      updateCustomSquares({
        check: kingSquare,
      });

      if (game.turn() === "b") {
        setBPlayerActive(true);
        setWPlayerActive(false);
      } else {
        setBPlayerActive(false);
        setWPlayerActive(true);
      }
    }

    return result;
  };

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (!playing) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;
    sendMove(move.from + move.to + (move.promotion ? move.promotion : ""));
    return true;
  };

  const resetGame = () => {
    const gameCopy = game;
    gameCopy.reset();
    setGame(gameCopy);
    cleanOldGame();
    setMoves([]);

    if (currentTimeout) clearTimeout(currentTimeout);
    setPlaying(false);

    setWPlayerTimeLeft(120000);
    setBPlayerTimeLeft(120000);
    setBPlayerActive(false);
    setWPlayerActive(false);

    updateCustomSquares({ check: undefined });
  };

  const startGame = () => {
    // NOTE: I think it's better to init socket on page load
    // connectSocket();
    resetGame();
    onInitGame();
    setPlaying(true);
  };

  // White (user, as default) forfeit => black win
  const forfeitGame = () => {
    const gameForfeited = { id: id };
    socket?.emit("user-forfeit", JSON.stringify(gameForfeited));
    setWinner("black");
    setWPlayerActive(false);
    setBPlayerActive(false);
  };

  const undoMove = () => {
    undoMoveSocket();

    const gameCopy = game;
    gameCopy.undo();
    gameCopy.undo();

    setGame(gameCopy);
    setMoves(gameCopy.history({ verbose: true }));
    updateCustomSquares({ check: undefined }); // Reset style
  };

  return {
    game,
    playing,
    moves,
    winner,

    customSquares,

    wPlayerTimeLeft,
    isWPlayerActive,

    bPlayerTimeLeft,
    isBPlayerActive,

    // NOTE: Since FEN can be easily extract from `games`, we dont have to maintain it
    // gameFen,
    // setGameFen,

    onPieceDrop,
    undoMove,

    startGame,
    resetGame,
    forfeitGame,

    socket,
  };
};

export default useChessSocket;
