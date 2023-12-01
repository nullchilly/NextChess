import * as React from "react";
import {BotProps} from "@/helpers/types";

const Null: React.FC<BotProps> = ({width, height}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 16 16"
		width={width}
		height={height}
	>
		<path
			fill="gray"
			d="M8 2a2.84 2.84 0 0 0-1.12.221 2.611 2.611 0 0 0-.906.615v.003l-.001.002c-.248.269-.44.592-.574.96a3.413 3.413 0 0 0-.203 1.2c0 .435.065.841.203 1.209a2.9 2.9 0 0 0 .574.95l.001.002c.254.267.558.477.901.624v.003c.346.141.723.21 1.12.21.395 0 .77-.069 1.117-.21v-.002c.343-.147.644-.357.892-.625.255-.268.45-.59.586-.952A3.43 3.43 0 0 0 10.794 5h.01c0-.43-.065-.831-.203-1.198a2.771 2.771 0 0 0-.585-.963 2.5 2.5 0 0 0-.897-.618A2.835 2.835 0 0 0 7.999 2zm.024 8.002c-2.317 0-3.561.213-4.486.91-.462.35-.767.825-.939 1.378-.172.553-.226.975-.228 1.71L8 14.002h5.629c-.001-.736-.052-1.159-.225-1.712-.172-.553-.477-1.027-.94-1.376-.923-.697-2.124-.912-4.44-.912z"
			color="#000"
			fontFamily="Ubuntu"
			fontWeight={400}
			letterSpacing={0}
			overflow="visible"
			style={{
				lineHeight: "125%",
				fontVariantLigatures: "normal",
				fontVariantPosition: "normal",
				fontVariantCaps: "normal",
				fontVariantNumeric: "normal",
				fontVariantAlternates: "normal",
				fontFeatureSettings: "normal",
				textIndent: 0,
				textAlign: "start",
				textDecorationLine: "none",
				textDecorationStyle: "solid",
				textDecorationColor: "#000",
				textTransform: "none",
				textOrientation: "mixed",
				isolation: "auto",
				mixBlendMode: "normal",
			}}
			wordSpacing={0}
		/>
	</svg>
)
export default Null
