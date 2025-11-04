import {
  TOGGLE_NEWSEARCH_DIALOG,
  SET_DEVICE_TYPE
} from '../constants/actionTypes';
const { v4: uuidv4 } = require('uuid');

const initialState = {
  newSearchModalOpen: false,
  deviceType: null,
  id: null
};

export default function(state = initialState, action) {
  switch (action.type) {
  case TOGGLE_NEWSEARCH_DIALOG: {
    const uiqID = uuidv4();
    return {
      ...state,
      newSearchModalOpen: !state.newSearchModalOpen,
      id: uiqID
    };
  }
  case SET_DEVICE_TYPE: {
    return {
      ...state,
      deviceType: action.deviceType
    };
  }

  default:
    return state;
  }
}
