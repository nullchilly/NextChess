from sqlalchemy import Column, Boolean, ForeignKey, String, Integer, Date
from sqlalchemy.orm import relationship

from api.app.model.base import BareBaseModel

class Profile(BareBaseModel):
    __tablename__ = 'profile'
    user_id = Column(Integer,  ForeignKey('user.id'), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    email = Column(String(255), nullable=False, index=True, unique=True)
    name = Column(String(50), nullable=False)
    gender = Column(String(10), nullable=False)
    rating = Column(Integer, nullable=False)
    country = Column(String(30), nullable=False)
    streak = Column(Integer, nullable=False, server_default='0')
    longest_streak = Column(Integer, nullable=False, server_default='0')
    last_streak = Column(Integer, nullable=False, server_default='0')

    user = relationship('User')