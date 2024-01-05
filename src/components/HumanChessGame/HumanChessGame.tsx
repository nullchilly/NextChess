"use client";

import { UserContext } from "@/context/UserContext";
import useChessHumanSocket from "@/hooks/useChessHumanSocket";
import { useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import PlayerCard from "../Card/PlayerCard";
import MoveList from "../MoveList/MoveList";
import ModalEndGame from "../Modal/ModalEndGame";
import { Button } from '../ui/button';

type Props = {
  id: string;
};

const HumanChessGame = ({ id }: Props) => {
  const { userId, name } = useContext(UserContext);
  const [gameUrl, setGameUrl] = useState<string>("");
  const [isModalEndGameOpen, setOpenModalEndGame] = useState<boolean>(true);

  useEffect(() => {
    const ISSERVER = typeof window === "undefined";
    try {
      if (!ISSERVER) {
        setGameUrl(window.location.href);
      }
    } catch (error) {
      console.error("Can't parse game config: ", error, ISSERVER);
    }
  }, []);
  const {
    socket,
    winner,
    forfeitGame,
    customSquares,
    playable,
    pieceColor,
    onPieceDrop,
    game,
    gameFen,
    setGameFen,
    opponentName,
  } = useChessHumanSocket({ id, userId, name });

  function isDraggablePiece(args: { piece: Piece; sourceSquare: Square }) {
    return args.piece.startsWith(pieceColor);
  }

  return (
    <>
      <div className="p-4">
        {!playable
          ? `To invite someone to play, give this URL: ${gameUrl}`
          : `May the best man win`}
      </div>
      <div className="flex p-4 mt-8">
        <div className="flex justify-center w-2/3">
          <div className="w-[500px]">
            <span className={`text-l ${game.turn() === "b" ? 'text-black' : 'text-white'} font-mono flex items-center pb-3 pt-0.5`}>
              {" "}
              {game.turn() === "w" ? "White turn" : "Black turn"}{" "}
            </span>
            <div>
              <PlayerCard name={opponentName} link="" />
            </div>
            <Chessboard
              id={id}
              onPieceDrop={onPieceDrop}
              boardOrientation={pieceColor === "b" ? "black" : "white"}
              isDraggablePiece={isDraggablePiece}
              position={gameFen}
              customBoardStyle={{
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              customSquareStyles={{ ...customSquares.check }}
            />
            <div>
              <PlayerCard name={name ?? "Guest"} link="" />
            </div>
          </div>
        </div>
        <div className="flex justify-center w-1/3">
          <div>
          {playable ? (
              <>
                <MoveList
                  moves={game.history({ verbose: true }).reverse()}
                  bot={{ id: "0", name: "shark" }}
                />
                {/* {winner !== "unknown" ? (
                  <div className="flex justify-center">
                    <CaretLeftFilled
                      style={{ fontSize: "32px" }}
                      onClick={prevMove}
                    />
                    <CaretRightFilled
                      style={{ fontSize: "32px" }}
                      onClick={nextMove}
                    />
                  </div>
                ) : null} */}
                {/* Cannot make HumanControls work??? */}
                <div className="flex gap-4 mt-4">
                  <Button className="w-full" onClick={() => forfeitGame()}>
                    Forfeit
                  </Button>
                </div>
              </>
            ) : (
              null
              // <PrepareCard
              //   botList={botList}
              //   onSelectBot={onSelectBot}
              //   bot={bot ? bot : { id: "0", name: "shark" }}
              // />
            )}
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
    </>
  );
};

export default HumanChessGame;
