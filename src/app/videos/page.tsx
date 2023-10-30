"use client";
import { VideoComponent } from "@/components/Videos/VideoComponent";
import { VideosProps } from "@/helpers/types";
import { videoList } from "./fakeData";
import * as React from "react";
import VideoGrid from "@/components/Videos/VideoGrid";

export default function Videos() {
  const itemsPerPage = 20;
  const [page, setPage] = React.useState<number>(1);
  const totalPages = Math.ceil(videoList.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, videoList.length);

  const [renderVideo, setRenderVideo] = React.useState<VideosProps[]>(
    videoList.slice(startIndex, endIndex)
  );

  const updateRenderVideo = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, videoList.length);
    setRenderVideo(videoList.slice(startIndex, endIndex));
  };

  React.useEffect(() => {
    updateRenderVideo(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newStartIndex = (newPage - 1) * itemsPerPage;
      const newEndIndex = Math.min(
        newStartIndex + itemsPerPage,
        videoList.length
      );

      setPage(newPage);
      setRenderVideo(videoList.slice(newStartIndex, newEndIndex));
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="bg-gray-900 text-white text-center py-4">
        <h1 className="text-4xl font-bold">Videos</h1>
        <div className="flex justify-center space-x-4 mb-4 pt-4">
          <button className="bg-red-600 text-white border border-red-600 px-4 py-2 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors">
            Beginner
          </button>
          <button className="bg-yellow-500 text-white border border-yellow-500 px-4 py-2 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-colors">
            Medium
          </button>
          <button className="bg-green-500 text-white border border-green-500 px-4 py-2 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors">
            Intermediate
          </button>
        </div>
      </div>
      {/* <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videoList.map((video) => (
            <div key={video.url} className="relative">
              <VideoComponent {...video} />
            </div>
          ))}
        </div>
      </div> */}
      <VideoGrid videos={renderVideo} />
      <div className="flex justify-center pb-4">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="mx-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          Previous
        </button>
        <div className="space-x-2">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              disabled={pageNumber === page}
              onClick={() => handlePageChange(pageNumber)}
              className={`p-2 rounded-lg ${
                pageNumber === page ? "bg-gray-400" : "bg-gray-200"
              } hover:bg-gray-300 cursor-pointer`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <button
          disabled={endIndex >= videoList.length}
          onClick={() => handlePageChange(page + 1)}
          className="mx-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
