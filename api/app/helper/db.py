import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from api.setting import setting

_logger = logging.getLogger(__name__)

db_engine = create_engine(setting.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
LocalSession = sessionmaker(autocommit=False, autoflush=True, bind=db_engine)

def open_db_session() -> Session:
    return LocalSession()

def db_session():
    session = LocalSession()
    try:
        yield session
    finally:
        session.close()
