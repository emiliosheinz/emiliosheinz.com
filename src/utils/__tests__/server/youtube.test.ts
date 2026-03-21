jest.mock("server-only", () => ({}));

import { getYouTubeVideos } from "~/utils/youtube";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeFetchResponse(data: unknown, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
  });
}

function makeSearchItem(videoId: string, title = "Title", description = "Desc", thumbnailUrl = "http://thumb.jpg") {
  return {
    id: { kind: "youtube#video", videoId },
    snippet: {
      title,
      description,
      thumbnails: { high: { url: thumbnailUrl } },
    },
  };
}

function makeDetailsItem(id: string, duration: string) {
  return { id, contentDetails: { duration } };
}

describe("getYouTubeVideos", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.YOUTUBE_DATA_API_KEY = "test-key";
    process.env.YOUTUBE_DATA_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
  });

  it("should return videos that are longer than 3 minutes", async () => {
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [makeSearchItem("vid1", "Long Video")],
        }),
      )
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [makeDetailsItem("vid1", "PT10M0S")],
        }),
      );

    const result = await getYouTubeVideos();

    expect(result.videos).toHaveLength(1);
    expect(result.videos[0].id).toBe("vid1");
    expect(result.videos[0].title).toBe("Long Video");
  });

  it("should filter out short videos (duration <= 180 seconds)", async () => {
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [
            makeSearchItem("short1", "Short 30s"),
            makeSearchItem("short2", "Short 3min"),
            makeSearchItem("long1", "Long Video"),
          ],
        }),
      )
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [
            makeDetailsItem("short1", "PT30S"),
            makeDetailsItem("short2", "PT3M0S"),
            makeDetailsItem("long1", "PT3M1S"),
          ],
        }),
      );

    const result = await getYouTubeVideos();

    expect(result.videos).toHaveLength(1);
    expect(result.videos[0].id).toBe("long1");
  });

  it("should return empty array when all videos are shorts", async () => {
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse({ items: [makeSearchItem("s1")] }),
      )
      .mockReturnValueOnce(
        makeFetchResponse({ items: [makeDetailsItem("s1", "PT1M0S")] }),
      );

    const result = await getYouTubeVideos();

    expect(result.videos).toHaveLength(0);
  });

  it("should return empty array when search returns no items", async () => {
    mockFetch
      .mockReturnValueOnce(makeFetchResponse({ items: [] }))
      .mockReturnValueOnce(makeFetchResponse({ items: [] }));

    const result = await getYouTubeVideos();

    expect(result.videos).toHaveLength(0);
  });

  it("should filter out non-video search results", async () => {
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [
            { id: { kind: "youtube#playlist", videoId: "p1" }, snippet: {} },
            makeSearchItem("vid1"),
          ],
        }),
      )
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [makeDetailsItem("vid1", "PT5M0S")],
        }),
      );

    const result = await getYouTubeVideos();

    expect(result.videos).toHaveLength(1);
    expect(result.videos[0].id).toBe("vid1");
  });

  it("should throw when the search fetch fails", async () => {
    mockFetch.mockReturnValueOnce(makeFetchResponse({}, false));

    await expect(getYouTubeVideos()).rejects.toThrow(
      "Failed to fetch YouTube search results",
    );
  });

  it("should throw when the video details fetch fails", async () => {
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse({ items: [makeSearchItem("vid1")] }),
      )
      .mockReturnValueOnce(makeFetchResponse({}, false));

    await expect(getYouTubeVideos()).rejects.toThrow(
      "Failed to fetch YouTube video details",
    );
  });

  it("should map video fields correctly", async () => {
    const thumbnailUrl = "https://example.com/thumb.jpg";
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [makeSearchItem("vid1", "My Video", "My Description", thumbnailUrl)],
        }),
      )
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [makeDetailsItem("vid1", "PT10M0S")],
        }),
      );

    const result = await getYouTubeVideos();

    expect(result.videos[0]).toEqual({
      id: "vid1",
      title: "My Video",
      description: "My Description",
      thumbnail: thumbnailUrl,
    });
  });

  it("should pass maxResults to the search request", async () => {
    mockFetch
      .mockReturnValueOnce(makeFetchResponse({ items: [] }))
      .mockReturnValueOnce(makeFetchResponse({ items: [] }));

    await getYouTubeVideos({ maxResults: 5 });

    const searchUrl = mockFetch.mock.calls[0][0] as string;
    expect(searchUrl).toContain("maxResults=5");
  });

  it("should use default maxResults of 30", async () => {
    mockFetch
      .mockReturnValueOnce(makeFetchResponse({ items: [] }))
      .mockReturnValueOnce(makeFetchResponse({ items: [] }));

    await getYouTubeVideos();

    const searchUrl = mockFetch.mock.calls[0][0] as string;
    expect(searchUrl).toContain("maxResults=30");
  });

  it("should parse ISO duration with hours, minutes and seconds", async () => {
    mockFetch
      .mockReturnValueOnce(
        makeFetchResponse({ items: [makeSearchItem("vid1")] }),
      )
      .mockReturnValueOnce(
        makeFetchResponse({
          items: [makeDetailsItem("vid1", "PT2H30M15S")],
        }),
      );

    const result = await getYouTubeVideos();

    expect(result.videos).toHaveLength(1);
  });
});
