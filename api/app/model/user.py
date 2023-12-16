from sqlalchemy import Column, Boolean, String, Integer, Date

from api.app.model.base import BareBaseModel

class User(BareBaseModel):
    __tablename__ = 'user'

    is_admin = Column(Boolean, nullable=False)
    user_name = Column(String(50), nullable=False)
    password = Column(String(1000), nullable=False)
    access_token = Column(String(1000), nullable=True)



