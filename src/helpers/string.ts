export const capitalizeFirstLetter = (str: string | undefined) => {
	if (str === undefined) {
		return "";
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getChess = (color: string, name: string) => {
	if (color === 'b') {
		color = 'Black'
	} else {
		color = 'White'
	}

	if (name === 'k') {
		name = 'King'
	} else if (name === 'q') {
		name = 'Queen'
	} else if (name === 'r') {
		name = 'Rook'
	} else if (name === 'n') {
		name = 'Knight'
	} else if (name === 'b') {
		name = 'Bishop'
	} else if (name === 'p') {
		name = 'Pawn'
	}

	return color + name;
}