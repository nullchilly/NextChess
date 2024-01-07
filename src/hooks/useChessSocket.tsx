import { useReducer, useState } from "react";
import React from "react";
import { Chess, Move, Square } from "chess.js";
import { io, Socket } from "socket.io-client";
import { CustomSquares, ShortMove } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { httpGetPlayerTimeLeft } from "@/modules/backend-client/httpGetPlayerTimeLeft";
import { GameConfig, WINNER } from "@/helpers/types";

export type ChessType = "random" | "computer" | "minimax";

type Props = {
  id: string;
  type: ChessType;
  userId?: number;
  gameConfig?: GameConfig;
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

function getChessPosisition(variant?: number) {
  return variant === 1 || !variant
    ? new Chess()
    : new Chess("bnnqrkrb/pppppppp/8/8/8/8/PPPPPPPP/BNNQRKRB w KQkq - 0 1");
}

const useChessSocket = ({ type, id, userId, gameConfig }: Props) => {
  // Start of socket
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionStatus>(ConnectionStatus.Disconnected);

  const [wPlayerTimeLeft, setWPlayerTimeLeft] = React.useState<number>(
    (gameConfig?.timeMode ?? 0) * 60000
  );
  const [isWPlayerActive, setWPlayerActive] = React.useState<boolean>(false);

  const [bPlayerTimeLeft, setBPlayerTimeLeft] = React.useState<number>(
    (gameConfig?.timeMode ?? 0) * 60000
  );
  const [isBPlayerActive, setBPlayerActive] = React.useState<boolean>(false);

  const [winner, setWinner] = React.useState<WINNER>("unknown");

  // Handle prev-next move button in game review
  const [moveIndex, setMoveIndex] = React.useState(0);
  const [allGameStates, setAllGameStates] = React.useState<Chess[]>([]);

  const disconnectSocket = React.useCallback(() => {
    socket?.close();
    setSocket(null);
    setConnectionStatus(ConnectionStatus.Disconnected);
  }, [socket, setConnectionStatus]);

  function handleGameEnd(winner: WINNER) {
    setWinner(winner);

    // Stop clock
    setWPlayerActive(false);
    setBPlayerActive(false);

    // Save all moves for review
    const allMoves = game.history({ verbose: true });
    let allStates: Chess[] = [getChessPosisition(gameConfig?.variant)];
    console.log("handle state: ", allGameStates);

    for (let i = 0; i < allMoves.length; i++) {
      let tempState: Chess = getChessPosisition(gameConfig?.variant);
      console.log(`tempState: ${i}`, tempState.fen());
      for (let j = 0; j <= i; j++) {
        try {
          tempState.move(allMoves[j]);
        } catch (error) {
          // console.log("[ERR]: ", i, j, allMoves[j], tempState.fen(), error);
          console.log("[ERR]: ", error);
        }
      }
      allStates.push(tempState);
    }
    setAllGameStates(allStates);
    setMoveIndex(allStates.length - 1);
    disconnectSocket();
  }

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
              await new Promise((r) => setTimeout(r, 1200));
              handleGameEnd(
                winner_id === 0 ? "draw" : winner_id === 1 ? "white" : "black"
              );
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

      socket.on("fetch-saved-game", (msg) => {
        try {
          const response = JSON.parse(msg);
          if (response["ok"] && Number.isInteger(response["winner"])) {
            console.log("Res win: ", response["winner"]);
            let savedWinner: WINNER = "unknown";
            switch (response["winner"]) {
              case 0:
                savedWinner = "draw";
                break;
              case 1:
                savedWinner = "white";
              case 2:
                savedWinner = "black";
              default:
                console.log("Fetched winner: ", response["winner"]);
                break;
            }
            if (savedWinner !== "unknown") {
              handleGameEnd(savedWinner);
            }
            setWinner(savedWinner);
          } else {
            console.error(
              "[!!!] Error when fetching saved data: ",
              response["error"] ?? ""
            );
          }
        } catch (error) {
          console.error("[!!!] Can't fetch saved game data");
        }
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
      const newGame = getChessPosisition(gameConfig?.variant);
      console.log("[NEW]: ", newGame, newGame.fen());
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
    const initNewGame = {
      id,
      userId,
      config: gameConfig,
    }; // TODO: Add preferences (difficulty, timer, ...)
    socket?.emit("start-game", JSON.stringify(initNewGame));
  };

  const undoMoveSocket = () => {
    const undoMoveData = { id: id };
    socket?.emit("undo", JSON.stringify(undoMoveData));
  };

  const connectSocket = () => {
    // TODO: Auto disconnect after a while?
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      autoConnect: false,
      reconnection: true,
    });
    // onInitGame(socket);
    fetchSavedGame(socket);
    setSocket(socket);
  };

  const fetchSavedGame = (socket: Socket) => {
    const savedGame = { id };
    console.log("Fetching saved game...");
    socket.emit("fetch-saved-game", JSON.stringify(savedGame));
  };

  // End of socket
  const [game, setGame] = useState(getChessPosisition(gameConfig?.variant));
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
    if (gameConfig?.variant === 2) {
      gameCopy.load("bnnqrkrb/pppppppp/8/8/8/8/PPPPPPPP/BNNQRKRB w KQkq - 0 1");
    }
    setGame(gameCopy);
    cleanOldGame();
    setMoves([]);

    if (currentTimeout) clearTimeout(currentTimeout);
    setPlaying(false);

    setWPlayerTimeLeft((gameConfig?.timeMode ?? 0) * 60000);
    setBPlayerTimeLeft((gameConfig?.timeMode ?? 0) * 60000);
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
    handleGameEnd("black");
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

  const prevMove = () => {
    const newMoveIndex = Math.max(moveIndex - 1, 0);
    const currentGame = allGameStates[newMoveIndex];
    // console.log("ALL: ", moveIndex, allGameStates);
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

    prevMove,
    nextMove,

    socket,
  };
};

export default useChessSocket;
