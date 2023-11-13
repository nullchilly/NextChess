export const capitalizeFirstLetter = (str: string | undefined) => {
	if (str === undefined) {
		return "";
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
};