import UserService from "../../../user/services/UserService";
import {
  CLEAR_SEARCH_ATTRIBUTES,
  SEARCH_FOR_USER,
  SET_DROPDOWN_STATE,
  SET_REFINEMENT_ITEMS,
  SET_RESULTS_FOR,
  SET_SEARCH_RESULT,
  SET_SEARCH_STATE,
  SET_SEARCH_URL,
  SET_FAV_TRACK_ID,
  REMOVE_FAV_TRACK_ID,
  SET_ALL_FAV_TRACK_IDS,
  SET_SIMIL_QUERY,
  SET_CYANITE_IDSMGT,
} from "../../constants/actionTypes";

export const setResults = (result) => {
  return {
    type: SET_SEARCH_RESULT,
    result: result,
  };
};

export const setDropdownOpenState = (isOpen) => {
  return {
    type: SET_DROPDOWN_STATE,
    isOpen: isOpen,
  };
};

export const setRefinementItem = (refinement_item) => {
  return {
    type: SET_REFINEMENT_ITEMS,
    refinement_item: refinement_item,
  };
};
export const setSearchState = (search_state) => {
  //console.log("setSeachState "+search_state)
  return {
    type: SET_SEARCH_STATE,
    search_state: search_state,
  };
};
export const setSearchUrl = (search_url) => {
  return {
    type: SET_SEARCH_URL,
    search_url: search_url,
  };
};
export const setResultsFor = (query) => {
  return {
    type: SET_RESULTS_FOR,
    query: query,
  };
};
export const clearSearchState = () => {
  return {
    type: CLEAR_SEARCH_ATTRIBUTES,
  };
};

export const saveUserNameResultsData = (data) => {
  return {
    type: SEARCH_FOR_USER,
    data,
  };
};

export const fetchUserName = (queryString) => {
  return (dispatch) => {
    UserService.getAllByUserNameQuery(queryString).then((result) => {
      dispatch(saveUserNameResultsData(result));
    });
  };
};

export const setFavTrackId = (trackId) => {
  return {
    type: SET_FAV_TRACK_ID,
    trackId: trackId,
  };
};

export const removeFavTrackId = (trackId) => {
  return {
    type: REMOVE_FAV_TRACK_ID,
    trackId: trackId,
  };
};

export const setAllFavTrackIds = (trackIds) => {
  return {
    type: SET_ALL_FAV_TRACK_IDS,
    trackIds: trackIds,
  };
};
// redux/actions/searchActions.js
export const setSimilQuery = (query) => ({
  type: SET_SIMIL_QUERY,
  payload: query,
});

export const setCyaniteIdsMGT = (ids) => ({
  type: SET_CYANITE_IDSMGT,
  payload: ids,
});
