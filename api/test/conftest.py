import os
from pathlib import Path

import pytest
import sqlalchemy as sa
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api.index import app
from api.app.helper.db import db_session
from sqlalchemy_utils import database_exists, drop_database, create_database

from api.app.model.base import Base
from api.app.model import User
from fastapi.testclient import TestClient


load_dotenv(dotenv_path=os.path.join(Path(os.getcwd()).resolve().parents[1], '.env'), verbose=True)
SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI_TEST')
engine = create_engine(
    SQLALCHEMY_DATABASE_URI
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True, scope='function')
def session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Begin a nested transaction (using SAVEPOINT).
    nested = connection.begin_nested()
    # If the application code calls session.commit, it will end the nested
    # transaction. Need to start a new one when that happens.
    @sa.event.listens_for(session, "after_transaction_end")
    def end_savepoint(session, transaction):
        nonlocal nested
        if not nested.is_active:
            nested = connection.begin_nested()

    yield session

    # Rollback the overall transaction, restoring the state before the test ran.
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(autouse=True, scope='function')
def client(session):
    def override_get_db():
        yield session

    app.dependency_overrides[db_session] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[db_session]

@pytest.fixture(scope="session", autouse=True)
def create_test_database():
    if database_exists(SQLALCHEMY_DATABASE_URI):
        drop_database(SQLALCHEMY_DATABASE_URI)
    create_database(SQLALCHEMY_DATABASE_URI)  # Create the test database.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield  # Run the tests.
    drop_database(SQLALCHEMY_DATABASE_URI)  # Drop the test database

