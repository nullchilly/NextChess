from datetime import datetime, date
from enum import Enum
from typing import Optional, List

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

class RatingInGetProfileResponse(CamelBaseModel):
    rating: int
    variant_id: int

class GetProfileResponse(CamelBaseModel):
    user_id: int
    name: str
    date_of_birth: Optional[date]
    gender: UserGender
    email: str
    ratings: List[RatingInGetProfileResponse]
    is_admin: bool

class UpdateProfileRequest(CamelBaseModel):
    name: Optional[str]
    date_of_birth: Optional[date]
    gender: Optional[UserGender]
    email: Optional[str]

class GameInGetUserGameHistoryResponse(CamelBaseModel):
    game_id: int
    variant_id: int
    time_mode: int
    result: int
    move: List[str]
    rating_change: int
    slug: str


class GetUserGameHistoryResponse(CamelBaseModel):
    games: List[GameInGetUserGameHistoryResponse]

class PuzzleInGetUserPuzzleHistoryResponse(CamelBaseModel):
    puzzle_id: int
    puzzle_name: str
    date_solved: Optional[datetime]
    rating_change: int
    is_solved: Optional[bool]

class GetUserPuzzleHistoryResponse(CamelBaseModel):
    puzzles: List[PuzzleInGetUserPuzzleHistoryResponse]


class GetUserGameResultResponse(CamelBaseModel):
    result: List[int]

class UserInGetListUserResponse(CamelBaseModel):
    user_id: int
    name: str
    date_of_birth: Optional[date]
    gender: Optional[UserGender]
    email: str

class GetListUserResponse(CamelBaseModel):
    users: List[UserInGetListUserResponse]

class GameInGetListGameResponse(CamelBaseModel):
    game_id: int
    variant_id: int
    time_mode: int
    users_id: List[int]
    created_at: datetime
    moves: Optional[List[str]]
    slug: str
    result: Optional[int]

class GetListGameResponse(CamelBaseModel):
    games: List[GameInGetListGameResponse]

