import { Color, PieceSymbol } from "chess.js";

export const getPieceSrc = (color: Color, piece: PieceSymbol) => {
  return `assets/${color}_${piece}.svg`;
};

export function getYoutubeThumbnail(videoUrl: string) {
  // Extract the video ID from the URL
  const videoId = videoUrl.split("v=")[1];
  if (!videoId) {
    throw new Error("Invalid YouTube video URL");
  }

  // Construct the URL for the thumbnail image (you can change the quality as needed)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  // You can fetch the image using your preferred method, for example, with Fetch API
  return thumbnailUrl;
}
export const getSvgSrc = (src: string) => {
  return `assets/${src}.svg`;
};
