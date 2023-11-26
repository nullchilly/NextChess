import { useState } from 'react';
import React from 'react'
import { Chess, Move, Square } from 'chess.js';
import { io, Socket } from "socket.io-client";
import { ShortMove } from '@/type/type';

export type ChessType = 'random' | 'computer' | 'minimax';

type Props = {
  id: string
  type: ChessType
};

enum ConnectionStatus {
  Open = "open",
  Connecting = "connecting",
  Disconnected = "disconnected",
}

type EmitData = {
  move: string | ShortMove,
  id: string,
}

const useChessSocket = ({ type, id }: Props) => {
  // Start of socket
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionStatus>(ConnectionStatus.Disconnected);

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
      })

      socket.on("play-chess", (msg) => {
        console.log("Response", msg);
        const message = JSON.parse(msg);
        makeMove({
          from: message['message']['from'],
          to: message['message']['to'],
          promotion: 'q',
        });
      });

      socket.on("end-game", (msg) => {
        console.log("clean up state: ", msg);
      });

    }
  }, [disconnectSocket, setConnectionStatus, socket]);

  // Send latest move over socket
  const sendMove = (move: string) => {
    console.log("MOVE: ", move);
    const emitData: EmitData = {move, id};
    socket?.emit("play-chess", JSON.stringify(emitData));
  };

  // Make sure new game id not appeared in BE
  const cleanOldGame = () => {
    const endGameData = {"id": id};
    socket?.emit("end-game", JSON.stringify(endGameData));
  }

  const undoMoveSocket = () => {
    const undoMoveData = {"id": id};
    socket?.emit("undo", JSON.stringify(undoMoveData));
  }
  
  const connectSocket = () => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      autoConnect: false,
      reconnection: true,
    });
    setSocket(socket);
  };

  // End of socket
  const [game, setGame] = useState(new Chess());
  const [playing, setPlaying] = useState(false);
  const [moves, setMoves] = useState<Move[]>([]);
  const [gameFen, setGameFen] = useState<string>(game.fen());
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();

  const makeMove = (move: string | ShortMove) => {
    console.log(move)
    const gameCopy = game;
    const result = gameCopy.move(move);

    if (result) {
      setMoves((prevMoves) => [result, ...prevMoves]);
      setGame(gameCopy);
      setGameFen(gameCopy.fen());
    }

    return result;
  };

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (!playing) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) return false;
    sendMove(move.from + move.to + (move.promotion ? move.promotion : ''));
    return true;
  };

  const resetGame = () => {
    const gameCopy = game;
    gameCopy.reset();
    setGame(gameCopy);
    setGameFen(gameCopy.fen());
    cleanOldGame();
    setMoves([]);

    if (currentTimeout) clearTimeout(currentTimeout);
    setPlaying(false);
  };

  const startGame = () => {
    connectSocket();
    resetGame();
    setPlaying(true);
  };

  const undoMove = () => {
    undoMoveSocket();

    const gameCopy = game;
    gameCopy.undo();
    gameCopy.undo();

    const movesCopy = moves;
    movesCopy.shift();
    movesCopy.shift();

    setGame(gameCopy);
    setGameFen(gameCopy.fen());
    setMoves(movesCopy);
  }

  return {
    game,
    playing,
    moves,

    gameFen,
    setGameFen,

    onPieceDrop,
    undoMove,

    startGame,
    resetGame,
  };
};

export default useChessSocket;
