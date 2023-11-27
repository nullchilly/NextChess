from api.app.service.puzzle import PuzzleService


def test_puzzle_service(session):
	puzzle = PuzzleService.get_random_ten_puzzle(session)
	print(puzzle)
	pass
