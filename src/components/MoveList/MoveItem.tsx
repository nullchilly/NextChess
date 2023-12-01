import { Move } from 'chess.js';
import ChessPiece from "@/components/icons/ChessPiece";

type MoveItemType = {
  move: Move;
};

const MoveItem = ({ move }: MoveItemType) => {
  return (
    <li className="flex justify-between gap-x-6 py-2 px-4">
      <div className="flex min-w-0 gap-x-6">
        <div className="flex-none rounded-full" >
          <ChessPiece name={move.piece} color={move.color} height={45} width={45} />
        </div>
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {move.color === 'b' ? 'Black' : 'White'} Move
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            From: {move.from} | To: {move.to}
          </p>
        </div>
      </div>
    </li>
  );
};

export default MoveItem;
