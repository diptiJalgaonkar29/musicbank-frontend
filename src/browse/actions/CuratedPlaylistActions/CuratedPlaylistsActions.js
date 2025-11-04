import {
  LOAD_CURATED_PLAYLISTS,
  LOAD_CURATED_PLAYLISTS_FAILURE,
  LOAD_CURATED_PLAYLISTS_SUCCESS
} from './CuratedPlaylistActionTypes';

import BrowseServiceInstance from '../../services/BrowseService';

export const loadCurated = () => {
  return dispatch => new Promise((resolve, reject) => {
    dispatch({
      type: LOAD_CURATED_PLAYLISTS,
    });
    return BrowseServiceInstance.loadCurated().then(result => {
      dispatch({
        type: LOAD_CURATED_PLAYLISTS_SUCCESS,
        result: result
      });
      resolve(result);
    }).catch((result) => {
      dispatch({
        type: LOAD_CURATED_PLAYLISTS_FAILURE,
        error: result
      });
      reject(result);
    });
  });
};