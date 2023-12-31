'use client';

import React, {useContext, useEffect, useState} from "react";
import {Chessboard} from "react-chessboard";
import ControlsPuzzleDuel from "@/components/Controls/ControlsPuzzleDuel";
import {UserContext} from "@/context/UserContext";
import {StatePuzzleDuel} from "@/helpers/types";
import ModalDuel from "@/components/Modal/ModalDuel";
import usePuzzleDuelSocket from "@/hooks/usePuzzleDuelSocket";
import {Puzzle} from "@/types";
import {Chess} from "chess.js";

type PuzzleDuelType = {
	type?: string;
}

const PuzzleDuel : React.FC<PuzzleDuelType> = () => {
	const {name, userId} = useContext(UserContext);
	const [isOpenModalResult, setIsOpenModalResult] = useState(false);
	const [resultL, setResultL] = useState<boolean[]>([])
	const [resultR, setResultR] = useState<boolean[]>([])
	const [puzzle, setPuzzle] = useState<Puzzle>();
	const {
		start,
		puzzleData,
		opposite,
		resultOpposite,
		getResult,
		onPlay,
		dataPuzzles,
		socket,
		isEndGame,
		winner,
		submitPuzzle,
		endGamePuzzle
	} = usePuzzleDuelSocket(userId);
	const [game, setGame] = useState(new Chess());
	const [idPuzzle, setIdPuzzle] = useState(0);
	const [validMoves, setValidMoves] = useState<string[]>([]);
	
	useEffect(() => {
		if (puzzleData && puzzleData.fen) {
			setGame(new Chess(puzzleData.fen));
			setValidMoves(puzzleData.moves);
		}
	}, [puzzleData]);
	
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
			console.error(error)
			return false;
		}
	};
	//
	// const onDrop = (source: string, target: string) => {
	// 	const move: any = onMove({
	// 		from: source,
	// 		to: target,
	// 		promotion: "q", // promote to a queen
	// 	});
	// 	if (move === false) {
	// 		return true;
	// 	}
	//
	// 	if (!move) {
	// 		setMessage("done");
	// 		if (rated) {
	// 			setSolved(false);
	// 			setRated(false);
	// 		}
	// 		return false;
	// 	}
	//
	// 	setGame(new Chess(move.after) as any);
	// 	const computerMove = validMoves[1];
	// 	const remainMove = validMoves.slice(2);
	//
	// 	setValidMoves(validMoves.slice(1));
	// 	if (computerMove) {
	// 		setMessage("pending");
	// 		setTimeout(() => {
	// 			const tmp = new Chess(move.after);
	// 			const result = tmp.move(computerMove as any);
	// 			setValidMoves(remainMove);
	// 			setGame(new Chess(result.after) as any);
	// 		}, 200);
	// 	} else {
	// 		setSolved(true);
	// 		if (rated) {
	// 			setMessage("done");
	// 			const raw = JSON.stringify({
	// 				"tacticsProblemId": id,
	// 				"seconds": 60,
	// 				"isPassed": true,
	// 				"isRated": true
	// 			});
	// 			const token = localStorage.getItem('accessToken');
	// 			if (token) {
	// 				fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/api/puzzle/submit", {
	// 					method: 'POST',
	// 					headers: {
	// 						'accessToken': token,
	// 						'Content-Type': 'application/json',
	// 					},
	// 					body: raw,
	// 				}).then(result => console.log(result))
	// 					.catch(error => console.log('error', error));
	// 			}
	// 			setSolved(true);
	// 		}
	// 	}
	// 	return true;
	// };
	
	return (
		<div>
			<div className="flex mt-8">
				<div className="flex justify-center w-2/3">
					<div className="w-[650px] flex pt-4 pb-4">
						<div className="">
							<Chessboard
								boardWidth={650}
								position={""}
								// onPieceDrop={()=>{}}
								boardOrientation={'white'}
								animationDuration={300}
								// arePiecesDraggable={!solved}
							/>
						</div>
					</div>
				</div>
				<div className="flex justify-center w-1/3">
					<div>
						<div className="flex pt-4 pb-4">
							<div className="max-h-[650px] h-[650px] w-[450px] border rounded-lg">
								<ControlsPuzzleDuel
									name={name}
									competitor={'mock'} //TODO: mock competitor
									resultL={[1, 1, -1, 0, 0, 0, 0, 0, 0]}
									resultR={[1, 1, -1, 0, 0, 0, 0, 0, 0]}
									state={StatePuzzleDuel.wait}
									history={["win", "win", "win", "win", "win"]}
									onFinish={endGamePuzzle}
									onPlay={onPlay}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{isOpenModalResult && <ModalDuel isWon={true} isOpen={isOpenModalResult} setOpen={setIsOpenModalResult}/>}
		</div>
	)
}

export default PuzzleDuel;