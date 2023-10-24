import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { ChessType } from '@/hooks/useChess';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type ControlsType = {
  startGame: () => void;
  resetGame: () => void;
  type: ChessType;
  depth: number;
  setDepth: Dispatch<SetStateAction<number>>;
};

const Controls = ({
  startGame,
  resetGame,
  type,
  depth,
  setDepth,
}: ControlsType) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDepth = Number(event.target.value);
    setDepth(newDepth);
  };

  return (
    <div className="flex gap-4 mt-4">
      <Button className="w-full" onClick={() => startGame()}>
        Start Game
      </Button>
      <Button className="w-full" onClick={() => resetGame()}>
        Reset Game
      </Button>
      {type === 'minimax' && (
        <Input
          type="number"
          placeholder="Depth"
          min={1}
          max={5}
          value={depth}
          onChange={handleOnChange}
        />
      )}
    </div>
  );
};

export default Controls;
