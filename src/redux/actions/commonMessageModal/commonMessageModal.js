import {
  SET_COMMON_MESSAGE,
  RESET_COMMON_MESSAGE,
  SET_IS_OPEN_COMMON_MESSAGE_MODAL,
} from "../../constants/actionTypes";

export const setCommonMessage = (data) => {
  return {
    type: SET_COMMON_MESSAGE,
    payload: data,
  };
};

export const resetCommonMessage = (data) => {
  return {
    type: RESET_COMMON_MESSAGE,
    payload: data,
  };
};

export const setIsOpenCommonMessageModal = (data) => {
  return {
    type: SET_IS_OPEN_COMMON_MESSAGE_MODAL,
    payload: data,
  };
};
