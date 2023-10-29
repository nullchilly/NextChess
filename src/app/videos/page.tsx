import { VideoComponent } from "@/components/Videos/VideoComponent";
import { VideosProps } from "@/helpers/types";
import { videoList } from "./fakeData";

export default function Videos() {
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
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videoList.map((video) => (
            <div key={video.url} className="relative">
              <VideoComponent {...video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
