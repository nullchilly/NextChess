import { PieceColor, PieceType } from 'chess.js';

export const getPieceSrc = (color: PieceColor, piece: PieceType) => {
  return `assets/${color}_${piece}.svg`;
};
