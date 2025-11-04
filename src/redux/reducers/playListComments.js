import {
  GET_ALL_COMMENTS_BY_PLAYLIST_ID_AND_TIMESTAMP,
  GET_ALL_COMMENTS_BY_PLAYLIST_ID,
  START_FETCHING_COMMENTS,
  END_FETCHING_COMMENTS,
} from '../constants/actionTypes';
import { updateObject } from '../../common/utils/utility';

const initialState = {
  allComments: null,
  updatedComments: null,
  loadingComments: false,
};

const getAllComments = (state, action) => {
  return updateObject(state, {
    allComments: action.data,
    loadingComment: false,
  });
};
const getAllCommentsSince = (state, action) => {
  return updateObject(state, {
    updatedComments: action.data,
  });
};

const startLoadingComments = (state) => {
  return updateObject(state, {
    loadingComments: true,
  });
};
const endLoadingComments = (state) => {
  return updateObject(state, {
    loadingComments: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_ALL_COMMENTS_BY_PLAYLIST_ID:
    return getAllComments(state, action);
  case GET_ALL_COMMENTS_BY_PLAYLIST_ID_AND_TIMESTAMP:
    return getAllCommentsSince(state, action);
  case START_FETCHING_COMMENTS:
    return startLoadingComments(state, action);
  case END_FETCHING_COMMENTS:
    return endLoadingComments(state, action);

  default:
    return state;
  }
};

export default reducer;
