import {
  ADD_AMP_MAIN_MOOD_TAGS,
  ADD_SONIC_LOGO_MAIN_MOOD_TAGS,
  ADD_AMP_MOOD_TAGS,
  ADD_SONIC_LOGO_MOOD_TAGS,
  ADD_ASSET_TYPES,
  ADD_INSTRUMENTS,
  ADD_TRACK_TYPES,
} from "../constants/actionTypes";

const intialState = {
  assetTypeIdAndLabelObj: {},
  ampMainMoodTagsIdAndLabelObj: {},
  ampMoodTagsIdAndLabelObj: {},
  sonicLogoMainMoodTagsIdAndLabelObj: {},
  sonicLogoMoodTagsIdAndLabelObj: {},
  instrumentsIdAndLabelObj: {},
  trackTypeIdAndLabelObj: {},
};

const addTaxonomyTags = (state = intialState, { type, payload }) => {
  switch (type) {
    case ADD_ASSET_TYPES:
      return { ...state, assetTypeIdAndLabelObj: payload };
    case ADD_AMP_MAIN_MOOD_TAGS:
      return { ...state, ampMainMoodTagsIdAndLabelObj: payload };
    case ADD_AMP_MOOD_TAGS:
      return { ...state, ampMoodTagsIdAndLabelObj: payload };
    case ADD_SONIC_LOGO_MAIN_MOOD_TAGS:
      return { ...state, sonicLogoMainMoodTagsIdAndLabelObj: payload };
    case ADD_SONIC_LOGO_MOOD_TAGS:
      return { ...state, sonicLogoMoodTagsIdAndLabelObj: payload };
    case ADD_INSTRUMENTS:
      return { ...state, instrumentsIdAndLabelObj: payload };
    case ADD_TRACK_TYPES:
      return { ...state, trackTypeIdAndLabelObj: payload };
    default:
      return state;
  }
};

export default addTaxonomyTags;
