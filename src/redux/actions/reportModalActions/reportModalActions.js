import { OPEN_CLOSE_REPORT_MODAL } from "../../constants/actionTypes";

export const setIsReportModalOpen = (isOpen) => {
  return {
    type: OPEN_CLOSE_REPORT_MODAL,
    payload: isOpen,
  };
};
