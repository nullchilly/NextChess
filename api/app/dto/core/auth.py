from datetime import datetime
from enum import Enum

from api.app.dto.base import CamelBaseModel

class UserRole(str, Enum):
    ADMIN = 'admin'
    USER = 'user'

class UserGender(str, Enum):
    MAN = "man"
    WOMAN = "woman"

class SignUpResponse(CamelBaseModel):
    access_token: str = ''
    role: UserRole

class SignUpRequest(CamelBaseModel):
    user_name: str
    name: str
    gender: UserGender
    email: str
    password: str
    date_of_birth: datetime
