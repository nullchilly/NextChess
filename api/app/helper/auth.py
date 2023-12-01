import time
import jwt

from api.setting import setting


def signJWT(user_name: str) -> str:
    if setting.ENV == "test":
        return "secret"

    payload = {
        "user_name": user_name,
    }
    token = jwt.encode(payload, setting.JWT_SECRET, algorithm="HS256")

    return token

def decodeJWT(access_token: str) -> str:
    if setting.ENV == "test":
        if access_token == "secret":
            return "test_user_name"
        return "test"

    return jwt.decode(access_token, setting.JWT_SECRET, algorithms="HS256").get("user_name")