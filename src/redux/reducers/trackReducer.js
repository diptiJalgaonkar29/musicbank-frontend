// reducers/trackReducer.js

import { SET_TRACK_DATA } from "../actions/trackActions/trackActions";

const initialState = {
  trackData: null,
};

const trackReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRACK_DATA:
      return {
        ...state,
        trackData: action.payload,
      };
    default:
      return state;
  }
};

export default trackReducer;
