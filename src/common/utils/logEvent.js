// utils/eventLogger.js
export const TRACK_TITLE_CLICK = "TrackTitleClick";
export const TRACK_PLAY = "TrackPlay";
export const AI_SEARCH_SELECT = "AiSearchSelect";
export const AI_SEARCH_RESULT = "AiSearchResult";
export const AI_SEARCH_SIDE_FILTER = "AiSearchSideFilter";
export const AI_SEARCH_TRACK_FILTER = "AiSearchTrackFilter";
export const ADD_TO_PLAYLIST = "AddToPlaylist";
export const ADD_TO_PROJECT = "AddToProject";
export const ADD_TO_PREDICT = "AddToPredict";
export const TAKE_TO_AI = "TakeToAi";
export const SIMILARITY_SEARCH = "SimilaritySearch";
export const DOWNLOAD_PREVIEW = "DownloadPreview";
export const TRACK_LIKE = "TrackLike";

export const logEvent = async (eventData = {}) => {
  console.log("icon clicked");
  const EVENT_TYPES = {
    TRACK_TITLE_CLICK,
    TRACK_PLAY,
    AI_SEARCH_SELECT,
    AI_SEARCH_RESULT,
    AI_SEARCH_SIDE_FILTER,
    AI_SEARCH_TRACK_FILTER,
    ADD_TO_PLAYLIST,
    ADD_TO_PROJECT,
    ADD_TO_PREDICT,
    TAKE_TO_AI,
    SIMILARITY_SEARCH,
    DOWNLOAD_PREVIEW,
    TRACK_LIKE,
  };
  try {
    // Default structure of event object
    const basePayload = {
      searchType: null,
      objectIdList: [],
      eventType: null,
      eventTypeId: null,
      moodName: null,
      moodValue: null,
      tempoName: null,
      tempoValue: null,
      genreName: null,
      genreValue: null,
      pageName: null,
      timeStamp: new Date().toISOString(),
    };

    // Merge dynamic keys passed from the caller
    const finalPayload = { ...basePayload, ...eventData };

    console.log("EVENT LOG : ", finalPayload);

    // Call API
    const response = await fetch("/api/event-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalPayload),
    });

    return await response.json();
  } catch (err) {
    console.error("Event Logger Error:", err);
  }
};
