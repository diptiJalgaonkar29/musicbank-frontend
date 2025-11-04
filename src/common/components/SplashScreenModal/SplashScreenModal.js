import React, { useContext, useEffect, useState } from "react";
import "./SplashScreenModal.css";
import getConfigJson from "../../utils/getConfigJson";
import getClientMeta from "../../utils/getClientMeta";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const SplashScreenModal = () => {
  const [isSplashScreenModalOpen, setIsSplashScreenModalOpen] = useState(false);
  const [SplashScreenMsg, setSplashScreenMsg] = useState("");
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  useEffect(() => {
    try {
      let detectedBrowser = getClientMeta().browserName;
      const {
        SHOW_SPLASH_SCREEN,
        APP_SUPPORTED_BROWSER_LIST,
        SPLASH_SCREEN_TEXT,
      } = CONFIG;
      // console.log("detectedBrowser", detectedBrowser);
      if (
        !APP_SUPPORTED_BROWSER_LIST?.includes(detectedBrowser) &&
        SHOW_SPLASH_SCREEN
      ) {
        setSplashScreenMsg(SPLASH_SCREEN_TEXT);
        setIsSplashScreenModalOpen(true);
        document.body.style.pointerEvents = "none";
      }
    } catch (error) {
      console.log("SplashScreenModal.js : error ::", error);
    }
  }, []);

  const onClose = () => {
    setIsSplashScreenModalOpen(false);
  };

  return (
    <ModalWrapper
      isOpen={isSplashScreenModalOpen}
      onClose={onClose}
      title={"Welcome to Sonic Hub!"}
      className="splash_screen"
      disableCloseIcon
    >
      <p className="splash_screen_text">{SplashScreenMsg}</p>
    </ModalWrapper>
  );
};

export default SplashScreenModal;
