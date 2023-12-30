'use client';

import React, {useContext} from "react";
import {Chessboard} from "react-chessboard";
import ControlsPuzzleDuel from "@/components/Controls/ControlsPuzzleDuel";
import {UserContext} from "@/context/UserContext";
import {StatePuzzleDuel} from "@/helpers/types";

type PuzzleDuelType = {
	type?: string;
}

const PuzzleDuel : React.FC<PuzzleDuelType> = () => {
	const {name} = useContext(UserContext);
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
									state={StatePuzzleDuel.pending}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PuzzleDuel;