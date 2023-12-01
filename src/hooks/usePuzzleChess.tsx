import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Puzzle } from "@/types";
import { router } from "next/client";
import { randomInt } from "crypto";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

const usePuzzleChess = (puzzleData: Puzzle) => {
  const [solved, setSolved] = useState(false);
  const [rated, setRated] = useState(true);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [game, setGame] = useState(new Chess());
  const [error, setError] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [messHint, setMessHint] = useState<string>("");

  useEffect(() => {
    if (puzzleData && puzzleData.fen) {
      setData();
    }
  }, [puzzleData, id]);

  const setData = () => {
    if (puzzleData && puzzleData.fen) {
      setGame(new Chess(puzzleData.fen));
      setValidMoves(puzzleData.moves);
      setSolved(false);
      setRated(true);
      setId(puzzleData.id);
      setMessage("pending");
    }
  };

  const onIdChange = (id: string) => {
    if (id) {
      router.push(`/puzzle/${id}`);
      setId(id);
    }
  };

  const onNext = () => {
    onIdChange(randomInt(1, 1000).toString());
  };

  const onMove = (move: any) => {
    try {
      const tmp = new Chess(game.fen());
      const result = tmp.move(move);
      console.log("result", result);
      if (result === null) {
        return false;
      }
      if (result.san !== validMoves[0]) return null;
      return result;
    } catch (error) {
      setError(error);
      return false;
    }
  };

  const onDrop = (source: string, target: string) => {
    const move: any = onMove({
      from: source,
      to: target,
      promotion: "q", // promote to a queen
    });

    if (move === false) {
      return true;
    }

    if (!move) {
      setMessage("done");
      if (rated) {
        setSolved(false);
        console.log("tach me m roi ngu vai ca lon");
        setRated(false);
      }
      return false;
    }

    setGame(new Chess(move.after) as any);
    const computerMove = validMoves[1];
    const remainMove = validMoves.slice(2);

    setValidMoves(validMoves.slice(1));
    if (computerMove) {
      setMessage("pending");
      setTimeout(() => {
        const tmp = new Chess(move.after);
        const result = tmp.move(computerMove as any);
        setValidMoves(remainMove);
        setGame(new Chess(result.after) as any);
      }, 200);
    } else {
      setSolved(true);
      if (rated) {
        console.log("duoc lam con trai");
        setMessage("done");
        setSolved(true);
      }
    }
    return true;
  };

  const onRetry = () => {
    if (puzzleData && puzzleData.fen) {
      setData();
    }
  };

  const onHint = () => {
    setMessHint(validMoves[0]);
  };

  const onSkip = () => {
    onIdChange(randomInt(1, 1000).toString());
  };

  return {
    game,
    error,
    message,
    solved,
    onDrop,
    onSkip,
    onHint,
    onRetry,
    onNext,
  };
};

export default usePuzzleChess;
