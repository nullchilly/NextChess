import time
from threading import *

class ChessTimer():
    def __init__(self, time_left=60):
        self.pause = True
        self.time_left = time_left

    def start_timer(self):
        self.pause = False
        while self.time_left > 0:
            mins, secs = divmod(self.time_left, 60)
            time.sleep(1)
            self.time_left = self.time_left - 1

            if self.pause == True:
                break
    
    def is_running(self):
        return self.pause

    def pause_time(self):
        self.pause = True

    def get_time_left(self):
        return self.time_left;

    def run_clock(self):
        self.x = Thread(target=self.start_timer, daemon=True)
        self.x.start()
