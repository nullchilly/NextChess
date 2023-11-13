import React from "react";
import {BotProps} from "@/type/type";
import BotIcon from "@/components/icons/BotIcon";

type BotSelectorProps = {
	botList: BotProps[],
	onSelectBot: (bot: BotProps) => void
}

const BotSelector: React.FC<BotSelectorProps> = ({botList, onSelectBot}) => {
	return (
		<div>
			<div
				className="font-bold text-center pt-4"
				style={{
					fontSize: "20px",
				}}
			>
				Ez Bot
			</div>
			<div className="w-auto flex row-auto pl-4 flex-wrap">
				{botList.map((bot) => (
					<div
						key={bot.id}
						className="p-2"
						onClick={() => {
							onSelectBot(bot)
						}}
					>
						<BotCard id={bot.id} name={bot.name}/>
					</div>
				))}
			</div>
		</div>
	)
}

const BotCard: React.FC<BotProps> = ({id, name}) => {
	return (
		<div className="hover:opacity-60">
			<div className="w-[60px] h-[60px] border-2">
				<BotIcon name={name} />
			</div>
		</div>
	)
}

export default BotSelector