import { OPEN_CLOSE_REPORT_MODAL } from "../constants/actionTypes";

const intialState = {
  isReportModalOpen: false,
};

const setIsReportModalOpen = (state = intialState, { type, payload }) => {
  switch (type) {
    case OPEN_CLOSE_REPORT_MODAL:
      return { ...state, isReportModalOpen: payload };

    default:
      return state;
  }
};

export default setIsReportModalOpen;
