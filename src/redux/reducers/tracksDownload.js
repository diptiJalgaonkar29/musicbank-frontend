import {
  ADD_TO_DOWNLOAD_BASKET,
  REMOVE_SELECTED_TRACK_FROM_DOWNLOAD_BASKET,
  REMOVE_DOWNLOADED_TRACKS_AND_RESET_DOWNLOAD_PROCESS,
  ADD_PLAYLIST_TO_DOWNLOAD_BASKET,
  ADD_BATCH_TO_DOWNLOAD_BASKET,
  SET_INIT_DOWNLOAD_BASKET,
  RESET_TRACK_DOWNLOADING_PROCESS,
  SET_DOWNLOAD_BASKET_META,
  RESET_DOWNLOAD_BASKET_META,
} from "../constants/actionTypes";
import Cookies from "js-cookie";
import _ from "lodash";

const intialState = {
  tracksInDownloadBasket: [],
  tracksInDownloadProcess: [],
  trackDownloadingPercent: 0,
  showTrackDownloadingProgress: false,
  isTrackDownloadingInBG: false,
};

function removeDuplicates(arr1, arr2, prop1, prop2) {
  let combinedArray = arr1.concat(arr2);
  let uniqueArray = combinedArray.filter(
    (obj, index, self) =>
      index ===
      self.findIndex((t) => t[prop1] === obj[prop1] && t[prop2] === obj[prop2])
  );
  let removedDuplicates = uniqueArray.slice(arr1.length);
  return removedDuplicates;
}

const tracksInDownloadBasket = (state = intialState, { type, payload }) => {
  const basketCookie = Cookies.get("basket")
    ? JSON.parse(Cookies.get("basket"))
    : {};
  const userId = JSON.parse(localStorage.getItem("userAuthorization"))?.userId;

  switch (type) {
    case SET_INIT_DOWNLOAD_BASKET:
      let lastData = payload?.map(({ isDownloadInProgress, ...rest }) => rest);

      var newState = _.uniqWith(lastData, _.isEqual);
      Cookies.set(
        "basket",
        JSON.stringify({ ...basketCookie, [userId + ""]: newState }),
        { expires: 30 }
      );
      return { ...state, tracksInDownloadBasket: newState };
    case ADD_TO_DOWNLOAD_BASKET:
      var newState = [...state.tracksInDownloadBasket, payload];
      Cookies.set(
        "basket",
        JSON.stringify({ ...basketCookie, [userId + ""]: newState }),
        { expires: 30 }
      );
      return { ...state, tracksInDownloadBasket: newState };
    case ADD_BATCH_TO_DOWNLOAD_BASKET:
      var newState = [...state.tracksInDownloadBasket, ...payload];
      Cookies.set(
        "basket",
        JSON.stringify({ ...basketCookie, [userId + ""]: newState }),
        { expires: 30 }
      );
      return { ...state, tracksInDownloadBasket: newState };
    case ADD_PLAYLIST_TO_DOWNLOAD_BASKET:
      var newState = [...state.tracksInDownloadBasket, ...payload];
      const uniqueArray = _.uniqWith(newState, _.isEqual);
      Cookies.set(
        "basket",
        JSON.stringify({ ...basketCookie, [userId + ""]: uniqueArray }),
        { expires: 30 }
      );
      return { ...state, tracksInDownloadBasket: uniqueArray };
    case REMOVE_SELECTED_TRACK_FROM_DOWNLOAD_BASKET:
      const keysExact = ["id", "audio_type"];
      const valuesExact = [
        payload.id.toString(),
        payload.audio_type.toString(),
      ];
      console.log(
        "state?.tracksInDownloadBasket",
        valuesExact,
        JSON.stringify(state?.tracksInDownloadBasket, null, 2)
      );
      const resultExact = state?.tracksInDownloadBasket.filter(
        (item) => !keysExact.every((a) => valuesExact.includes(item[a]))
      );
      console.log("resultExact", resultExact);
      Cookies.set(
        "basket",
        JSON.stringify({ ...basketCookie, [userId + ""]: resultExact }),
        { expires: 30 }
      );
      return { ...state, tracksInDownloadBasket: resultExact };
    case REMOVE_DOWNLOADED_TRACKS_AND_RESET_DOWNLOAD_PROCESS:
      const newTracksInDownloadBasket = state?.tracksInDownloadBasket?.filter(
        (data) => !data?.isDownloadInProgress
      );
      Cookies.remove("basketFormData");
      Cookies.set(
        "basket",
        JSON.stringify({
          ...basketCookie,
          [userId + ""]: newTracksInDownloadBasket,
        }),
        { expires: 30 }
      );
      return {
        ...state,
        tracksInDownloadBasket: newTracksInDownloadBasket,
        tracksInDownloadProcess: [],
        trackDownloadingPercent: 0,
        showTrackDownloadingProgress: false,
        isTrackDownloadingInBG: false,
      };
    case SET_DOWNLOAD_BASKET_META:
      return { ...state, ...payload };
    case RESET_DOWNLOAD_BASKET_META:
      return intialState;
    case RESET_TRACK_DOWNLOADING_PROCESS:
      return {
        ...state,
        trackDownloadingPercent: 0,
        showTrackDownloadingProgress: false,
        isTrackDownloadingInBG: false,
      };
    default:
      return state;
  }
};

export default tracksInDownloadBasket;
