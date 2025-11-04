import { LOAD_CURATED_PLAYLISTS_FAILURE, LOAD_CURATED_PLAYLISTS_SUCCESS } from '../actions/CuratedPlaylistActions/CuratedPlaylistActionTypes';

let initialState = {
  curatedPlaylists: [],
  error: null
};

const CuratedTracksReducer = (state = initialState, action) => {
  switch (action.type) {
  case LOAD_CURATED_PLAYLISTS_SUCCESS:
    return {
      ...state,
      curatedPlaylists: action.result
    };
  case LOAD_CURATED_PLAYLISTS_FAILURE:
    return {
      ...state,
      error: action.error
    };
  default:
    return state;
  }
};

export default CuratedTracksReducer;
