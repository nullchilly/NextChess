from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session

from api.app.helper import auth
from api.app.helper.db import db_session
from api.app.model import User


async def get_current_user(request: Request, db: Session = Depends(db_session)):
    access_token = request.headers.get("accessToken")
    if access_token is None:
        raise HTTPException(status_code=403, detail="Forbidden")
    user_name = auth.decodeJWT(access_token)
    user = db.query(User).filter(User.user_name == user_name).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthenticated")
    return user