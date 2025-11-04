import { RESET_CONFIG_JSON, SET_CONFIG_JSON } from "../constants/actionTypes";

const intialState = {};

const configJson = (state = intialState, { type, payload = {} }) => {
  switch (type) {
    case SET_CONFIG_JSON:
      return { ...state, ...payload };
    case RESET_CONFIG_JSON:
      return intialState;
    default:
      return state;
  }
};

export default configJson;
