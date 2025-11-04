import {
  ADD_TO_DOWNLOAD_BASKET,
  REMOVE_SELECTED_TRACK_FROM_DOWNLOAD_BASKET,
  REMOVE_DOWNLOADED_TRACKS_AND_RESET_DOWNLOAD_PROCESS,
  ADD_PLAYLIST_TO_DOWNLOAD_BASKET,
  ADD_BATCH_TO_DOWNLOAD_BASKET,
  SET_INIT_DOWNLOAD_BASKET,
  RESET_TRACK_DOWNLOADING_PROCESS,
  SET_DOWNLOAD_BASKET_META,
  RESET_DOWNLOAD_BASKET_META
} from "../../constants/actionTypes";

export const setInitDownloadBasket = (track) => {
  return {
    type: SET_INIT_DOWNLOAD_BASKET,
    payload: track,
  };
};

export const addToDownloadBasket = (track) => {
  return {
    type: ADD_TO_DOWNLOAD_BASKET,
    payload: track,
  };
};

export const addBatchToDownloadBasket = (tracks) => {
  return {
    type: ADD_BATCH_TO_DOWNLOAD_BASKET,
    payload: tracks,
  };
};

export const addPlaylistToDownloadBasket = (trackArray) => {
  return {
    type: ADD_PLAYLIST_TO_DOWNLOAD_BASKET,
    payload: trackArray,
  };
};

export const removeSelectedTrackFromDownloadBasket = (track) => {
  return {
    type: REMOVE_SELECTED_TRACK_FROM_DOWNLOAD_BASKET,
    payload: track,
  };
};

export const removeDownloadedTracksFromDownloadBasketAndResetDownloadProcess = (
  tracksToBeDownload
) => {
  return {
    type: REMOVE_DOWNLOADED_TRACKS_AND_RESET_DOWNLOAD_PROCESS,
    payload: tracksToBeDownload,
  };
};

export const resetTrackDownloadingProcess = () => {
  return {
    type: RESET_TRACK_DOWNLOADING_PROCESS,
  };
};

export const setDownloadBasketMeta = (downloadBasketMeta) => {
  return {
    type: SET_DOWNLOAD_BASKET_META,
    payload: downloadBasketMeta,
  };
};

export const resetDownloadBasketMeta = () => {
  return {
    type: RESET_DOWNLOAD_BASKET_META,
  };
};
