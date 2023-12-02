from typing import Any

from api.app.dto.base import CamelBaseModel


class SubmitPuzzleRequest(CamelBaseModel):
	tactics_problem_id: int
	seconds: float
	is_passed: bool
	is_rated: bool


class SubmitPuzzleResponse(CamelBaseModel):
	attempt_id: int
	new_rating: int
	rating_change: int


class PuzzleResponse(CamelBaseModel):
	id: int
	name: str
	rating: int
	moves: str
	fen: str
	created_at: str


class MultiPuzzleResponse(CamelBaseModel):
	puzzles: list[PuzzleResponse]
