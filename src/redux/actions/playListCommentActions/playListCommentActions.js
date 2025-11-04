import {
  END_FETCHING_COMMENTS,
  GET_ALL_COMMENTS_BY_PLAYLIST_ID,
  GET_ALL_COMMENTS_BY_PLAYLIST_ID_AND_TIMESTAMP,
  START_FETCHING_COMMENTS,
} from '../../constants/actionTypes.js';
import { showError } from '../notificationActions/index.js';
import ChatService from '../../../playlist/services/ChatService';

export const saveGetAllComments = (data) => {
  return {
    type: GET_ALL_COMMENTS_BY_PLAYLIST_ID,
    data,
  };
};

export const getAllCommentsByPlaylistID = (
  playlistId,
  isUnRegistered,
  _validateFor
) => {
  return (dispatch) => {
    dispatch(startFetchingComments());
    return new Promise((resolve, reject) => {
      if (isUnRegistered) {
        ChatService.getAllByPlaylistIdUnregistered(playlistId, _validateFor)
          .then((result) => {
            dispatch(saveGetAllComments(result));
            resolve(result);
          })
          .catch((err) => {
            dispatch(endFetchingComments());
            reject(err);
          });
      } else {
        ChatService.getAllByPlaylistId(playlistId)
          .then((result) => {
            dispatch(saveGetAllComments(result));
            resolve(result);
          })
          .catch((err) => {
            dispatch(endFetchingComments());
            reject(err);
          });
      }
    });
  };
};

export const saveAllCommentsSince = (data) => {
  return {
    type: GET_ALL_COMMENTS_BY_PLAYLIST_ID_AND_TIMESTAMP,
    data,
  };
};

export const startFetchingComments = () => {
  return {
    type: START_FETCHING_COMMENTS,
  };
};
export const endFetchingComments = () => {
  return {
    type: END_FETCHING_COMMENTS,
  };
};

export const getAllCommentsByPlaylistIDAndTimestamp = (
  playlistId,
  timestamp
) => {
  return (dispatch) => {
    ChatService.getAllByPlaylistIdAndLastSyncTime(playlistId, timestamp)
      .then((result) => {
        dispatch(saveAllCommentsSince(result));
      })
      .catch(() => {
        dispatch(showError('Something went wrong fetching the Comments'));
        dispatch(endFetchingComments());
      });
  };
};
