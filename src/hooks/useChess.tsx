import { useState } from 'react';
import React from 'react'
import { Chess, Move, Square } from 'chess.js';
import { evaluateBoard } from '@/helpers/chess';
import { ShortMove } from '@/type/type';

export type ChessType = 'random' | 'computer' | 'minimax';

enum ConnectionStatus {
  Open = "open",
  Connecting = "connecting",
  Disconnected = "disconnected",
}

const useChess = (type: ChessType) => {
  // Start of socket
  const [socket, setSocket] = React.useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] =
    React.useState<ConnectionStatus>(ConnectionStatus.Disconnected);

  const disconnectSocket = React.useCallback(() => {
    socket?.close();
    setSocket(null);
    setConnectionStatus(ConnectionStatus.Disconnected);
  }, [socket, setConnectionStatus]);

  React.useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        setConnectionStatus(ConnectionStatus.Open);
      };

      socket.onmessage = (msg) => {
        const message = JSON.parse(msg.data);
        console.log("Message from BE: ", message['message']);
        makeMove({
          from: message['message']['from'],
          to: message['message']['to'],
          promotion: 'q',
        });
      };

      socket.onerror = () => {
        disconnectSocket();
        console.error("Websocket connection error");
      };

      socket.onclose = () => {
        disconnectSocket();
      };
    }
  }, [disconnectSocket, setConnectionStatus, socket]);

  const sendMessage = (move: string) => {
    console.log("MOVE: ", move);
    socket?.send(move);
  };

  const onCloseSocket = () => {
    socket?.close();
    setSocket(null);
    setConnectionStatus(ConnectionStatus.Disconnected);
  };

  const connectSocket = () => {
    const url = `${process.env.NEXT_PUBLIC_SOCKET_URL}`;
    const socket = new WebSocket(url);
    setSocket(socket);
  };
  // End of socket
  const [game, setGame] = useState(new Chess());
  const [playing, setPlaying] = useState(false);
  const [moves, setMoves] = useState<Move[]>([]);
  const [depth, setDepth] = useState(3);
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
	
  const getComputerType = () => {
    if (type === 'random') return calculateRandomMove;
    else if (type === 'computer') return calculateBestMove;

    return calculateMinimaxMove;
  };

  const makeMove = (move: string | ShortMove) => {
    console.log(move)
    const gameCopy = game ;
    const result = gameCopy.move(move);

    if (result) {
      setMoves((prevMoves) => [result, ...prevMoves]);
      setGame(gameCopy);
    }

    return result;
  };

  const calculateRandomMove = () => {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length <= 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeMove(possibleMoves[randomIndex]);
  };

  const calculateBestMove = () => {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length <= 0) return;

    let bestMove = null;
    let bestValue = -9999;

    for (const move of possibleMoves) {
      game.move(move);
      const boardValue = -evaluateBoard(game.board());
      game.undo();

      if (boardValue >= bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }

    if (bestMove === null) return;
    console.log(bestMove)
    makeMove(bestMove);
  };

  const minimax = (
    depth: number,
    game: Chess,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean
  ) => {
    if (depth <= 0) return -evaluateBoard(game.board());

    const possibleMoves = game.moves();

    if (isMaximizingPlayer) {
      let bestValue = -9999;
      for (const move of possibleMoves) {
        game.move(move);
        bestValue = Math.max(
          bestValue,
          minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer)
        );
        game.undo();

        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) return bestValue;
      }
      return bestValue;
    } else {
      let bestValue = 9999;
      for (const move of possibleMoves) {
        game.move(move);
        bestValue = Math.min(
          bestValue,
          minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer)
        );
        game.undo();

        beta = Math.min(beta, bestValue);
        if (beta <= alpha) return bestValue;
      }
      return bestValue;
    }
  };

  const calculateMinimaxMove = () => {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length <= 0) return;

    const searchDepth = depth;
    let minimaxMove = null;
    let bestValue = -9999;

    for (const move of possibleMoves) {
      game.move(move);
      const boardValue = minimax(searchDepth - 1, game, -10000, 10000, false);
      game.undo();

      if (boardValue >= bestValue) {
        bestValue = boardValue;
        minimaxMove = move;
      }
    }

    if (minimaxMove === null) return;
    makeMove(minimaxMove);
  };

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (!playing) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) return false;
    sendMessage(move.from + move.to)
    return true;
  };

  const resetGame = () => {
    const gameCopy = game;
    gameCopy.reset();
    setGame(gameCopy);

    setMoves([]);

    if (currentTimeout) clearTimeout(currentTimeout);
    setPlaying(false);
  };

  const startGame = () => {
    // connectSocket()
    resetGame();
    setPlaying(true);
  };

  return {
    game,
    playing,
    moves,

    depth,
    setDepth,

    onPieceDrop,
    startGame,
    resetGame,
  };
};

export default useChess;
