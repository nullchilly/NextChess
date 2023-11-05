from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.app import create_app
from fastapi.staticfiles import StaticFiles

app = create_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success", "message": "Integrate FastAPI Framework with Next.js"}

app.mount("/", StaticFiles(directory="out", html=True), name="static")