import json
from typing import List

import typer
from sqlalchemy.orm import Session, sessionmaker
from api.app.model.puzzle import Puzzle

data_path_puzzle = "public/all.json"


def read_json_data_puzzle(path: str):
	with open(path, 'r') as f:
		data = json.load(f)
	return data

def create_puzzle_data(data) -> Puzzle:
	new_puzzle_data = {
		"name": data.get('title', None),
		"position": data.get('pgn', None),
		"rating": data.get('solved_count', None),
		"moves": data.get('parsed', None).get('moves', None),
		"fen": data.get('parsed', None).get('fen', None),
		"created_at": data.get('date', None),
	}
	new_puzzle: Puzzle = Puzzle()
	new_puzzle.name = new_puzzle_data['name']
	new_puzzle.position = new_puzzle_data['position']
	new_puzzle.rating = new_puzzle_data['rating']
	new_puzzle.moves = new_puzzle_data['moves']
	new_puzzle.fen = new_puzzle_data['fen']
	new_puzzle.created_at = new_puzzle_data['created_at']
	return new_puzzle


def update_puzzle_data_to_db(db: Session, data_item: List[Puzzle]):
	# add puzzle data to table puzzle in db
	for i in range(len(data_item)):
		db.add(data_item[i])
		print("pushed puzzle data: ", i)
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