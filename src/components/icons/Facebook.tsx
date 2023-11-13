import * as React from "react"

type FacebookProps = {
	width? :string,
	height? :string,
}

const Facebook = (props: FacebookProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} {...props}>
		<path d="M24 4C12.972 4 4 12.972 4 24c0 10.006 7.394 18.295 17 19.75V29h-4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h4v-3.632C21 15.617 23.427 13 27.834 13c1.786 0 3.195.124 3.254.129a1 1 0 0 1 .912.996V17.5a1 1 0 0 1-1 1h-2c-1.103 0-2 .897-2 2V24h4a1 1 0 0 1 .993 1.124l-.375 3c-.063.5-.489.876-.993.876H27v14.75c9.606-1.455 17-9.744 17-19.75 0-11.028-8.972-20-20-20z" />
	</svg>
)
export default Facebook
