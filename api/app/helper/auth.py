import time
import jwt

from api.setting import setting


def signJWT(user_name: str) -> str:
    payload = {
        "user_name": user_name,
    }
    token = jwt.encode(payload, setting.JWT_SECRET, algorithm="HS256")

    return token

def decodeJWT(access_token: str) -> str:
    return jwt.decode(access_token, setting.JWT_SECRET, algorithms="HS256").get("user_name")