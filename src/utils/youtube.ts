import "server-only";

type YoutubeSearchItem = {
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

type YoutubeVideosDetailsItem = {
  id: string;
  contentDetails: {
    duration: string;
  };
};

export type YoutubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
};

type GetYouTubeVideosParams = {
  maxResults?: number;
};

type GetYouTubeVideosResponse = {
  videos: YoutubeVideo[];
};

const YOUTUBE_VIDEO_KIND = "youtube#video";
const MY_YOUTUBE_CHANNEL_ID = "UCrrRsdMPYbsbtObtfxN2rmg";
const SHORTS_MAX_DURATION_SECONDS = 180;

function isoDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, hours, minutes, seconds] = match;
  return (
    (Number(hours) || 0) * 3600 +
    (Number(minutes) || 0) * 60 +
    (Number(seconds) || 0)
  );
}

function isShortVideo(duration: string): boolean {
  return isoDurationToSeconds(duration) <= SHORTS_MAX_DURATION_SECONDS;
}

async function fetchSearchResults(
  maxResults: number,
): Promise<YoutubeSearchItem[]> {
  const searchParams = new URLSearchParams({
    type: "video",
    order: "date",
    part: "snippet,id",
    channelId: MY_YOUTUBE_CHANNEL_ID,
    key: process.env.YOUTUBE_DATA_API_KEY ?? "",
    maxResults: String(maxResults),
  });

  const res = await fetch(
    `${process.env.YOUTUBE_DATA_API_BASE_URL}/search?${searchParams}`,
    {
      cache: "force-cache",
      next: { revalidate: 86_400 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch YouTube search results");
  }

  const data = await res.json();
  return data.items.filter(
    (item: YoutubeSearchItem) => item.id.kind === YOUTUBE_VIDEO_KIND,
  );
}

async function fetchVideoDetails(
  videoIds: string[],
): Promise<YoutubeVideosDetailsItem[]> {
  if (videoIds.length === 0) return [];

  const params = new URLSearchParams({
    part: "contentDetails",
    id: videoIds.join(","),
    key: process.env.YOUTUBE_DATA_API_KEY ?? "",
  });

  const res = await fetch(
    `${process.env.YOUTUBE_DATA_API_BASE_URL}/videos?${params}`,
    {
      cache: "force-cache",
      next: { revalidate: 86_400 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch YouTube video details");
  }

  const data = await res.json();
  return data.items;
}

export async function getYouTubeVideos(
  params: GetYouTubeVideosParams = {},
): Promise<GetYouTubeVideosResponse> {
  const maxResults = params.maxResults ?? 30;
  const searchItems = await fetchSearchResults(maxResults);
  const videoIds = searchItems.map((item) => item.id.videoId);
  const detailsItems = await fetchVideoDetails(videoIds);
  const durationById = new Map(
    detailsItems.map((item) => [item.id, item.contentDetails.duration]),
  );
  const videos: YoutubeVideo[] = searchItems
    .filter((item) => {
      const duration = durationById.get(item.id.videoId);
      if (!duration) return false;
      return !isShortVideo(duration);
    })
    .map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
    }));
  return { videos };
}
