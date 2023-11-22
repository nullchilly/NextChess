from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.app.model.puzzle import Puzzle


class PuzzleService:
	@classmethod
	def get_puzzle(cls, db: Session, id: int) -> Puzzle:
		puzzle = db.query(Puzzle).filter(Puzzle.id == id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return puzzle

	@classmethod
	def get_random_puzzle(cls, db: Session) -> Puzzle:
		puzzle = db.query(Puzzle).order_by(Puzzle.id).first()
		if puzzle is None:
			raise HTTPException(status_code=404, detail="Puzzle not found")
		return puzzle