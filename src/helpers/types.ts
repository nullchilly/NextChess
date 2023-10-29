import React from "react";

export type VideosProps = {
  url: string;
  author: string;
  date: string;
  length: string;
  summary: string;
  style?: React.CSSProperties;
  className?: string;
};
