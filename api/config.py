import platform

STOCKFISH_PATH = ""
if platform.system() == 'Linux':
    STOCKFISH_PATH ="./stockfish/stockfish-ubuntu"
elif platform.system() == 'Darwin': #Darwin for MacOS
    STOCKFISH_PATH ="./stockfish/stockfish-macos"