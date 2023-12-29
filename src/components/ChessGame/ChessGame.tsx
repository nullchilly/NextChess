"use client";

import { Chessboard } from "react-chessboard";

import Controls from "../Controls/Controls";
import MoveList from "../MoveList/MoveList";

import useChessSocket, { ChessType } from "@/hooks/useChessSocket";
import PlayerCard from "@/components/Card/PlayerCard";
import PrepareCard from "@/components/Card/PrepareCard";
import { useContext, useEffect, useState } from "react";
import { BotProps } from "@/types";

import PlayerTimer from "@/components/PlayerTimer/PlayerTimer";
import ModalEndGame from "../Modal/ModalEndGame";

import { CaretLeftFilled, CaretRightFilled } from "@ant-design/icons";
import { UserContext } from "@/context/UserContext";

type ChessGameType = {
  id: string;
  type: ChessType;
};

const ChessGame = ({ id, type }: ChessGameType) => {
  const { userId } = useContext(UserContext);
  const {
    game,
    // moves,
    playing,
    customSquares,
    winner,

    wPlayerTimeLeft,
    isWPlayerActive,

    bPlayerTimeLeft,
    isBPlayerActive,

    onPieceDrop,
    undoMove,
    startGame,
    resetGame,
    forfeitGame,

    prevMove,
    nextMove

  } = useChessSocket({ type, id, userId });

  const [botList, setBotList] = useState<BotProps[]>([]);
  const [bot, setBot] = useState<BotProps>({ id: "0", name: "shark" });
  const [isModalEndGameOpen, setOpenModalEndGame] = useState<boolean>(true);

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
            <PlayerTimer
              timeLeft={bPlayerTimeLeft}
              going={isBPlayerActive && playing}
              turnIndicator={false}
            />
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
            position={game.fen()}
            customBoardStyle={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customSquareStyles={{ ...customSquares.check }}
          />
          <div className="">
            <PlayerCard name={"Chien"} link={"/profile/chien"} />
            <PlayerTimer
              timeLeft={wPlayerTimeLeft}
              going={isWPlayerActive && playing}
              turnIndicator={true}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-1/3">
        <div>
          {playing ? (
            <>
              <MoveList
                moves={game.history({ verbose: true }).reverse()}
                bot={bot ? bot : { id: "0", name: "shark" }}
              />
              {winner !== "unknown" ? 
                <div className="flex justify-center">
                  <CaretLeftFilled style={{fontSize: "32px"}} onClick={prevMove} />
                  <CaretRightFilled style={{fontSize: "32px"}} onClick={nextMove} />
                </div>
              : null}
            </>
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
            forfeitGame={forfeitGame}
            undoMove={undoMove}
          />
        </div>
      </div>
      {winner === "unknown" ? null : (
        <ModalEndGame
          winner={winner}
          isOpen={isModalEndGameOpen}
          setOpen={setOpenModalEndGame}
        />
      )}
    </div>
  );
};

export default ChessGame;
