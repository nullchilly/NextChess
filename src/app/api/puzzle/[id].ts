import {NextApiRequest, NextApiResponse} from "next";

type Data = {
	name: string,
}

const handler = (request: NextApiRequest, response: NextApiResponse) => {
	const path = process.env.cwd().replace("app")
}

export default handler;