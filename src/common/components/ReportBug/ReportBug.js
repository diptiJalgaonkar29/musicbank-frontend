import React from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { setIsReportModalOpen } from "../../../redux/actions/reportModalActions";

export default function ReportBug() {
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    dispatch(setIsReportModalOpen(true));
  };

  return (
    <div
      aria-haspopup="true"
      onClick={handleClickOpen}
      className={`reportBugContainer`}
      id={`reportBugContainer`}
    >
      <FormattedMessage id="navbar.navItems.reportEnquiry"></FormattedMessage>
    </div>
  );
}
