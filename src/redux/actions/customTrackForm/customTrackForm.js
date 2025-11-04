// redux/actions.js

import {
  SET_CUSTOM_TRACK_FORM,
  RESET_CUSTOM_TRACK_FORM,
} from "../../constants/actionTypes";

export const setCustomTrackForm = (payload) => ({
  type: SET_CUSTOM_TRACK_FORM,
  payload,
});

export const resetCustomTrackForm = () => ({
  type: RESET_CUSTOM_TRACK_FORM,
});
