from fastapi import APIRouter
from . import auth, create_bot_game, puzzle

router = APIRouter()
router.include_router(auth.auth_router, prefix="/api")
router.include_router(create_bot_game.auth_router, prefix="/api")
router.include_router(puzzle.puzzle_router, prefix="/api")
