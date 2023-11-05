from sqlalchemy import Column, DateTime, Integer, String, Boolean
from api.app.model.base import BareBaseModel

class Variants(BareBaseModel):
    __tablename__ = 'variants'

    variant_name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)