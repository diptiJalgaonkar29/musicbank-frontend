import React, { useMemo, useState } from "react";
import MenuWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import { FormattedMessage } from "react-intl";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import "./DownloadCart.css";
import { useSelector } from "react-redux";

const DownloadCart = ({ showBasketDownload }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { tracksInDownloadBasket, tracksInDownloadProcess } = useSelector(
    (state) => state.downloadBasket
  );

  let pageHash = window.location.hash;

  const newTracksInDownloadCartLength = useMemo(() => {
    return tracksInDownloadBasket?.filter((data) => !data.isDownloadInProgress)
      ?.length;
  }, [JSON.stringify(tracksInDownloadBasket)]);

  return (
    <>
      <div
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className={`${
          isMobile ? "MobileNavbar--anchor" : "WebNavbar--anchor"
        } ${
          ["#/basket/", "#/download_basket_form/"].includes(pageHash)
            ? "activeNavlink"
            : ""
        }`}
      >
        {newTracksInDownloadCartLength > 0 && (
          <span className="download_cart_count download_cart_count_badge">
            {newTracksInDownloadCartLength}
          </span>
        )}
        <IconButtonWrapper icon="DownloadCart" />
      </div>
      <MenuWrapper
        id="download_cart_menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItemWrapper onClick={() => navigate("/basket/")}>
          <div className="download_cart_detail_container">
            <FormattedMessage id={"navbar.navItems.downloadCart"} />
            {newTracksInDownloadCartLength > 0 && (
              <span className="download_cart_count">
                {newTracksInDownloadCartLength}
              </span>
            )}
          </div>
        </MenuItemWrapper>
      </MenuWrapper>
    </>
  );
};

export default DownloadCart;
