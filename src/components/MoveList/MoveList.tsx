import { Move } from 'chess.js';
import MoveItem from './MoveItem';

type MoveListType = {
  moves: Move[];
};

const MoveList = ({ moves }: MoveListType) => {
  return (
    <ul className="max-h-[450px] h-[450px] w-[450px] overflow-y-auto divide-y border rounded-lg">
      {moves?.map((move, index) => (
        <MoveItem move={move} key={index} />
      ))}
    </ul>
  );
};

export default MoveList;
