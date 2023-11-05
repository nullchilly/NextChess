from sqlalchemy import Column, Boolean, String, Integer

from api.app.model.base import BareBaseModel


class User(BareBaseModel):
    __tablename__ = 'user'

    is_admin = Column(Boolean, default=False)
    name = Column(String(255), nullable=False)
    password = Column(String(1000), nullable=False)
    email = Column(String(255), nullable=False)

