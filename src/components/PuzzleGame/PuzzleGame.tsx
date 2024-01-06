'use client';

import { Chessboard } from 'react-chessboard';
import React, {useContext} from "react";
import usePuzzleData from "@/hooks/usePuzzleData";
import usePuzzleChess from "@/hooks/usePuzzleChess";
import ControlsPuzzle from "@/components/Controls/ControlsPuzzle";
import LoadingModal from "@/components/Modal/LoadingModal";
import {UserContext} from "@/context/UserContext";

type PuzzleGameProps = {
  id: string
};

const PuzzleGame = ({ id }: PuzzleGameProps) => {
  const {data: puzzleData, error: errorData, isLoading, onSkip} = usePuzzleData(id);
  const {
    game,
    message,
    solved,
    onDrop,
    onHint,
    onRetry,
  } = usePuzzleChess(puzzleData)
  
  const onCloseModal = () => {
  
  }
  return (
    <div>
      {
        isLoading ?
          <LoadingModal isOpen={isLoading} isAllowClose={false} onCloseModal={onCloseModal}/>
          :
          <div className="flex p-4 mt-8">
            <div className="flex justify-center w-2/3">
              <div className="w-[650px] flex pt-4 pb-4">
                <div className="">
                  <Chessboard
                    boardWidth={650}
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    boardOrientation={'white'}
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
                      onNext={onSkip}
                      onRetry={onRetry}
                      onHint={onHint}
                      onSkipModal={onSkip}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default PuzzleGame;
