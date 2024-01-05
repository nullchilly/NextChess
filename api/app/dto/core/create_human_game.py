from typing import Optional
from datetime import datetime
from api.app.dto.base import CamelBaseModel
from enum import Enum

class CreateHumanGameResponse(CamelBaseModel):
  slug: str

class CreateHumanGameRequest(CamelBaseModel):
  strength: int
  variant: int
  time_mode: int
  slug: str
  number_player: int
  created_at: datetime
