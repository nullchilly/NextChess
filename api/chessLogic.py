import chess
import chess.engine
class ChessLogic:
    def __init__(self, STOCKFISH_PATH):
        self.last_move = None
        self.engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
        self.skill_level = 1
        self.last_move = None
        self.piece_range = {
            1: 1, #pawn
            2: 3, #knight
            3: 3, #bishop
            4: 5, #rook
            5: 9 #queen
        }
        self.pieces = {
            "p": "Pawn",
            "n": "Knight",
            "b": "Bishop",
            "r": "Rook",
            "q": "Queen",
            "k": "King"
        }
        self.player = ""
        self.reduction = 0
        self.game_status = False

    def quitEngine(self):
        self.engine.quit()
    
    def setSkillLevel(self, skill_level):
        self.engine.configure({"Skill Level": skill_level})
        self.skill_level = skill_level

    # Returns move in 'chess.Move' format
    def getBestMove(self, board):
        result = self.engine.play(board, chess.engine.Limit(time=0.3))
        best_move = result.move
        self.last_move = best_move
        return best_move
    
    def getOutcome(self, board):
    #.winner returns true for white win, false for black, None for draw
        if board.outcome():
            #Transforming outcome() to satisfactory format
            result = str(board.outcome().termination).split('.')
            result = result[1].replace('_', ' ').title()
            return result, self.getWinner(board)

    def getWinner(self, board):
        if board.outcome().winner == True:
            return "white"
        elif board.outcome().winner == False:
            return "black"
        return None
    
    def getScore(self, board, stockfish):
        if board.is_checkmate() and board.outcome().winner == stockfish:
            return 0
        score = 0
        for piece in self.piece_range:
            score += len(board.pieces(piece, board.outcome().winner))*self.piece_range[piece]
        if score != 0:
            score = score*100/self.skill_level
            if not board.is_checkmate():
                score /= 3
            score -= self.reduction
        return score
    
    def checkCastling(self):
        if self.last_move and self.last_move.from_square == chess.E1 and self.last_move.to_square == chess.G1:
            rookMove = "h1f1"
            return rookMove
        if self.last_move and self.last_move.from_square == chess.E1 and self.last_move.to_square == chess.C1:
            rookMove = "a1d1"
            return rookMove
        if self.last_move and self.last_move.from_square == chess.E8 and self.last_move.to_square == chess.G8:
            rookMove="h8f8"
            return rookMove
        if self.last_move and self.last_move.from_square == chess.E8 and self.last_move.to_square == chess.C8:
            rookMove = "a8d8"
            return rookMove
        return False
    
    def checkPassant(self, move, board):
        if board.has_legal_en_passant() and board.is_capture(move) and board.piece_at(move.to_square) is None:
            return True
        return False
    
    def checkPromotion(self):
        if self.last_move and self.last_move.promotion:
            return True
        return False

    def setPlayer(self, name):
        self.player = name
