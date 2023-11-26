import typer
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api.app.cmd.push_puzzle_job import push_data_to_db
from api.app.helper.db import db_session
from api.setting import setting

engine = create_engine(setting.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
app = typer.Typer()


@app.command('init-puzzle')
def init_puzzle():
	with next(db_session()) as db:
		push_data_to_db(db)

if __name__ == "__main__":
	app()