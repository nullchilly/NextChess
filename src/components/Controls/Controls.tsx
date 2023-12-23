import { Button } from '../ui/button';


type ControlsType = {
  startGame: () => void;
  resetGame: () => void; // TODO: Delete
  undoMove: () => void;
  forfeitGame: () => void;
};

const Controls = ({
  startGame,
  resetGame,
  undoMove,
  forfeitGame,
}: ControlsType) => {
  return (
    <div className="flex gap-4 mt-4">
      <Button className="w-full" onClick={() => startGame()}>
        Start Game
      </Button>
      {/* <Button className="w-full" onClick={() => resetGame()}>
        Reset Game
      </Button> */}
      <Button className="w-full" onClick={() => forfeitGame()}>
        Forfeit
      </Button>
      <Button className="w-full" onClick={() => undoMove()}>
        Undo
      </Button>
    </div>
  );
};

export default Controls;
