from fastapi import FastAPI

from api.app import endpoint
from api.setting import setting


def create_app() -> FastAPI:
    app = FastAPI(
        title=setting.PROJECT_TITLE, docs_url='/core/docs',
    )
    app.include_router(endpoint.router)
    return app
