import {
  TOGGLE_NEWSEARCH_DIALOG,
  SET_DEVICE_TYPE
} from '../../constants/actionTypes';

export const toggleModalView = () => {
  return {
    type: TOGGLE_NEWSEARCH_DIALOG
  };
};
export const generateNewSearchId = () => {
  return {
    type: TOGGLE_NEWSEARCH_DIALOG
  };
};
export const setDeviceType = deviceType => {
  return {
    type: SET_DEVICE_TYPE,
    deviceType: deviceType
  };
};
