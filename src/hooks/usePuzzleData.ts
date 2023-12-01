import { useEffect, useState } from "react";
import { Puzzle } from "@/types";

// const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
const NEXT_PUBLIC_BACKEND_URL = "/api";


export const usePuzzleData = (id: string) => {
	const [puzzle, setPuzzle] = useState<Puzzle>({
		fen: undefined,
		title: "No data found",
		player: "w",
		moves: [],
		id: '',
	});
	const [cache, setCache] = useState<any>({});
	const [error, setError] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const url = `${NEXT_PUBLIC_BACKEND_URL}/puzzle`;
				let data = cache[url];
				if (!data) {
					const response = await fetch(url);
					data = await response.json();
					cache[url] = data;
					setCache(cache);
				}
				if (data) {
					const player = data.parsed.fen.includes(" b ")
						? "Black"
						: "White";
					const moves = data.parsed.moves
						.replace(/\d+\./gi, "")
						.replace("..", "")
						.split(" ")
						.filter(
							(x: string) => x && !["*", "1-0", "0-1", "1/2-1/2"].includes(x)
						);
					setPuzzle({
						id: id,
						moves,
						player,
						title: data.title || "Random Match",
						fen: data.parsed?.fen || "",
						results: data.parsed.moves,
						date: data.date,
					})
				} else {
					setPuzzle({
						...puzzle,
					})
				}
			} catch (err) {
				console.log(err);
				setError(err);
				setIsLoading(false);
			} finally {
				setIsLoading(false);
			}
		}
		if (id) {
			fetchData();
		}
	}, [id])

	return { data: puzzle, error, isLoading }
}

export default usePuzzleData;