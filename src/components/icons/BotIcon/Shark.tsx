import * as React from "react";
import {BotProps} from "@/helpers/types";

const Shark: React.FC<BotProps> = ({width, height}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		id="Capa_1"
		x={0}
		y={0}
		enableBackground= "new 0 0 120 120"
		viewBox="0 0 120 120"
		width={width}
		height={height}
	>
		<style>
			{
				".st0shark{fill:#552c7d}.st2shark{fill:#7447a8}.st3shark{fill:#c5c9e6}.st4shark{fill:#0a0a3a}.st5shark{fill:#2d1451}.st8{fill:#fff}"
			}
		</style>
		<path
			d="m42.5 62 5.4.4c.6 0 1.1.6 1.1 1.2l-2.5 18.3c-.3 3.6-3.4 6.3-7 6.1-3.6-.3-6.3-3.4-6.1-7l2.1-13c.3-3.6 3.4-6.3 7-6zM75.2 104.1h23c1.2 0 2.2-1 2.2-2.2V88.4c0-3.5-4.2-5.2-6.7-2.8l-18.5 18.5z"
			className="st0shark"
		/>
		<path
			d="M99.9 101.7 85.2 86.9 68 104.1h30.9c1.2 0 1.9-1.6 1-2.4z"
			style={{
				fill: "#643aa0",
			}}
		/>
		<path
			d="M76.6 24.6S91.3 32 98.9 43.9c.7 1.1.4 2.7-.6 3.5-4.3 3.4-14.9 11-14.9 11s-9.9-24.8-6.8-33.8z"
			className="st0shark"
		/>
		<path
			d="M67.5 104.1c11.6 0 20.9.2 20.9-11.4V50.4c0-19.1-15.5-34.5-34.6-34.5h-6.6c-4.1 0-7.5 3.4-7.5 7.5v6.4l27.8 74.3z"
			className="st2shark"
		/>
		<path
			d="M52.3 59.1V15.9H29.7c-9.2 0-13.5 11.4-6.6 17.5l29.2 25.7z"
			className="st2shark"
		/>
		<path
			d="M71.9 98.3V51.9c0-12.2-9.9-22.1-22.1-22.1H39.7l.1 52.3c0 12.2 9.9 22 22.1 22h4.3c3.2 0 5.7-2.6 5.7-5.8z"
			className="st3shark"
		/>
		<path d="m67.2 30.7-1.1 6.7L61 35z" className="st3shark" />
		<path
			d="m82.2 87.9 5.4-.4c.6 0 1.1-.6 1.1-1.2L86.2 68c-.3-3.6-3.4-6.3-7-6.1-3.6.3-6.3 3.4-6.1 7l2.1 12.9c.2 3.7 3.4 6.4 7 6.1z"
			className="st0shark"
		/>
		<path
			d="M53.7 27.4c.8 0 1.5-.7 1.5-1.5v-.6c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v.6c0 .8.7 1.5 1.5 1.5zM43.8 27.4c.8 0 1.5-.7 1.5-1.5v-.6c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v.6c0 .8.7 1.5 1.5 1.5z"
			className="st4shark"
		/>
		<path
			d="m74.5 48.8-2.4 2c-.2.2-.6.2-.8.1l-3.4-2.1c-.6-.4-.3-1.3.4-1.3l5.8.1c.6-.1.9.7.4 1.2zM74.9 53.3l-2.4 2c-.2.2-.6.2-.8.1l-3.4-2.1c-.6-.4-.3-1.3.4-1.3l5.8.1c.7-.1 1 .8.4 1.2zM75.4 57.8l-2.4 2c-.2.2-.6.2-.8.1l-3.4-2.1c-.6-.4-.3-1.3.4-1.3l5.8.1c.6 0 .9.8.4 1.2z"
			className="st5shark"
		/>
		<path
			d="M56.2 65.1H44.1c-2.3 0-4.1 1.8-4.1 4.1V83.6c.3 9.1 8 16.2 17.1 16.2h3.1c2.7 0 4.9-2.2 4.9-4.9V74.1c0-5-4-9-8.9-9z"
			style={{
				fill: "#d3d8ed",
			}}
		/>
		<path
			d="M52.2 47.2h-5.8c-2.2 0-4-1.8-4-4v-7.4h12.5c.8 0 1.5.7 1.5 1.5V43c0 2.3-1.9 4.2-4.2 4.2z"
			style={{
				fill: "#8f2f40",
			}}
		/>
		<path
			d="M50 39.9c.4 0 .7-.3.8-.6l.9-3.4h-3.5l.9 3.4c.2.3.5.6.9.6zM46.2 39.9c.4 0 .7-.3.8-.6l.9-3.4h-3.5l.9 3.4c.2.3.5.6.9.6z"
			className="st8"
		/>
		<path
			d="m43 50.9-3.3-21.1H24.5c-1.9 0-2.8 2.3-1.4 3.6L36 44.7l7 6.2z"
			className="st3shark"
		/>
	</svg>
)
export default Shark
