from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from api.app.dto.core.puzzle import MultiPuzzleResponse, PuzzleResponse, SubmitPuzzleRequest, SubmitPuzzleResponse
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.helper.db import db_session
from api.app.helper.middleware import get_current_user
from api.app.model import User
from api.app.service.puzzle import PuzzleService

puzzle_router = APIRouter()


@puzzle_router.get('/puzzle/rated', response_model=PuzzleResponse)
async def get_random_puzzle(db: Session = Depends(db_session)):
	return PuzzleService().get_random_puzzle(db)


@puzzle_router.get('/puzzle/rating/{rating}', response_model=PuzzleResponse)
async def get_random_puzzle_for_rating(db: Session = Depends(db_session), *, rating: int):
	return PuzzleService().get_random_puzzle_for_rating(db, rating)


# date format: yyyy-mm-dd
@puzzle_router.get('/puzzle/daily', response_model=PuzzleResponse)
async def get_random_puzzle_for_date(db: Session = Depends(db_session),
                                     *,
                                     date: Annotated[str | None, Query(pattern=r'^\d{4}-\d{2}-\d{2}$')]):
	return PuzzleService().get_random_puzzle_for_date(db, date)


@puzzle_router.get('/puzzle/id/{id}', response_model=PuzzleResponse)
async def get_puzzle(db: Session = Depends(db_session), *, id: int):
	return PuzzleService().get_puzzle(db, id)


@puzzle_router.get('/puzzle/list', response_model=MultiPuzzleResponse)
async def get_puzzle_list(db: Session = Depends(db_session)):
	return PuzzleService().get_random_ten_puzzle(db)


@puzzle_router.post('/puzzle/submit', response_model=SubmitPuzzleResponse)
async def submit_puzzle(db: Session = Depends(db_session), *, request: SubmitPuzzleRequest,
                        user: User = Depends(get_current_user)):
	return PuzzleService().submit_puzzle(db, user.id, request)