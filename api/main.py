import typer

from api.app.cmd.push_puzzle_job import push_data_to_db
from api.app.helper.db import db_session

app = typer.Typer()


@app.command('init-puzzle')
def init_puzzle():
	with next(db_session()) as db:
		push_data_to_db(db)


if __name__ == "__main__":
	app()
