from fastapi import FastAPI
from api.setting import setting


def create_app() -> FastAPI:
    app = FastAPI(
        title=setting.PROJECT_TITLE, docs_url='/core/docs',
    )

    return app
