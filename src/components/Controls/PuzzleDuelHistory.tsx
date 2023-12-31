import React from "react";
import {DuelHistory} from "@/helpers/types";

type PuzzleDuelHistoryProps = {
	state: string;
}

const PuzzleDuelHistory : React.FC<PuzzleDuelHistoryProps> = (props) => {
	return (
		<span>
			{props.state === DuelHistory.win ?
				<span className={`pl-3`}>
					<span className={`bg-[#008800] text-center text-slate-100 text-3xl font-bold pl-1.5 pr-1.5 rounded`}>
						W
					</span>
				</span>
				: props.state === DuelHistory.lose ?
					<span className={`pl-3`}>
						<span className={`bg-[#D73043] text-center text-slate-100 text-3xl font-bold pl-3.5 pr-3.5 rounded w-[8px] h-[8px]`}>
							L
						</span>
					</span>
					:
					<span className={`pl-3 w-[8px]`}>
						<span className={`bg-gray-500 text-center text-slate-100 text-3xl font-bold pl-2.5 pr-2.5 rounded  h-[8px]`}>
							U
						</span>
					</span>
			}
		</span>
	)
}

export default PuzzleDuelHistory