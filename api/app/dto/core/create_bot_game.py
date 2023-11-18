from typing import Optional
from datetime import datetime
from api.app.dto.base import CamelBaseModel
from enum import Enum

class CreateBotGameResponse(CamelBaseModel):
  slug: str

class CreateBotGameRequest(CamelBaseModel):
  strength: int
  variant: int
  time_mode: int
  slug: str
  created_at: datetime
