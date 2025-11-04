// actions/trackActions.js

export const SET_TRACK_DATA = "SET_TRACK_DATA";

export const setTrackData = (trackData) => {
  return {
    type: SET_TRACK_DATA,
    payload: trackData,
  };
};
