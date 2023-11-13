from fastapi import APIRouter
from . import auth, create_bot_game

router = APIRouter()
router.include_router(auth.auth_router, prefix="/api")
router.include_router(create_bot_game.auth_router, prefix="/api")
