"use client";
import { FC, useEffect, useRef, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

export type PlayerTimerProps = {
  timeLeft: number;
  going: boolean;
  turnIndicator: boolean;
};

const PlayerTimer: FC<PlayerTimerProps> = ({
  timeLeft,
  going,
  turnIndicator,
}) => {
  const countdownRef = useRef<Countdown>(null);
  const [date, setDate] = useState(Date.now() + timeLeft);

  useEffect(() => {
    if (going) {
      countdownRef.current!.start();
    } else {
      countdownRef.current!.pause();
    }
  }, [going]);

  useEffect(() => {
    setDate(Date.now() + timeLeft);
  }, [timeLeft]);

  return (
    <Countdown
      date={date}
      ref={countdownRef}
      autoStart={false}
      intervalDelay={100}
      precision={1}
      renderer={({ minutes, seconds, milliseconds }) => (
        <div
          className={
            "inline-block p-4 text-xl rounded-2xl font-mono " +
            (turnIndicator ? "bg-white" : "bg-[#c8c8c8]")
          }
        >
          <h1>
            {zeroPad(minutes)}:{zeroPad(seconds)}.{milliseconds / 100}
          </h1>
        </div>
      )}
    />
  );
};

export default PlayerTimer;
