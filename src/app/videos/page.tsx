import { Metadata } from "next";
import { YouTubeVideoCard } from "~/components/card/card.component";
import { getYouTubeVideos } from "~/utils/youtube.utils";

/** Revalidate the page once per week */
export const revalidate = 604800;

export const metadata: Metadata = {
  title: "YouTube videos",
};

export default async function YouTubeVideosPage() {
  const { videos } = await getYouTubeVideos();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-bold text-4xl sm:text-5xl mb-2 sm:mb-5">
        YouTube videos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {videos.map((video) => (
          <YouTubeVideoCard
            key={video.id}
            title={video.title}
            description={video.description}
            image={video.thumbnail}
            className="w-full sm:w-full"
            url={`https://www.youtube.com/watch?v=${video.id}`}
          />
        ))}
      </div>
    </div>
  );
}
