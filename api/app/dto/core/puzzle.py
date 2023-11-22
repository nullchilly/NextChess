from api.app.dto.base import CamelBaseModel


class SubmitPuzzleRequest(CamelBaseModel):
	token: str
	id: int
	isSolvedWithHint: bool
	moves: str
	totalTime: int


class UserRatingStatus(CamelBaseModel):
	current: int
	new: int
	change: int


class RatingInfo(CamelBaseModel):
	user: UserRatingStatus
	score: int
	currentStreak: int
	highestStreak: int
	isNewHighestStreak: bool
	lastPositiveStreak: int


class SubmitPuzzleResponse(CamelBaseModel):
	result: str
	newRatingInfo: RatingInfo
