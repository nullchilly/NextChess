from sqlalchemy import Column, DateTime, Integer, Boolean, ForeignKey, SmallInteger, String
from sqlalchemy.orm import relationship
from api.app.model.base import BareBaseModel

class Game(BareBaseModel):
    __tablename__ = 'game'

    variant_id = Column(Integer, ForeignKey('variants.id'), nullable=False)
    time_mode = Column(SmallInteger)
    status = Column(Boolean, nullable=False)
    result = Column(Integer, nullable=False)
    slug = Column(String(8), nullable=False)
    number_player = Column(Integer, default=0)

    variant = relationship('Variants')  # Create a relationship with the Variants table
