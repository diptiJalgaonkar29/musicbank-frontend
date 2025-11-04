import {
  SET_CONFIG_JSON,
  RESET_CONFIG_JSON,
} from "../../constants/actionTypes";

export const setConfigJson = (data) => {
  return {
    type: SET_CONFIG_JSON,
    payload: data,
  };
};

export const resetConfigJson = () => {
  return {
    type: RESET_CONFIG_JSON,
  };
};
