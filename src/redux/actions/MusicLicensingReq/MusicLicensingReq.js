// redux/actions.js

import {
  SET_MUSIC_LICENSING_FORM,
  RESET_MUSIC_LICENSING_FORM,
} from "../../constants/actionTypes";

export const setMusicLicensingReq = (payload) => ({
  type: SET_MUSIC_LICENSING_FORM,
  payload,
});

export const resetMusicLicensingReq = () => ({
  type: RESET_MUSIC_LICENSING_FORM,
});
