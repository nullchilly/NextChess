import * as React from "react"
import {ChessProps} from "@/helpers/types";

const WhiteRook: React.FC<ChessProps> = (props) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={45} height={45} {...props}>
		<g
			style={{
				opacity: 1,
				fill: "#fff",
				fillOpacity: 1,
				fillRule: "evenodd",
				stroke: "#000",
				strokeWidth: 1.5,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeMiterlimit: 4,
				strokeDasharray: "none",
				strokeOpacity: 1,
			}}
		>
			<path
				d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"
				style={{
					strokeLinecap: "butt",
				}}
				transform="translate(0 .3)"
			/>
			<path d="m34 14.3-3 3H14l-3-3" />
			<path
				d="M31 17v12.5H14V17"
				style={{
					strokeLinecap: "butt",
					strokeLinejoin: "miter",
				}}
				transform="translate(0 .3)"
			/>
			<path d="m31 29.8 1.5 2.5h-20l1.5-2.5" />
			<path
				d="M11 14h23"
				style={{
					fill: "none",
					stroke: "#000",
					strokeLinejoin: "miter",
				}}
				transform="translate(0 .3)"
			/>
		</g>
	</svg>
)
export default WhiteRook
