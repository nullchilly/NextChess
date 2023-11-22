'use client';

import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import React, {useEffect, useState} from "react";
import usePuzzleData from "@/hooks/usePuzzleData";
import usePuzzleChess from "@/hooks/usePuzzleChess";
import ControlsPuzzle from "@/components/Controls/ControlsPuzzle";

type PuzzleGameProps = {
  id: string
};

const PuzzleGame = ({ id }: PuzzleGameProps) => {
  const {data: puzzleData, error: errorData, isLoading} = usePuzzleData(id);
  const {
    game,
    error,
    message,
    solved,
    onDrop,
    onSkip,
    onHint,
    onRetry,
    onNext,
  } = usePuzzleChess(puzzleData)
  //TODO: fix cant load game.fen (could be due to usePuzzleChess hook)
  return (
    <div className="flex p-4 mt-8">
      <div className="flex justify-center w-2/3">
        <div className="w-[650px] flex pt-4 pb-4">
          <div className="">
            <Chessboard
              boardWidth={650}
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={puzzleData.player.toLocaleLowerCase() as any}
              animationDuration={300}
              arePiecesDraggable={!solved}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-1/3">
        <div>
          <div className="flex pt-4 pb-4">
            <div className="max-h-[650px] h-[650px] w-[450px] overflow-y-auto divide-y border rounded-lg">
              <ControlsPuzzle
                puzzleData={puzzleData}
                result={solved ? 1 : 0}
                status={message}
                onNext={onNext}
                onRetry={onRetry}
                onHint={onHint}
                onSkipModal={onSkip}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;
