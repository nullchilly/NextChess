import {getSvgSrc} from "@/helpers/images";
import React from "react";

type PlayerInfoCardProps = {
	id: string,
	name: string,
	inGame: boolean,
}

const PlayerInfoCard: React.FC<PlayerInfoCardProps> = ({id, name, inGame}) => {
	return (
		<div className="bg-white">
			<div className="w-auto flex pl-4 flex-col items-center">
				{ inGame &&
					<div
						className="font-bold text-center"
						style={{
							fontSize: "25px",
						}}
					>
						{name ? name : "none"}
					</div>
				}
				<div>
					<img src={getSvgSrc(name)} className="h-[250px]" alt=">"/>
				</div>
				
				{!inGame &&
					<div
					className="font-bold text-center"
					style={{
						fontSize: "25px",
					}}
					>
						{name ? name : "none"}
					</div>
				}
			</div>
		</div>
	)
}

export default PlayerInfoCard