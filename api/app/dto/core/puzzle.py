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

	def to_json(self):
		return {
			'id': self.id,
			'name': self.name,
			'rating': self.rating,
			'moves': self.moves,
			'fen': self.fen,
			'created_at': self.created_at
		}


class MultiPuzzleResponse(CamelBaseModel):
	puzzles: list[PuzzleResponse]

	def to_json(self):
		return {
			'puzzles': [puzzle.to_json() for puzzle in self.puzzles]
		}


class GetPuzzleGameResponse(CamelBaseModel):
	id: int
