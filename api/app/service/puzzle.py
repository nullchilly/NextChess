from random import randint
from typing import List, Type

from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.app.dto.core.puzzle import *
from api.app.model import Profile, User
from api.app.model.puzzle import Puzzle
from api.app.model.puzzle_user import PuzzleUser


class PuzzleService:
	@classmethod
	def to_puzzle_response(cls, puzzle: Puzzle) -> PuzzleResponse:
		puzzle_response = PuzzleResponse(
			id=puzzle.id,
			fen=puzzle.fen,
			position=puzzle.position,
			rating=puzzle.rating,
			moves=puzzle.moves,
			name=puzzle.name,
			created_at=str(puzzle.created_at)
		)
		return puzzle_response



	@classmethod
	def get_puzzle(cls, db: Session, id: int) -> PuzzleResponse:
		puzzle = db.query(Puzzle).filter(Puzzle.id == id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return cls.to_puzzle_response(puzzle)





	@classmethod
	def get_random_puzzle(cls, db: Session) -> PuzzleResponse:
		total = db.query(Puzzle).count()
		id = randint(1, total)
		puzzle = db.query(Puzzle).filter(Puzzle.id == id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return cls.to_puzzle_response(puzzle)

	@classmethod
	def get_random_puzzle_for_rating(cls, db: Session, rating: int) -> PuzzleResponse:
		puzzle = db.query(Puzzle).filter(Puzzle.rating == rating).order_by(Puzzle.id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return cls.to_puzzle_response(puzzle)

	@classmethod
	def get_random_puzzle_for_date(cls, db: Session, date: str) -> PuzzleResponse:
		puzzle = db.query(Puzzle).filter(Puzzle.created_at == date).order_by(Puzzle.id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return cls.to_puzzle_response(puzzle)

	@classmethod
	def get_random_ten_puzzle(cls, db: Session) -> MultiPuzzleResponse:
		# random 10 puzzle
		total = db.query(Puzzle).count()
		# random 10 id
		ids = set()
		while len(ids) < 10:
			ids.add(randint(1, total))
		puzzle = db.query(Puzzle).filter(Puzzle.id.in_(ids)).all()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		puzzle_response = []
		for i in range(len(puzzle)):
			puzzle_response.append(cls.to_puzzle_response(puzzle[i]))
		return MultiPuzzleResponse(puzzles=puzzle_response)

	@classmethod
	def submit_puzzle(cls, db: Session, user_id: int, req: SubmitPuzzleRequest) -> SubmitPuzzleResponse:
		puzzle = db.query(Puzzle).filter(Puzzle.id == req.tactics_problem_id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")

		profile = db.query(Profile).filter(Profile.user_id == user_id).first()
		if profile is None:
			raise HTTPException(status_code=404, detail="User not found")
		if req.is_passed:
			profile.rating += puzzle.rating
			# reupdate rating user to db
			db.query(Profile).filter(Profile.user_id == user_id).update({"rating": profile.rating})
			# add new puzzle user to puzzle_user table
		puzzle_user = db.query(PuzzleUser).filter(PuzzleUser.puzzle_id == req.tactics_problem_id,
		                                          PuzzleUser.user_id == profile.user_id).first()
		if puzzle_user is None:
			puzzle_user = PuzzleUser(
				user_id=profile.user_id,
				puzzle_id=puzzle.id,
				state=1,
				gained_rating=True,
			)
			db.add(puzzle_user)
			puzzle_user = db.query(PuzzleUser).filter(PuzzleUser.puzzle_id == req.tactics_problem_id,
			                                          PuzzleUser.user_id == profile.user_id).first()
			db.commit()

		return SubmitPuzzleResponse(
			attempt_id=puzzle_user.id,
			new_rating=profile.rating,
			rating_change=puzzle.rating
		)

		pass
