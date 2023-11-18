from datetime import datetime, date
from enum import Enum
from typing import Optional

from api.app.dto.base import CamelBaseModel

class UserRole(str, Enum):
    ADMIN = 'admin'
    USER = 'user'

class UserGender(str, Enum):
    MALE = "male"
    FEMALE = "female"

class SignUpResponse(CamelBaseModel):
    role: UserRole

class SignUpRequest(CamelBaseModel):
    user_name: str
    name: str
    gender: UserGender
    email: str
    password: str
    date_of_birth: date

class LoginRequest(CamelBaseModel):
    user_name: str
    password: str

class LoginResponse(CamelBaseModel):
    access_token: str

class ChangePasswordRequest(CamelBaseModel):
    old_password: str
    new_password: str

class GetProfileResponse(CamelBaseModel):
    user_id: int
    user_name: str
    name: str
    date_of_birth: date
    gender: UserGender
    email: str

class UpdateProfileRequest(CamelBaseModel):
    name: Optional[str]
    date_of_birth: Optional[date]
    gender: Optional[UserGender]
    email: Optional[str]

