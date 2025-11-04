import {
  SET_TRACK_FILTERS,
  RESET_TRACK_FILTERS,
  UPDATE_SUPERSEARCH_TRACK_FILTERS,
  SET_SUPERSEARCH_TRACK_FILTERS,
  RESET_SUPERSEARCH_TRACK_FILTERS,
  SET_TRACK_TYPE_FILTERS,
  RESET_TRACK_TYPE_FILTERS,
  RESET_ALL_TRACK_FILTERS,
} from "../constants/actionTypes";

const intialState = {
  browseTrackTypeFilters: [],
  browseTrackFilters: {
    tempo: [],
    tag_amp_mainmood_ids: [],
    tag_amp_allmood_ids: [], //filtered tags must be array of object eg.
    //   {
    //   tag_amp_allmood_ids: [{ label: "Power": value: "AAMT-13" }]
    //   ....
    // },
    instrument_ids: [],
    tag_genre: [],
    assetTypeId: [],
    tag_key: [],
    tag_tempo: [],
  },
  superSearchTrackFilters: {
    tag_amp_mainmood_ids: [],
    tag_genre: [],
    tag_tempo: [],
  },
};

const trackFilters = (state = intialState, { type, payload }) => {
  switch (type) {
    case SET_TRACK_FILTERS:
      return {
        ...state,
        browseTrackFilters: { ...state.browseTrackFilters, ...payload },
      };
    case RESET_TRACK_FILTERS:
      return {
        ...state,
        browseTrackFilters: {
          tempo: [],
          tag_amp_mainmood_ids: [],
          tag_amp_allmood_ids: [],
          instrument_ids: [],
          tag_genre: [],
          assetTypeId: [],
          tag_key: [],
          tag_tempo: [],
        },
      };
    case SET_SUPERSEARCH_TRACK_FILTERS:
      return {
        ...state,
        superSearchTrackFilters: {
          ...state.superSearchTrackFilters,
          ...payload,
        },
      };
    case RESET_SUPERSEARCH_TRACK_FILTERS:
      return {
        ...state,
        superSearchTrackFilters: {
          tag_amp_mainmood_ids: [],
          tag_genre: [],
          tag_tempo: [],
        },
      };
    case SET_TRACK_TYPE_FILTERS:
      return {
        ...state,
        browseTrackTypeFilters: payload,
      };
    case RESET_TRACK_TYPE_FILTERS:
      return {
        ...state,
        browseTrackTypeFilters: [],
      };
    case UPDATE_SUPERSEARCH_TRACK_FILTERS:
      return {
        ...state,
        browseTrackFilters: {
          tag_amp_mainmood_ids:
            state.superSearchTrackFilters.tag_amp_mainmood_ids,
          tag_genre: state.superSearchTrackFilters.tag_genre,
          tag_tempo: state.superSearchTrackFilters.tag_tempo,
          tempo: [],
          tag_amp_allmood_ids: [],
          instrument_ids: [],
          assetTypeId: [],
          tag_key: [],
        },
        superSearchTrackFilters: {
          tag_amp_mainmood_ids: [],
          tag_genre: [],
          tag_tempo: [],
        },
        browseTrackTypeFilters: [],
      };
    case RESET_ALL_TRACK_FILTERS:
      return intialState;
    default:
      return state;
  }
};

export default trackFilters;
