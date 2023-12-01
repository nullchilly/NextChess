"use client";

import { Chessboard } from "react-chessboard";

import Controls from "../Controls/Controls";
import MoveList from "../MoveList/MoveList";

import useChessSocket, { ChessType } from "@/hooks/useChessSocket";
import PlayerCard from "@/components/Card/PlayerCard";
import PrepareCard from "@/components/Card/PrepareCard";
import { useEffect, useState } from "react";
import { BotProps } from "@/types";

type ChessGameType = {
  id: string;
  type: ChessType;
};

const ChessGame = ({ id, type }: ChessGameType) => {
  const {
    game,
    moves,
    playing,
    customSquares,
    gameFen,
    setGameFen,
    onPieceDrop,
    undoMove,
    startGame,
    resetGame,
  } = useChessSocket({ type, id });

  const [botList, setBotList] = useState<BotProps[]>([]);
  const [bot, setBot] = useState<BotProps>({ id: "0", name: "shark" });

  const onSelectBot = (bot: BotProps) => {
    setBot(bot);
  };

  useEffect(() => {
    setBotList([
      { id: "0", name: "shark" },
      { id: "1", name: "elephant" },
      { id: "2", name: "owl" },
      { id: "3", name: "monkey" },
      { id: "4", name: "penguin" },
      { id: "5", name: "cat" },
    ]);
  }, []);

  return (
    <div className="flex p-4 mt-8">
      <div className="flex justify-center w-2/3">
        <div className="w-[450px]">
          <div className="">
            <PlayerCard
              name={bot ? bot.name : "none"}
              link={bot ? "/home" : "/profile/chien"}
            />
          </div>
          {!playing && (
            <div className="absolute flex justify-center items-center w-[450px] h-[450px] z-10"></div>
          )}
          <Chessboard
            id={id}
            onPieceDrop={onPieceDrop}
            // boardOrientation="black" TODO: make the bot play 1st, or just ignore, bot ALWAYS 'black'.
            position={gameFen}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customSquareStyles={{ ...customSquares.check }}
          />
          <div className="">
            <PlayerCard name={"Chien"} link={"/profile/chien"} />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-1/3">
        <div>
          {playing ? (
            <MoveList
              moves={moves}
              bot={bot ? bot : { id: "0", name: "shark" }}
            />
          ) : (
            <PrepareCard
              botList={botList}
              onSelectBot={onSelectBot}
              bot={bot ? bot : { id: "0", name: "shark" }}
            />
          )}
          <Controls
            startGame={startGame}
            resetGame={resetGame}
            undoMove={undoMove}
          />
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
