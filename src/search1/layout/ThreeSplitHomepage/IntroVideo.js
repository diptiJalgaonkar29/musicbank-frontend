import React from "react";
import "./IntroVideo.css";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { FormattedMessage } from "react-intl";
import { useRef, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import getConfigJson from "../../../common/utils/getConfigJson";

const IntroVideo = () => {
  const videoRef = useRef(null);
  const { config, jsonConfig: CONFIG } = useContext(BrandingContext);
  const [isFirstTimeLoggedIn, setisFirstTimeLoggedIn] = useState(false);

  useEffect(() => {
    // console.log("Cookies.get(is-first-login)", Cookies.get("is-first-login"));
    var cookieIsFirstLogin = Cookies.get("is-first-login") === "true";
    setisFirstTimeLoggedIn(cookieIsFirstLogin);
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  useEffect(() => {
    if (!isFirstTimeLoggedIn) return;
    document.body.style.overflowY = "hidden";
    try {
      let custIntroVideoDialogBgEle = document.getElementById(
        "custIntroVideoDialogBg"
      );
      let introTextEle = document.getElementById("introText");
      custIntroVideoDialogBgEle.style.display = "none";
      setTimeout(() => {
        introTextEle.style.display = "none";
        custIntroVideoDialogBgEle.style.display = "flex";
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        const promise = videoRef.current.play();
        if (promise !== undefined) {
          promise
            .then(() => {})
            .catch((error) => {
              console.log("error", error);
              videoRef.current.muted = true;
              videoRef.current.play();
            });
        }
      }, 3000);
    } catch (error) {
      console.log("Error", error);
      document.body.style.overflowY = "auto";
    }
  }, [isFirstTimeLoggedIn]);

  const CloseVideoDialog = () => {
    document.getElementById("custIntroVideoDialogContainer").style.display =
      "none";
    Cookies.set("is-first-login", false, {
      path: "/",
      SameSite: "Strict",
      expires: 365,
    });
    document.getElementById("introvid").pause();
    document.body.style.overflowY = "auto";
    setisFirstTimeLoggedIn(false);
  };

  if (!config.modules.ShowIntroVideo || !isFirstTimeLoggedIn) {
    return <></>;
  }

  return (
    <>
      <div
        className="custIntroVideoDialogContainer"
        id="custIntroVideoDialogContainer"
      >
        <h3 className="main-title-tsp" id="introText">
          <FormattedMessage id="home.page.titleMain" />
          <span className="main-subtitle boldFamily">
            <FormattedMessage id="home.page.titleSubtext" />
          </span>
          <span className="main-subtitle-Highlight boldFamily">
            <FormattedMessage
              id="home.page.titleSubtextHighlight"
              className="titleSubHighlight"
            />
          </span>
          <span className="main-subtitle boldFamily">.</span>
        </h3>

        <div className="custIntroVideoDialogBg" id="custIntroVideoDialogBg">
          <div className="custIntroVideoDialog">
            <video
              id="introvid"
              controls
              onEnded={CloseVideoDialog}
              onError={CloseVideoDialog}
              ref={videoRef}
              controlsList="nodownload noplaybackrate"
              src={`${document.location.origin}${CONFIG?.INTRO_VIDEO_RELATIVE_PATH}`}
            />
          </div>
        </div>
        <div className="custIntroVideoDialogFadeBg"></div>
      </div>
    </>
  );
};

export default IntroVideo;
