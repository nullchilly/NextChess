import { ShortMove } from "@/types";
import { Chess, Square } from "chess.js";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Props = {
  id: string;
  userId: number | undefined;
};

const useChessHumanSocket = ({ id, userId }: Props) => {
  // const { userId } = useContext(UserContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [_playersInLobby, setPlayersInLobby] = useState<number>(0); // May not using it anw
  const [pieceColor, setPieceColor] = useState<"w" | "b">("w");
  const [playable, setPlayable] = useState<boolean>(false); // True when there're 2 players in lobby
  const [game, setGame] = useState(new Chess());
  const [gameFen, setGameFen] = useState<string>("start");

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

      socket.on("human-new-player-join", async (msg) => {
        console.log("JOINED:", msg);
        try {
          const response = JSON.parse(msg);
          if (response["ok"]) {
            const currentNumberPlayer = response["numberPlayer"];
            const color = response["config"]["color"];
            setPlayersInLobby(currentNumberPlayer);
            setPlayable(currentNumberPlayer === 2);
            if (color === "w" || color === "b") setPieceColor(color);
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
    const newPlayerData = { id, userId };
    socket.emit("human-new-player-join", JSON.stringify(newPlayerData));
  };

  const makeMove = (move: string | ShortMove) => {
    console.log(move);
    const gameCopy = game;
    const result = gameCopy.move(move);

    if (result) {
      console.log("RESULT OK: ", result, gameCopy.fen());
      setGameFen(gameCopy.fen());
      setGame(gameCopy);
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
    console.log("STIIL OK?");
    return true;
  };

  return {
    socket,
    playable,
    pieceColor,
    onPieceDrop,
    game,
    gameFen,
    setGameFen,
  };
};

export default useChessHumanSocket;
