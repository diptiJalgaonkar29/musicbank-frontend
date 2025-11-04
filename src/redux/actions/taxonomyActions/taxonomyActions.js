import {
  ADD_ASSET_TYPES,
  ADD_SONIC_LOGO_MAIN_MOOD_TAGS,
  ADD_AMP_MAIN_MOOD_TAGS,
  ADD_SONIC_LOGO_MOOD_TAGS,
  ADD_AMP_MOOD_TAGS,
  ADD_INSTRUMENTS,
  ADD_TRACK_TYPES,
} from "../../constants/actionTypes";

export const addAssetTypeIdAndLabelObj = (data) => {
  return {
    type: ADD_ASSET_TYPES,
    payload: data,
  };
};

export const addAmpMainMoodTagsIdAndLabelObj = (data) => {
  return {
    type: ADD_AMP_MAIN_MOOD_TAGS,
    payload: data,
  };
};

export const addAmpMoodTagsIdAndLabelObj = (data) => {
  return {
    type: ADD_AMP_MOOD_TAGS,
    payload: data,
  };
};

export const addSonicLogoMainMoodTagsIdAndLabelObj = (data) => {
  return {
    type: ADD_SONIC_LOGO_MAIN_MOOD_TAGS,
    payload: data,
  };
};

export const addSonicLogoMoodTagsIdAndLabelObj = (data) => {
  return {
    type: ADD_SONIC_LOGO_MOOD_TAGS,
    payload: data,
  };
};

export const addInstrumentsIdAndLabelObj = (data) => {
  return {
    type: ADD_INSTRUMENTS,
    payload: data,
  };
};
export const addTrackTypeIdAndLabelObj = (data) => {
  return {
    type: ADD_TRACK_TYPES,
    payload: data,
  };
};
