import { Metadata } from "next";
import { Card } from "~/components/card";
import { getYouTubeVideos } from "~/utils/youtube.utils";

/** Revalidate the page once per week */
export const revalidate = 604800;

export const metadata: Metadata = {
  title: "YouTube videos",
};

export default async function YouTubeVideosPage() {
  const { videos } = await getYouTubeVideos();

  return (
    <main className="flex flex-col gap-8 pt-14">
      <h1 className="font-bold text-4xl sm:text-5xl mb-2 sm:mb-5">
        YouTube videos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <Card
            key={video.id}
            title={video.title}
            description={video.description}
            image={video.thumbnail}
            className="w-full sm:w-full"
            url={`https://www.youtube.com/watch?v=${video.id}`}
          />
        ))}
      </div>
    </main>
  );
}
