import React, { useState } from "react";
import MenuWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import { FormattedMessage } from "react-intl";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import ReportBug from "../../ReportBug/ReportBug";
import "./HelpMenu.css";
import { Divider } from "@mui/material";
import ToolTipWrapper from "../../../../branding/componentWrapper/ToolTipWrapper";

const HelpMenu = ({ showReportEnquiryModal }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  let pageHash = window.location.hash;

  return (
    <>
      <div
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className={`${
          isMobile ? "MobileNavbar--anchor" : "WebNavbar--anchor"
        } ${
          [
            "#/documents/guidelines",
            "#/documents/templates",
            "#/documents/faq",
          ].includes(pageHash)
            ? "activeNavlink"
            : ""
        }`}
      >
        <ToolTipWrapper title={"Help and Resources"}>
          <IconButtonWrapper icon="Help" />
        </ToolTipWrapper>
      </div>
      <MenuWrapper
        id="search_menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {showReportEnquiryModal && (
          <MenuItemWrapper>
            <ReportBug />
            <Divider style={{ backgroundColor: "var(--color-canvas-light)" }} />
          </MenuItemWrapper>
        )}
        <MenuItemWrapper onClick={() => navigate("/documents/")}>
          <FormattedMessage id={"navbar.navItems.documents"} />
        </MenuItemWrapper>
      </MenuWrapper>
    </>
  );
};

export default HelpMenu;
