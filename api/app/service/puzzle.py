from random import randint
from typing import List, Type

from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.app.dto.core.puzzle import SubmitPuzzleRequest, SubmitPuzzleResponse
from api.app.model.puzzle import Puzzle


class PuzzleService:
	@classmethod
	def get_puzzle(cls, db: Session, id: int) -> Type[Puzzle]:
		puzzle = db.query(Puzzle).filter(Puzzle.id == id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return puzzle

	@classmethod
	def get_random_puzzle(cls, db: Session) -> Type[Puzzle]:
		puzzle = db.query(Puzzle).order_by(Puzzle.id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return puzzle

	@classmethod
	def get_random_ten_puzzle(cls, db: Session) -> List[Type[Puzzle]]:
		#random 10 puzzle
		total = db.query(Puzzle).count()
		#random 10 id
		ids = set()
		while len(ids) < 10:
			ids.add(randint(1, total))
		puzzle = db.query(Puzzle).filter(Puzzle.id.in_(ids)).all()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return puzzle
	@classmethod
	def submit_puzzle(cls, db: Session, req: SubmitPuzzleRequest) -> Type[SubmitPuzzleResponse]:
		pass
