from sqlalchemy import Column, Boolean, String, Integer
from sqlalchemy.orm import relationship

from api.app.model.base import BareBaseModel

class Profile(BareBaseModel):
    __tablename__ = 'profile'

    user_id = Column(Integer, nullable=False)
    name = Column(String(50), nullable=False)
    dob = Column(String(50), nullable=False)
    gender = Column(String(10), nullable=False)
    rating = Column(Integer, nullable=False)
    country = Column(String(30), nullable=False)

    user = relationship('User')