import { PieceColor, PieceType, Square } from 'chess.js';
import {
  bishopEvalBlack,
  bishopEvalWhite,
  kingEvalBlack,
  kingEvalWhite,
  knightEval,
  pawnEvalBlack,
  pawnEvalWhite,
  queenEval,
  rookEvalBlack,
  rookEvalWhite,
} from './chessEvaluations';

type BoardType = {
  type: PieceType;
  color: PieceColor;
  square: Square;
} | null;

export const evaluateBoard = (board: BoardType[][]) => {
  let totalEval = 0;

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      totalEval += getPieceValue(board[x][y], x, y);
    }
  }

  return totalEval;
};

const getPieceValue = (piece: BoardType, x: number, y: number) => {
  if (piece === null) return 0;

  const getAbsoluteValue = function (
    piece: PieceType,
    isWhite: boolean,
    x: number,
    y: number
  ) {
    switch (piece) {
      case 'p':
        return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
      case 'n':
        return 30 + knightEval[y][x];
      case 'b':
        return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
      case 'r':
        return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
      case 'q':
        return 90 + queenEval[y][x];
      case 'k':
        return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
      default:
        throw 'Unknown piece type: ' + piece;
    }
  };

  const absoluteValue = getAbsoluteValue(piece.type, piece.color === 'w', x, y);
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
};
