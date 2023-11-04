from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from .app import create_app
from fastapi.staticfiles import StaticFiles

app = create_app()

@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success", "message": "Integrate FastAPI Framework with Next.js"}

app.mount("/", StaticFiles(directory="out", html=True), name="static")