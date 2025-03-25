import 'server-only'

type YoutubeApiResponseItem = {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
};

export type YoutubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
};

type GetYoutTubeVideosParams = {
  maxResults?: number;
};

type GetYoutTubeVideosResponse = {
  videos: YoutubeVideo[];
};

const YOUTUBE_VIDEO_KIND = "youtube#video";
const MY_YOTUBE_CHANNEL_ID = "UCrrRsdMPYbsbtObtfxN2rmg";
const ONCE_PER_WEEK = 1000 * 60 * 60 * 24 * 7;

/**
 * @see https://developers.google.com/youtube/v3/docs/search/list#request
 **/
export async function getYouTubeVideos(
  params: GetYoutTubeVideosParams = {},
): Promise<GetYoutTubeVideosResponse> {
  const searchParams = new URLSearchParams({
    part: "snippet",
    order: "date",
    channelId: MY_YOTUBE_CHANNEL_ID,
    key: process.env.YOUTUBE_DATA_API_KEY,
    maxResults: params.maxResults ? String(params.maxResults) : "30",
  });

  const res = await fetch(
    `${process.env.YOUTUBE_DATA_API_BASE_URL}/search?${searchParams}`,
    { next: { revalidate: ONCE_PER_WEEK } },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch YouTube videos");
  }

  const data = await res.json();
  const videos: YoutubeVideo[] = data.items
    .filter(
      (item: YoutubeApiResponseItem) => item.id.kind === YOUTUBE_VIDEO_KIND,
    )
    .map(
      (item: YoutubeApiResponseItem): YoutubeVideo => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
      }),
    );

  return { videos };
}
