from fastapi import APIRouter
from . import user, create_bot_game, create_human_game, puzzle, admin

router = APIRouter()
router.include_router(user.user_router, prefix="/api")
router.include_router(create_bot_game.auth_router, prefix="/api")
router.include_router(create_human_game.auth_router, prefix="/api")
router.include_router(puzzle.puzzle_router, prefix="/api")
router.include_router(admin.admin_router, prefix="/api/admin")
