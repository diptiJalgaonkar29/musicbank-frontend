import React, { useContext, useEffect, useState } from "react";
import MenuWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import { FormattedMessage } from "react-intl";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import "./ProfileMenu.css";
import { Divider } from "@mui/material";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import AsyncService from "../../../../networking/services/AsyncService";
import { getUserMeta } from "../../../utils/getUserAuthMeta";
import { useDispatch } from "react-redux";
import { resetCustomTrackForm } from "../../../../redux/actions/customTrackForm/customTrackForm";
import { brandConstants } from "../../../utils/brandConstants";
import getSuperBrandName from "../../../utils/getSuperBrandName";

const ProfileMenu = ({ showProfile, showLogout }) => {
  const [anchorEl, setisMenuOpen] = useState(false);
  const [bName, setBName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateSuperBrandThemeConfig } = useContext(BrandingContext);

  let pageHash = window.location.hash;

  // const getBrandNameFromAPI = () => {
  //   AsyncService.loadData("brand/getSuperBrandName")
  //     .then((response) => {
  //       setBName(response?.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const { brandName } = getUserMeta();
  let superBrandName = getSuperBrandName();
  // useEffect(() => {
  // getBrandNameFromAPI();
  // }, []);

  return (
    <>
      <div
        onClick={(e) => setisMenuOpen(e.currentTarget)}
        className={`${
          isMobile ? "MobileNavbar--anchor" : "WebNavbar--anchor"
        } ${
          ["#/profile", "#/logout"].includes(pageHash) ? "activeNavlink" : ""
        }`}
      >
        <IconButtonWrapper icon="Profile" />
      </div>
      <MenuWrapper
        id="profile_menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setisMenuOpen(false)}
      >
        {showProfile && (
          <MenuItemWrapper
            style={{
              color: "var(--color-primary) !important",
              fontWeight: "bold",
            }}
            onClick={() => {
              dispatch(resetCustomTrackForm());
              if (superBrandName !== brandConstants.WPP) {
                updateSuperBrandThemeConfig()
                  .then(() => {
                    console.log("theme loaded");
                  })
                  .catch((error) => console.log("error", error));

                navigate("/select-brand?reload=1");
              } else {
                localStorage.setItem("pathname", "/select-brand");
                navigate("/select-brand");
              }

              // window.open("/#/select-brand", "_self");
              // window.location.href = "/#/select-brand";
            }}
          >
            <FormattedMessage id="navbar.navItems.switchBrand" />
          </MenuItemWrapper>
        )}
        {showProfile && (
          <MenuItemWrapper onClick={() => navigate("/profile")}>
            <FormattedMessage id={"navbar.navItems.profile"} />
            <Divider style={{ backgroundColor: "var(--color-canvas-light)" }} />
          </MenuItemWrapper>
        )}
        {showLogout && (
          <MenuItemWrapper onClick={() => navigate("/logout")}>
            <FormattedMessage id="navbar.navItems.logout"></FormattedMessage>
          </MenuItemWrapper>
        )}
      </MenuWrapper>
    </>
  );
};

export default ProfileMenu;
