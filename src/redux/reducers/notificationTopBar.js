import {
  RESET_NOTIFICATION_TOP_BAR,
  SET_NOTIFICATION_TOP_BAR,
} from "../constants/actionTypes";

const notificationTopBar = (
  state = {
    isVisible: false,
    isClosed: false,
    msg: "",
  },
  action
) => {
  switch (action.type) {
    case SET_NOTIFICATION_TOP_BAR:
      return {
        ...state,
        ...action?.payload,
      };
    case RESET_NOTIFICATION_TOP_BAR:
      return {
        isVisible: false,
        isClosed: false,
        msg: "",
      };
    default:
      return state;
  }
};

export default notificationTopBar;
