import React, { useContext, useEffect } from "react";
//
import { useState } from "react";
//import getConfigJson from "../../../utils/getConfigJson";
import "./FooterLinks.css";
import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
//import getSuperBrandName from "../../../utils/getSuperBrandName";
import { getBrandAssetBaseUrl } from "../../../utils/getBrandAssetMeta";
//import { brandConstants } from "../../../utils/brandConstants";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";

const FooterLinks = () => {
  const [iudendaCookiePolicyId, setIudendaCookiePolicyId] = useState(null);
  const [appVersion, setAppVersion] = useState(null);
  const [iframeMeta, setIframeMeta] = useState({ title: null, link: null });
  //const superBrandName = getSuperBrandName();
  const { config } = useContext(BrandingContext);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  useEffect(() => {
    const id = setTimeout(() => {
      setIudendaCookiePolicyId(CONFIG.IUBENDA_COOKIE_POLICY_ID);
      setAppVersion(CONFIG.APP_VERSION);
    }, 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <a
        className="footer_link"
        onClick={() => {
          if (iudendaCookiePolicyId) {
            setIframeMeta({
              title: "Privacy Policy",
              link: `https://www.iubenda.com/privacy-policy/${iudendaCookiePolicyId}`,
            });
            handleClickOpen();
            // } else if (superBrandName === brandConstants?.SHELL) {
          } else if (config?.Modules?.isShellBrand) {
            setIframeMeta({
              title: "Privacy Policy",
              link: `${getBrandAssetBaseUrl()}/html/privacyPolicy.html`,
            });
            handleClickOpen();
          }
        }}
      >
        Privacy Policy
      </a>
      &nbsp;|&nbsp;
      <a
        className="footer_link"
        onClick={() => {
          console.log("iudendaCookiePolicyId", iudendaCookiePolicyId);
          if (iudendaCookiePolicyId) {
            setIframeMeta({
              title: "Terms and Conditions",
              link: `https://www.iubenda.com/terms-and-conditions/${iudendaCookiePolicyId}`,
            });
            handleClickOpen();
            //} else if (superBrandName === brandConstants?.SHELL) {
          } else if (config?.Modules?.isShellBrand) {
            setIframeMeta({
              title: "Terms and Conditions",
              link: `${getBrandAssetBaseUrl()}/html/termsAndCondition.html`,
            });
            handleClickOpen();
          }
        }}
      >
        Terms and Conditions
      </a>{" "}
      &nbsp;|&nbsp;
      <a
        className="footer_link"
        onClick={() => {
          if (iudendaCookiePolicyId) {
            setIframeMeta({
              title: "Cookie Policy",
              link: `https://www.iubenda.com/privacy-policy/${iudendaCookiePolicyId}/cookie-policy`,
            });
            handleClickOpen();
            //} else if (superBrandName === brandConstants?.SHELL) {
          } else if (config?.Modules?.isShellBrand) {
            setIframeMeta({
              title: "Cookie Policy",
              link: `${getBrandAssetBaseUrl()}/html/cookiePolicy.html`,
            });
            handleClickOpen();
          }
        }}
      >
        Cookie Policy
      </a>
      &nbsp;|&nbsp;
      <span className="footer_link" style={{ cursor: "default" }}>
        {appVersion}
      </span>
      <ModalWrapper
        isOpen={open}
        onClose={handleClose}
        title={iframeMeta.title}
        aria-labelledby="footer-dialog-title"
        className="footer-dialog"
      >
        <iframe src={iframeMeta.link} className="footer_modal_iframe" />
        <div className="footer_modal_container">
          <ButtonWrapper onClick={handleClose}>Close</ButtonWrapper>
        </div>
      </ModalWrapper>
    </>
  );
};

// const FooterLinksWithRouter = withRouterCompat(FooterLinks);

export default FooterLinks;
