import {
  LOAD_RECENTLY_ADDED_TRACKS,
  LOAD_RECENTLY_ADDED_TRACKS_FAILURE,
  LOAD_RECENTLY_ADDED_TRACKS_SUCCESS
} from './RecentlyAddedTracksActionTypes';

import BrowseServiceInstance from '../../services/BrowseService';

export const loadRecentlyAdded = () => {
  return dispatch => new Promise((resolve, reject) => {
    dispatch({
      type: LOAD_RECENTLY_ADDED_TRACKS,
    });
    return BrowseServiceInstance.loadRecentlyAdded().then(result => {
      dispatch({
        type: LOAD_RECENTLY_ADDED_TRACKS_SUCCESS,
        result: result
      });
      resolve(result);
    }).catch((result) => {
      dispatch({
        type: LOAD_RECENTLY_ADDED_TRACKS_FAILURE,
        error: result
      });
      reject(result);
    });
  });
};