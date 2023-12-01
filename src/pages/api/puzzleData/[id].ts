import {NextApiRequest, NextApiResponse} from "next";
import * as fs from "fs";

type Data = {
	name: string,
}

const handler = (request: NextApiRequest, response: NextApiResponse) => {
	const path = '/mook/puzzleData.json'
	const fileData = fs.readFileSync(path, "utf8")
	
	response.status(200).json(JSON.parse(fileData))
}

export default handler;