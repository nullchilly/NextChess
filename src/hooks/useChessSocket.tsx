import { useState } from 'react';
import { Chess, ChessInstance, Move, ShortMove, Square } from 'chess.js';
import { evaluateBoard } from '@/helpers/chess';

export type ChessType = 'random' | 'computer' | 'minimax';

const useChess = (type: ChessType) => {
  const [game, setGame] = useState(new Chess());
  const [playing, setPlaying] = useState(false);
  const [moves, setMoves] = useState<Move[]>([]);
  const [depth, setDepth] = useState(3);
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();

  // TODO: Change this into a {key: value} object
  const getComputerType = () => {
    if (type === 'random') return calculateRandomMove;
    else if (type === 'computer') return calculateBestMove;

    return calculateMinimaxMove;
  };

  const makeMove = (move: string | ShortMove) => {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);

    if (result) {
      setMoves((prevMoves) => [result, ...prevMoves]);
      setGame(gameCopy);
    }

    return result;
  };

  const calculateRandomMove = () => {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length <= 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeMove(possibleMoves[randomIndex]);
  };

  const calculateBestMove = () => {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length <= 0) return;

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
    makeMove(bestMove);
  };

  const minimax = (
    depth: number,
    game: ChessInstance,
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
    if (game.game_over() || game.in_draw() || possibleMoves.length <= 0) return;

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

    const newTimeout = setTimeout(getComputerType(), 500);
    setCurrentTimeout(newTimeout);
    return true;
  };

  const resetGame = () => {
    const gameCopy = { ...game };
    gameCopy.reset();
    setGame(gameCopy);

    setMoves([]);

    if (currentTimeout) clearTimeout(currentTimeout);
    setPlaying(false);
  };

  const startGame = () => {
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
