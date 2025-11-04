import {
  RESET_COMMON_MESSAGE,
  SET_COMMON_MESSAGE,
  SET_IS_OPEN_COMMON_MESSAGE_MODAL,
} from "../constants/actionTypes";

const intialState = {
  commonMessage: { title: "", body: "" },
  isOpenCommonMessageModal: false,
};

const commonMessageModalMeta = (state = intialState, { type, payload }) => {
  switch (type) {
    case SET_COMMON_MESSAGE:
      return { ...state, commonMessage: payload };
    case SET_IS_OPEN_COMMON_MESSAGE_MODAL:
      return { ...state, isOpenCommonMessageModal: payload };
    case RESET_COMMON_MESSAGE:
      return intialState;

    default:
      return state;
  }
};

export default commonMessageModalMeta;
