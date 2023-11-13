from sqlalchemy import Column, Boolean, String, Integer

from api.app.model.base import BareBaseModel


class User(BareBaseModel):
    __tablename__ = 'user'

    is_admin = Column(Boolean, nullable=False)
    user_name = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    gender = Column(String(10), nullable=False)
    date_of_birth = Column(Integer, nullable=False)
    email = Column(String(255), nullable=False, index=True, unique=True)
    password = Column(String(1000), nullable=False)
    access_token = Column(String(1000), nullable=False)


