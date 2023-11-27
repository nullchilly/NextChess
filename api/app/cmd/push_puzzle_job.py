import json
from typing import List

import typer
from sqlalchemy.orm import Session
from api.app.model.puzzle import Puzzle

data_path_puzzle = "public/all.json"


def read_json_data_puzzle(path: str):
	with open(path, 'r') as f:
		data = json.load(f)
	return data

def create_puzzle_data(data) -> Puzzle:
	new_puzzle: Puzzle = Puzzle(
		name=data.get('title', None),
		position=data.get('pgn', None),
		rating=data.get('solved_count', None),
		moves=data.get('parsed', None).get('moves', None),
		fen=data.get('parsed', None).get('fen', None),
		created_at=data.get('date', None),
	)
	return new_puzzle


def update_puzzle_data_to_db(db: Session, data_item: List[Puzzle]):
	# add puzzle data to table puzzle in db
	db.add_all(data_item)
	db.commit()


def push_data_to_db(db: Session):
	typer.echo(f"loading data from {data_path_puzzle}")
	data = read_json_data_puzzle(data_path_puzzle)
	data_item = []
	for i in range(len(data)):
		item = create_puzzle_data(data[i])
		data_item.append(item)
	update_puzzle_data_to_db(db, data_item)
	print("pushed all puzzle data to db")