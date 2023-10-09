import { getPieceSrc } from '@/helpers/images';
import { Move } from 'chess.js';
import Image from 'next/image';

type MoveItemType = {
  move: Move;
};

const MoveItem = ({ move }: MoveItemType) => {
  return (
    <li className="flex justify-between gap-x-6 py-2 px-4">
      <div className="flex min-w-0 gap-x-6">
        <Image
          className="flex-none rounded-full"
          src={getPieceSrc(move.color, move.piece)}
          alt="Chess Piece"
          width={45}
          height={45}
        />
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
