// videoUploadActions.js
import { RESET_VIDEO_UPLOAD, SET_VIDEO_UPLOAD } from '../../constants/actionTypes';

export const setVideoUpload = (mediaFile) => {
  return {
    type: SET_VIDEO_UPLOAD,
    payload: {
      mediaFile,
    },
  };
};


export const resetVideoUpload = () => {
  return {
    type: RESET_VIDEO_UPLOAD,
  };
};
