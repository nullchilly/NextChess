import { VideosProps } from "@/helpers/types";
import { VideoComponent } from "./VideoComponent";

type VideoGridProps = {
  videos: VideosProps[];
};

const VideoGrid = ({ videos }: VideoGridProps) => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.url} className="relative">
            <VideoComponent {...video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
