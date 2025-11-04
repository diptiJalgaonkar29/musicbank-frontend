import { LOAD_POPULAR_TRACKS_FAILURE, LOAD_POPULAR_TRACKS_SUCCESS } from '../actions/PopularTracksActions/PopularTracksActionTypes';

let initialState = {
  tracks: [],
  error: null
};

const RecentlyAddedTracksReducer = (state = initialState, action) => {
  switch (action.type) {
  case LOAD_POPULAR_TRACKS_SUCCESS:
    return {
      ...state,
      tracks: action.result
    };
  case LOAD_POPULAR_TRACKS_FAILURE:
    return {
      ...state,
      error: action.error
    };
  default:
    return state;
  }
};

export default RecentlyAddedTracksReducer;
