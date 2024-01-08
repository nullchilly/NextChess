import { Move } from "chess.js";
import ChessPiece from "@/components/icons/ChessPiece";
import { AnalysisScore } from "@/helpers/types";

type MoveItemType = {
  move: Move;
  score?: AnalysisScore;
};

const MoveItem = ({ move, score }: MoveItemType) => {
  return (
    <li className="flex justify-between gap-x-6 py-2 px-4">
      <div className="flex min-w-0 gap-x-6">
        <div className="flex-none rounded-full">
          <ChessPiece
            name={move.piece}
            color={move.color}
            height={45}
            width={45}
          />
        </div>
        <div className="min-w-0 flex-auto">
          <p
            className={`text-sm font-semibold leading-6 ${
              move.color === "b" ? "text-black" : "text-white"
            }`}
          >
            {move.color === "b" ? "Black" : "White"} Move
          </p>
          <p
            className={`mt-1 truncate text-xs leading-5 ${
              move.color === "b" ? "text-black" : "text-white"
            }`}
          >
            From: {move.from} | To: {move.to}
          </p>
        </div>
      </div>
      {score ? (
        <div className={`flex min-w-0 gap-x-6 font-mono ${score.score < 0 ? "text-red-300" : "text-purple-300"}`}>
          {score.type}({score.score})
        </div>
      ) : null}
    </li>
  );
};

export default MoveItem;
