import {useEffect, useState} from "react";
import {Puzzle} from "@/type/type";

const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_DATA_URL || "/api";

export const usePuzzleData = (id: string) => {
  const [puzzle, setPuzzle] = useState<Puzzle>({
		fen: undefined,
		title: "No data found",
		player: "w",
		moves: [],
	});
	const [cache, setCache] = useState<any>({});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const url = `${NEXT_PUBLIC_SOCKET_URL}/puzzle/${id}`;
				let data = cache[url];
				if (!data) {
					const response = await  fetch(url);
					data = await response.json();
					cache[url] = data;
					setCache(cache);
				}
				
				
			} catch (err) {
			
			}
			setIsLoading(false);
		}
	}, [id])
}