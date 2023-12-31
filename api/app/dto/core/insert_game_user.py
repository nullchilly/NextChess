from api.app.dto.base import CamelBaseModel
from typing import List

class InsertGameUserRequest(CamelBaseModel):
  game_id: int
  user_id: int
  win: int
  rating_change: int