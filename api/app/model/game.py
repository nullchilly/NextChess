from sqlalchemy import Column, DateTime, Integer, Boolean, ForeignKey, String
from sqlalchemy.orm import relationship
from api.app.model.base import BareBaseModel

class Game(BareBaseModel):
    __tablename__ = 'game'

    variant_id = Column(Integer, ForeignKey('variants.id'), nullable=False)
    created_at = Column(DateTime)
    time_mode = Column(Integer)
    status = Column(Boolean, nullable=False)
    result = Column(Integer, nullable=False)
    slug = Column(String(8), nullable=False)

    variant = relationship('Variants')  # Create a relationship with the Variants table
