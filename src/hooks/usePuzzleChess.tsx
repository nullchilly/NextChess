import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Puzzle } from "@/types";
import { useRouter } from "next/navigation";
import { randomInt } from "crypto";
import { delay } from "@/helpers/chess"

const usePuzzleChess = (puzzleData: Puzzle) => {
  const [solved, setSolved] = useState(false);
  const [rated, setRated] = useState(true);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [game, setGame] = useState(new Chess());
  const [error, setError] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [id, setId] = useState<string>("");
  const router = useRouter();
  
  useEffect(() => {
    if (solved && rated) {
      // const result = fetch()
    }
  }, [solved]);
  
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
        setMessage("done");
        const raw = JSON.stringify({
          "tacticsProblemId": id,
          "seconds": 60,
          "isPassed": true,
          "isRated": true
        });
        const token = localStorage.getItem('accessToken');
        if (token) {
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/puzzle/submit", {
            method: 'POST',
            headers: {
              'accessToken': token,
              'Content-Type': 'application/json',
            },
            body: raw,
          }).then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
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

  
  
  const onHint = async () => {
    const hintMove = validMoves[0];
    const computerMove = validMoves[1];
    let tmpGame = game;
    console.log("validMoves:", validMoves);
    console.log("hintMove:", hintMove);
    console.log("computerMove:", computerMove);
    if (hintMove) {
      setMessage("pending");
      setTimeout(() => {
        const tmp = new Chess(tmpGame.fen());
        const result = tmp.move(hintMove as any);
        tmpGame = new Chess(result.after);
        setGame(tmpGame)
      }, 200);
    }
    await delay(1000);
    console.log(2)
    if (computerMove) {
      setMessage("pending");
      setTimeout(() => {
        const tmp = new Chess(tmpGame.fen());
        const result = tmp.move(computerMove as any);
        tmpGame = new Chess(result.after);
        setGame(tmpGame)
        console.log(3)
      }, 200);
      setValidMoves(validMoves.slice(2))
    } else {
      setSolved(true);
      setRated(false);
      setMessage("done");
      setValidMoves(validMoves.slice(1))
    }
    setGame(tmpGame)
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
