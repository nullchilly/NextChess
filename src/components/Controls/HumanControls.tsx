import { Button } from '../ui/button';

type HumanControlsType = {
  // undoMove: () => void;
  forfeitGame: () => void;
};

const HumanControls = ({
  // undoMove,
  forfeitGame,
}: HumanControlsType) => {
  return (
    <div className="flex gap-4 mt-4">
      {/* <Button className="w-full" onClick={() => resetGame()}>
        Reset Game
      </Button> */}
      <Button className="w-full" onClick={() => forfeitGame()}>
        Forfeit
      </Button>
      {/* <Button className="w-full" onClick={() => undoMove()}>
        Undo
      </Button> */}
    </div>
  );
};

export default HumanControls;
