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
    role: UserRole

class SignUpRequest(CamelBaseModel):
    user_name: str
    name: str
    gender: UserGender
    email: str
    password: str
    date_of_birth: datetime

class LoginRequest(CamelBaseModel):
    user_name: str
    password: str

class LoginResponse(CamelBaseModel):
    access_token: str

class ChangePasswordRequest(CamelBaseModel):
    old_password: str
    new_password: str