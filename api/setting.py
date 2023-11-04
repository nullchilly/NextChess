import os

from dotenv import load_dotenv

load_dotenv(verbose=True)


class setting:
    ROOT_DIR = os.path.abspath(os.path.join(
        os.path.dirname(__file__)
    ))
    PROJECT_TITLE: str = "Stock Chess"
