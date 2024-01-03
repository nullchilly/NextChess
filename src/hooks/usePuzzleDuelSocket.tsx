import {io, Socket} from "socket.io-client";
import {useCallback, useContext, useEffect, useState} from "react";
import {Puzzle} from "@/types";
import {StatePuzzleDuel} from "@/helpers/types";
import {delay} from "@/helpers/chess";
import {UserContext} from "@/context/UserContext";

enum ConnectionStatus {
	Open = "open",
	Connecting = "connecting",
	Disconnected = "disconnected",
}

const usePuzzleDuelSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [connectionStatus, setConnectionStatus] =
		useState<ConnectionStatus>(ConnectionStatus.Disconnected)
	const [dataPuzzles, setDataPuzzles] = useState<Puzzle[]>([]);
	const [opposite, setOpposite] = useState<string>()
	const [start, setStart] = useState(false)
	const [resultOpposite, setResultOpposite] = useState(false)
	const [getResult, setGetResult] = useState(false)
	const [winner, setWinner] = useState<number>();
	const [isEndGame, setIsEndGame] = useState(false);
	const [gameId, setGameId] = useState<number>()
	const [state, setState] = useState<StatePuzzleDuel>(StatePuzzleDuel.wait)
	const [puzzleData, setPuzzleData] = useState<Puzzle>();
	const [current, setCurrent] = useState(0);
	const [currentO, setCurrentO] = useState(0);
	const [userId, setUserId] = useState(0);
	const [resultL, setResultL] = useState<number[]>(Array(10).fill(0))
	const [resultR, setResultR] = useState<number[]>(Array(10).fill(0))
	
	
	const fetchGameId = async () => {
		try {
			fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}	` + '/api/puzzle/game', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			}).then((response) => {
				if (response.ok) {
					response.json().then((data) => {
						setGameId(data.id);
					});
				}
			});
		} catch (err) {
			console.error('An unexpected error occurred:', err);
		}
	}
	
	const onPlay = async () => {
		joinGame();
		setState(StatePuzzleDuel.finding);
	}
	
	const disconnectSocket = useCallback(() => {
		socket?.close();
		setSocket(null);
		setConnectionStatus(ConnectionStatus.Disconnected);
	}, [socket, setConnectionStatus])
	
	const connectSocket = () => {
		const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
			autoConnect: false,
			reconnection: true,
		});
		console.log(socket)
		fetchGameId();
		setSocket(socket);
	};
	
	useEffect(() => {
		if (userId) {
			connectSocket();
		}
	}, [userId]);
	
	useEffect(() => {
		if (socket) {
			socket.connect();
			socket.on("connect", () => {
				console.log("Connected:", socket.id);
			})
			
			socket.on("disconnect", () => {
				disconnectSocket();
			});
			socket.on("puzzle-duel", async (msg) => {
				console.log("Response", msg);
				try {
					const response = JSON.parse(msg);
					if (response["status"] === "ready") {
						const listData = response.message.puzzle.puzzles;
						let puzzles : Puzzle[] = [];
						listData.forEach((data : any) => {
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
								puzzles.push({
									id: data.id,
									moves,
									player,
									title: data.name || "Random Match",
									fen: data?.fen || "",
									results: data.moves,
									date: data.createdAt,
									rate: data.rating,
								})
							}
						})
						setDataPuzzles(puzzles)
						setPuzzleData(puzzles[0]);
					} else if (response["status"] === "join_noti") {
						if (response.message.userId !== userId) {
							setState(StatePuzzleDuel.pending);
							setStart(true);
							const profile = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/${response.message.userId}`, {
								method: 'GET',
								headers: {
									'Content-Type': 'application/json',
								},
							});
							const json = await profile.json();
							setOpposite(json.data.name)
						}
					} else if (response["status"] === "submit_noti") {
						if (response.message.userId !== userId) {
							setGetResult(true);
							if (response.message.solved) {
								const newList = resultR;
								newList[current] = 1
								setResultR(newList);
							} else {
								const newList = resultR;
								newList[current] = -1
								setResultR(newList);
							}
							setCurrentO(currentO + 1);
						}
					} else if (response["status"] === "solved") {
					
					} else if (response["status"] === "end") {
						setWinner(response.message.userId);
						setStart(false);
					} else if (response["status"] === "error") {
					
					}
				} catch (error) {
					console.error("[!!!] Play chess socket error: ", error);
				}
			});
		}
	}, [disconnectSocket, setConnectionStatus, socket]);
	
	const submitPuzzle = (id: string, solved: boolean) => {
		const raw = JSON.stringify({
			"status": "submit",
			"message": {
				"userId": userId,
				"gameId": gameId,
				"puzzleId": id,
				"solved": solved,
			}
		});
		console.log(raw)
		if (solved) {
			const newList = resultL;
			newList[current] = 1
			setResultL(newList);
		} else {
			const newList = resultL;
			newList[current] = -1
			setResultL(newList);
		}
		if (dataPuzzles.length) {
			setPuzzleData(dataPuzzles.at(current + 1));
			setCurrent(current + 1)
		} else {
			endGamePuzzle();
		}
		socket?.emit("puzzle-duel", raw);
	}
	
	const endGamePuzzle = () => {
		const raw = JSON.stringify({
			"status": "end_game",
			"message": {
				"gameId": gameId
			}
		});
		socket?.emit("puzzle-duel", raw);
		setState(StatePuzzleDuel.wait);
	}
	
	const joinGame = () => {
		const raw = JSON.stringify({
			"status": "start",
			"message": {
				"gameId": gameId,
				"userId": userId
			}
		});
		if (gameId) {
			console.log(raw)
			console.log(socket)
			socket?.emit("puzzle-duel", raw);
		}
	}
	
	return {
		start,
		state,
		puzzleData,
		opposite,
		resultOpposite,
		getResult,
		onPlay,
		setUserId,
		dataPuzzles,
		socket,
		current,
		isEndGame,
		winner,
		resultL,
		resultR,
		submitPuzzle,
		endGamePuzzle
	}
}

export default usePuzzleDuelSocket;