import os


class setting:
    ROOT_DIR = os.path.abspath(os.path.join(
        os.path.dirname(__file__)
    ))
    PROJECT_TITLE = os.getenv("PROJECT_TITLE")
