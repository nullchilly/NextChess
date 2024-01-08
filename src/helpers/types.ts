import React from "react";

export type VideosProps = {
  url: string;
  author: string;
  date: string;
  length: string;
  summary: string;
  tag?: string[];
  style?: React.CSSProperties;
  className?: string;
};

export type VideoType = {
  url: string;
  author: string;
  date: string;
  length: string;
  summary: string;
  tag?: string[];
  id: string;
};
export enum UserNetworkType{
    FACEBOOK="FACEBOOK"
}

export type UserNetworkLink = {
    link: string;
    text: string;
    type: UserNetworkType;
}

export enum GameType{
    FAST="Fast Chess",
    SLOW="Slow",
    PUZZLE="Puzzle",
    STARS="Stars"

}

// TODO: Support more variants
export enum ChessVariants {
    STANDARD="Standard",
    CHESS960="Chess960",
}

export enum TimeMode {
    UNLIMITED="Unlimited",
    ThreeMins="3 minutues",
    FiveMins="5 minutes",
    SevenMins="7 minutes",
}

export enum DuelHistory {
  win='win',
  lose='lose',
  draw='draw',
  unknown='unKnown',
}

export enum StatePuzzleDuel {
  wait,
  pending,
  success,
  finding,
}

export type DataPoint = {
    x: string;
    y: number;
};

export type Rating = {
    gameType: GameType;
    rate: number;
    history: DataPoint[];
}

export type UserProfile = {
    name: string;
    avatar: string,
    userNetworkLinks: UserNetworkLink[];
    ratings: Rating[]
}

export type BotProps = {
  width? :number,
  height? :number,
  name?: string,
}

export type ChessProps = {
  width? :number,
  height? :number,
  name?: string,
  color?: string,
}

export type IconProps = {
  width? :number,
  height? :number,
}

export type PuzzleInfo = {
  rating: number;
  targetTime: number;
  speedBonus: number;
  passRate: number;
  attempts: number;
  themes: string[];
};

export type GameConfig = {
  strength: number;
  variant: number;
  timeMode: number;
}

export type WINNER = "black" | "white" | "draw" | "unknown";

export type AnalysisScore = {
  type: "Cp" | "Mate",
  score: number,
}
