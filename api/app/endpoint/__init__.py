from fastapi import APIRouter
from . import auth

router = APIRouter()
router.include_router(auth.auth_router, prefix="/auth")
