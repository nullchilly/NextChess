from sqlalchemy import Column, DateTime, Integer, String
from api.app.model.base import BareBaseModel

class ChessPiece(BareBaseModel):
    __tablename__ = 'chess_piece'

    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)