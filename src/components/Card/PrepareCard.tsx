import React from "react";
import BotSelector from "@/components/Card/BotSelector";
import {BotProps} from "@/type/type";
import PlayerInfoCard from "@/components/Card/PlayerInfoCard";

type PrepareCardProps = {
	bot: BotProps
	botList: BotProps[]
	onSelectBot: (bot: BotProps) => void
}

const PrepareCard: React.FC<PrepareCardProps> = ({botList, onSelectBot, bot}) => {

	return (
		<div>
			<div className="flex pt-4 pb-4">
				<ul className="max-h-[550px] h-[550px] w-auto overflow-y-auto divide-y border rounded-lg">
					<div
						className="w-[450px] text-center font-bold flex-wrap p-4"
						style={{
							fontSize: "27px",
						}}
					>
						Play Chess Against a Computer
					</div>
					<div
						className="h-[300px]"
					>
						<PlayerInfoCard id={bot.id} name={bot.name} inGame={false}/>
					</div>
					<div>
						<BotSelector botList={botList} onSelectBot={onSelectBot}/>
					</div>
				</ul>
			</div>
		</div>
	);
}

export default PrepareCard