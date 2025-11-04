import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BrandingContext } from "../../../branding/provider/BrandingContext";
import "../../../_styles/NavBar.css";
import "../../../_styles/Theming/__TYPOGRAPHY.css";
import NavItemsV2 from "./NavItemsV2";
import { ASSET_PATHS, getBrandAssetPath } from "../../utils/getBrandAssetMeta";
import AsyncService from '../../../networking/services/AsyncService';
import SonicProfile from '../SonicProfile/SonicProfile';

const Navbar = ({ isUnregistered = false }) => {
  const navigate = useNavigate();
  const { config } = useContext(BrandingContext);
  const [showSonicProfile, setShowSonicProfile] = useState(false);
  const [sonicProfileData, setSonicProfileData] = useState("");
  const [showSonicProfileMenu, setShowSonicProfileMenu] = useState(false);
  const brandId = BrandingContext._currentValue?.config?.brandId || localStorage.getItem("brandId");

  const redirectHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!sonicProfileData) {
      AsyncService.loadData(`/brand/brand_profile_data/${brandId}`)
        .then((response) => {
          console.log("NavBar--sonicprofile ", response);
          setSonicProfileData(response);
          setShowSonicProfileMenu(response.data.sonicProfile == "0" ? true : false)
        })
        .catch((error) => {
          console.log("sonic profile error", error)
          setShowSonicProfileMenu(false);
          setSonicProfileData("")
        })
    }
  }, [sonicProfileData]);

  const handleSonicProfileView = () => {
    console.log("handleSonicProfileView---", showSonicProfile)
    setShowSonicProfile(true);
  }

  const renderLogo = () => {
    return (
      <div
        className="navbar__logo__container"
        onClick={!isUnregistered ? redirectHome : () => { }}
        style={{ height: "100%" }}
      >
        <img
          src={getBrandAssetPath(ASSET_PATHS?.NAV_LOGO_PATH)}
          alt="Company_Logo"
        />
        {config?.modules?.isShellBrand && (
          <span className="nav_logo_text boldFamily">AI Voice Generator</span>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="navbar__container">
        {renderLogo()}
        {!isUnregistered &&
          (<NavItemsV2
            configModules={config.modules}
            showSonicProfileMenu={showSonicProfileMenu}
            setShowSonicProfile={setShowSonicProfile}
            handleSonicProfileView={handleSonicProfileView}
          />)}
      </nav>
      {
        showSonicProfile && (
          <SonicProfile
            sonicProfileData={sonicProfileData}
            showSonicProfile={showSonicProfile}
            onClose={() => setShowSonicProfile(false)} />
        )

      }

    </>
  );
};

export default Navbar;
