import React from "react";
import BotIcon from "@/components/icons/BotIcon";

type PlayerInfoCardProps = {
	id: string,
	name: string,
	inGame: boolean,
}

const PlayerInfoCard: React.FC<PlayerInfoCardProps> = ({id, name, inGame}) => {
	return (
		<div className="bg-[#57903C]">
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
					<div className="h-[250px] w-[250px]">
						<BotIcon name={name}/>
					</div>
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