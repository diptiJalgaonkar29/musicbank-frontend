// videoUploadReducer.js
import { RESET_VIDEO_UPLOAD, SET_VIDEO_UPLOAD } from '../constants/actionTypes';

const initialState = {
  mediaFile: null,
};

const videoUploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIDEO_UPLOAD:
      return {
        ...state,
        mediaFile: action.payload.mediaFile,
      };
    case RESET_VIDEO_UPLOAD:
      return initialState;
    default:
      return state;
  }
};

export default videoUploadReducer;
