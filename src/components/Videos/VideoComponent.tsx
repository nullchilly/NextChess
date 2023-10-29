import { getYoutubeThumbnail } from "@/helpers/images";
import { VideosProps } from "@/helpers/types";

const VideoComponent = ({
  url,
  author,
  date,
  summary,
  length,
  style,
}: VideosProps) => {
  return (
    <div>
      <div className="bg-white w-72 h-80 p-4 rounded-lg shadow-lg">
        <div className="relative">
          <img
            src={getYoutubeThumbnail(url)}
            className="w-full h-full rounded-lg"
          ></img>
          <span className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs">
            {length}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <h2 className="text-red-500 font-bold">{author}</h2>
            <p className="text-gray-600 mx-2">|</p>
            <p className="text-gray-600">{date}</p>
            <p className="text-gray-600 mx-2">|</p>
            <p className="text-gray-600">{length}</p>
          </div>
          <p className="mt-2 text-gray-400 truncate">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export { VideoComponent };
