import React from "react";
import {getSvgSrc} from "@/helpers/images";
import {BotProps} from "@/type/type";

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
			<img className="w-[60px] h-[60px] border-2" src={getSvgSrc(name)} alt={"character"}/>
		</div>
	)
}

export default BotSelector