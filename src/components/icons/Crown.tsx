import React from "react";

type Props = {
  width?: string;
  height?: string;
};

function Crown({ width, height }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      fill="none"
      stroke="#d4de17"
      viewBox="-2.4 -2.4 28.8 28.8"
    >
      <rect
        width="28.8"
        height="28.8"
        x="-2.4"
        y="-2.4"
        fill="#fafafa"
        strokeWidth="0"
        rx="0"
      ></rect>
      <path
        fill="#7c9405"
        fillRule="evenodd"
        d="M11 5a1 1 0 112 0 1 1 0 01-2 0zm2.327 2.691a3 3 0 10-2.654 0L8.506 13.47l-3.44-2.294a3 3 0 10-2.874.714L3.969 19l-.628 2.515A2 2 0 005.28 24h13.438a2 2 0 001.94-2.485L20.032 19l1.777-7.11a3.001 3.001 0 10-2.874-.715l-3.44 2.294-2.167-5.778zM21 10s0 0 0 0a1 1 0 100-2 1 1 0 000 2zM4 9a1 1 0 01-1 1h0a1 1 0 111-1zm1.28 13l.5-2h12.44l.5 2H5.28zm14.122-8.733L18.22 18H5.781l-1.184-4.733 3.848 2.565a1 1 0 001.491-.48L12 9.847l2.064 5.503a1 1 0 001.49.481l3.848-2.565z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Crown;
