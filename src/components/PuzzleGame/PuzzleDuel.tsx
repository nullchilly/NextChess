'use client';

import React, {useContext, useEffect, useState} from "react";
import {Chessboard} from "react-chessboard";
import ControlsPuzzleDuel from "@/components/Controls/ControlsPuzzleDuel";
import {UserContext} from "@/context/UserContext";
import ModalDuel from "@/components/Modal/ModalDuel";
import usePuzzleDuelSocket from "@/hooks/usePuzzleDuelSocket";
import {Chess} from "chess.js";
import {StatePuzzleDuel} from "@/helpers/types";

type PuzzleDuelType = {
	type?: string;
}

const PuzzleDuel : React.FC<PuzzleDuelType> = () => {
	const {name, userId} = useContext(UserContext);
	const {
		start,
		state,
		puzzleData,
		opposite,
		resultOpposite,
		getResult,
		onPlay,
		current,
		setUserId,
		dataPuzzles,
		socket,
		isEndGame,
		winner,
		resultL,
		resultR,
		isOpenModalResult,
		setIsOpenModalResult,
		submitPuzzle,
		endGamePuzzle
	} = usePuzzleDuelSocket();
	const [game, setGame] = useState(new Chess());
	const [idPuzzle, setIdPuzzle] = useState(0);
	const [validMoves, setValidMoves] = useState<string[]>([]);
	
	useEffect(() => {
		setUserId(userId);
	}, [userId]);
	
	useEffect(() => {
		if (puzzleData && puzzleData.fen && start) {
			setGame(new Chess(puzzleData.fen));
			setValidMoves(puzzleData.moves);
		}
	}, [puzzleData, start]);
	
	const onMove = (move: any) => {
		try {
			const tmp = new Chess(game.fen());
			const result = tmp.move(move);
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

	const onDrop = (source: string, target: string) => {
		const move: any = onMove({
			from: source,
			to: target,
			promotion: "q", // promote to a queen
		});
		console.log(move)
		if (move === false) {
			return true;
		}
		
		if (!move) {
			if (puzzleData) {
				submitPuzzle(puzzleData.id, false);
			}
			return false;
		}

		setGame(new Chess(move.after) as any);
		const computerMove = validMoves[1];
		const remainMove = validMoves.slice(2);

		setValidMoves(validMoves.slice(1));
		if (computerMove) {
			setTimeout(() => {
				const tmp = new Chess(move.after);
				const result = tmp.move(computerMove as any);
				setValidMoves(remainMove);
				setGame(new Chess(result.after) as any);
			}, 200);
		} else {
				if (puzzleData) {
					submitPuzzle(puzzleData.id, true);
				}
		}
		return true;
	};
	
	return (
		<div>
			<div className="flex mt-8">
				<div className="flex justify-center w-2/3">
					<div className="w-[650px] flex pt-4 pb-4">
						<div className="">
							<Chessboard
								boardWidth={650}
								position={game.fen()}
								onPieceDrop={onDrop}
								boardOrientation={'white'}
								animationDuration={300}
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
									player={puzzleData?.player}
									competitor={opposite ? opposite : "Unknown"} //TODO: mock competitor
									resultL={resultL}
									resultR={resultR}
									state={state}
									// resultL={[1, 1, -1, 0, 0, 1, 1, -1, 0, 0]}
									// resultR={[1, 1, -1, 0, 1, 1, -1, 0, 0, 1]}
									// state={StatePuzzleDuel.finding}
									history={["win", "win", "win", "win", "win"]}
									onFinish={endGamePuzzle}
									onPlay={onPlay}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{isOpenModalResult && <ModalDuel isWon={winner === userId} isOpen={isOpenModalResult} onCLose={setIsOpenModalResult}/>}
		</div>
	)
}

export default PuzzleDuel;