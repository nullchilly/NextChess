export type BotProps = {
	id: string,
	name: string,
}

export type Puzzle = {
	fen?: string,
	title: string,
	player: string,
	moves: string[],
	results?: string,
	date?: string,
	id: string,
}

export type ShortMove = {
	from: string;
	to: string;
	promotion?: string;
}

export interface CustomSquares {
	// NOTE: Uncomment these when used.
	// options: { [square: string]: { background: string; borderRadius?: string } };
	// lastMove: { [square: string]: { background: string } };
	// rightClicked: { [square: string]: { backgroundColor: string } | undefined };
	check: { [square: string]: { background: string; borderRadius?: string } };
}
