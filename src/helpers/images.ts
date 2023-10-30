import { PieceColor, PieceType } from "chess.js";

export const getPieceSrc = (color: PieceColor, piece: PieceType) => {
  return `assets/${color}_${piece}.svg`;
};

<<<<<<< HEAD
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
=======
export const getImageSrc = (src: string) => {
  return `assets/${src}.svg`;
>>>>>>> 2ae1555 (add profile page)
}
