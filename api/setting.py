import os

from dotenv import load_dotenv

load_dotenv(verbose=True)


class setting:
    ROOT_DIR = os.path.abspath(os.path.join(
        os.path.dirname(__file__)
    ))
    ENV: str = os.getenv("ENV")
    PROJECT_TITLE: str = "Stock Chess"
    SQLALCHEMY_DATABASE_URI: str = os.getenv("SQLALCHEMY_DATABASE_URI")

