import { useEffect, useState } from "react";
import { Puzzle } from "@/types";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const NEXT_PUBLIC_BACKEND_URL = "/api";


export const usePuzzleData = (id: string) => {
	const [puzzle, setPuzzle] = useState<Puzzle>({
		fen: undefined,
		title: "No data found",
		player: "w",
		moves: [],
		id: '',
		rate: '?',
	});
	const [error, setError] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	
	const fetchData = async () => {
		setIsLoading(true);
		try {
			const url = `${NEXT_PUBLIC_BACKEND_URL}/api/puzzle/rated`;
			let data;
			if (!data) {
				const response = await fetch(url);
				data = await response.json();
				// cache[url] = data;
				// setCache(cache);
			}
			if (data) {
				const player = data.fen.includes(" b ")
					? "Black"
					: "White";
				const moves = data.moves
					.replace(/\d+\./gi, "")
					.replace("..", "")
					.split(" ")
					.filter(
						(x: string) => x && !["*", "1-0", "0-1", "1/2-1/2"].includes(x)
					);
				setPuzzle({
					id: data.id,
					moves,
					player,
					title: data.name || "Random Match",
					fen: data?.fen || "",
					results: data.moves,
					date: data.createdAt,
					rate: data.rating,
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
	
	useEffect(() => {
		if (id) {
			fetchData();
		}
	}, [id])

	const onSkip = () => {
		fetchData();
	}
	
	return { data: puzzle, error, isLoading, onSkip }
}

export default usePuzzleData;