import {
  LOAD_POPULAR_TRACKS,
  LOAD_POPULAR_TRACKS_FAILURE,
  LOAD_POPULAR_TRACKS_SUCCESS
} from './PopularTracksActionTypes';

import BrowseServiceInstance from '../../services/BrowseService';

export const loadPopular = () => {
  return dispatch => new Promise((resolve, reject) => {
    dispatch({
      type: LOAD_POPULAR_TRACKS,
    });
    return BrowseServiceInstance.loadPopular().then(result => {
      dispatch({
        type: LOAD_POPULAR_TRACKS_SUCCESS,
        result: result
      });
      resolve(result);
    }).catch((result) => {
      dispatch({
        type: LOAD_POPULAR_TRACKS_FAILURE,
        error: result
      });
      reject(result);
    });
  });
};