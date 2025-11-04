import {
  SET_TRACK_FILTERS,
  RESET_TRACK_FILTERS,
  UPDATE_SUPERSEARCH_TRACK_FILTERS,
  RESET_SUPERSEARCH_TRACK_FILTERS,
  SET_SUPERSEARCH_TRACK_FILTERS,
  SET_TRACK_TYPE_FILTERS,
  RESET_TRACK_TYPE_FILTERS,
  RESET_ALL_TRACK_FILTERS,
} from "../../constants/actionTypes";

export const setTrackFilters = (trackFilter) => {
  return {
    type: SET_TRACK_FILTERS,
    payload: trackFilter,
  };
};

export const setTrackTypeFilters = (trackTypeFilter) => {
  return {
    type: SET_TRACK_TYPE_FILTERS,
    payload: trackTypeFilter,
  };
};

export const setSuperSearchTrackFilters = (SSTrackFilter) => {
  return {
    type: SET_SUPERSEARCH_TRACK_FILTERS,
    payload: SSTrackFilter,
  };
};

export const resetTrackFilters = () => {
  return {
    type: RESET_TRACK_FILTERS,
  };
};

export const resetTrackTypeFilters = () => {
  return {
    type: RESET_TRACK_TYPE_FILTERS,
  };
};

export const resetSuperSearchTrackFilters = () => {
  return {
    type: RESET_SUPERSEARCH_TRACK_FILTERS,
  };
};

export const updateSuperSearchTrackFilters = () => {
  return {
    type: UPDATE_SUPERSEARCH_TRACK_FILTERS,
  };
};

export const resetAllTrackFilters = () => {
  return {
    type: RESET_ALL_TRACK_FILTERS,
  };
};
