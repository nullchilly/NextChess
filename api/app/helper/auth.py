import time
import jwt

from api.setting import setting


def signJWT(user_name: str) -> str:
    payload = {
        "user_id": user_name,
        "expires": time.time() + 600
    }
    token = jwt.encode(payload, setting.JWT_SECRET, algorithm="HS256")

    return token