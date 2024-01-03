"use client";

import { UserContext } from "@/context/UserContext";
import useChessHumanSocket from "@/hooks/useChessHumanSocket";
import { useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

type Props = {
  id: string;
};

const HumanChessGame = ({ id }: Props) => {
  const { userId, name } = useContext(UserContext);
  const [gameUrl, setGameUrl] = useState<string>("");
  
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
  const { socket, playable, pieceColor, onPieceDrop, game, gameFen, setGameFen } = useChessHumanSocket({ id, userId });

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
            // customSquareStyles={{ ...customSquares.check }}
          />
        </div>
        <div className="flex justify-center w-1/3">
          Right
          <button onClick={() => {
            // setGameFen(game.fen())
            console.log("CURRENT FEN: ", game.fen(), game)}
          }>
            FEN
          </button>
        </div>
      </div>
    </>
  );
};

export default HumanChessGame;
