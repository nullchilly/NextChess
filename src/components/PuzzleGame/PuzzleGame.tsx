'use client';

import { Chessboard } from 'react-chessboard';

import Controls from '../Controls/Controls';
import MoveList from '../MoveList/MoveList';

import useChess, { ChessType } from '@/hooks/useChess';
import PlayerCard from "@/components/Card/PlayerCard";
import PrepareCard from "@/components/Card/PrepareCard";
import {useEffect, useState} from "react";
import {BotProps} from "@/type/type";

type PuzzleGameProps = {
  id: string
};

const PuzzleGame = ({ id }: PuzzleGameProps) => {
  return (
    <div className="flex p-4 mt-8">
      <div className="flex justify-center w-2/3">
        <div className="w-[450px]">
          <div className="">
            <Chessboard

            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-1/3">
        <div>
        
        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;
