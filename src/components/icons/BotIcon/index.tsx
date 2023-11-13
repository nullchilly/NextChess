import React from "react";
import {capitalizeFirstLetter} from "@/helpers/string";
import Cat from "@/components/icons/BotIcon/Cat";
import Shark from "@/components/icons/BotIcon/Shark";
import Monkey from "@/components/icons/BotIcon/Monkey";
import Elephant from "@/components/icons/BotIcon/Elephant";
import Owl from "@/components/icons/BotIcon/Owl";
import Penguin from "@/components/icons/BotIcon/Penguin";
import Null from "@/components/icons/BotIcon/Null";
import {BotProps} from "@/helpers/types";

const dynamicTag: Record<string, React.FC<BotProps>> = {
	Cat,
	Shark,
	Elephant,
	Penguin,
	Monkey,
	Owl,
}

const BotIcon = (props: BotProps) => {
	const name = capitalizeFirstLetter(props.name);
	const Bot = dynamicTag[name];
	return Bot ? <Bot /> : <Null />;
	// return <Owl />;
};

export default BotIcon;