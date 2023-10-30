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
