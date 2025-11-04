import React, { useState } from "react";
import MenuWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import { FormattedMessage } from "react-intl";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";

const SearchMenu = ({ isSuperSearchEnabled, isSimilaritySearchEnabled }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  if (!isSuperSearchEnabled && !isSimilaritySearchEnabled) {
    return <></>;
  }

  let pageHash = window.location.hash;

  return (
    <>
      <div
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className={`${
          isMobile ? "MobileNavbar--anchor" : "WebNavbar--anchor"
        } ${
          ["#/similar_tracks/", "#/supersearch/"].includes(pageHash)
            ? "activeNavlink"
            : ""
        }`}
      >
        <FormattedMessage id="navbar.navItems.searchMenu" />
      </div>
      <MenuWrapper
        id="search_menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {isSuperSearchEnabled && (
          <MenuItemWrapper onClick={() => navigate("/supersearch/")}>
            <FormattedMessage id="navbar.navItems.supersearch" />
            <Divider style={{ backgroundColor: "var(--color-canvas-light)" }} />
          </MenuItemWrapper>
        )}
        {isSimilaritySearchEnabled && (
          <MenuItemWrapper onClick={() => navigate("/similar_tracks/")}>
            <FormattedMessage id="navbar.navItems.SimilaritySearch" />
          </MenuItemWrapper>
        )}
      </MenuWrapper>
    </>
  );
};

export default SearchMenu;
