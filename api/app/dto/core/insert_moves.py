from api.app.dto.base import CamelBaseModel
from typing import List

class InsertMoveRequest(CamelBaseModel):
  game_id: int
  user_id: int
  move_details: List[str]
