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

export type Rating = {
    gameType: GameType;
    rate: number
}

export type UserProfile = {
    name: string;
    avatar: string,
    userNetworkLinks: UserNetworkLink[];
    ratings: Rating[]
}
