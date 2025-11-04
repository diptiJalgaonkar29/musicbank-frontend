import React, { useContext, useState, useEffect } from "react";
//import "./ReportBugModal.css";
import getConfigJson from "../../utils/getConfigJson";
import bytesToMegaBytes from "../../utils/bytesToMegaBytes";
import AsyncService from "../../../networking/services/AsyncService";
import getClientMeta from "../../utils/getClientMeta";
import { FormattedMessage } from "react-intl";
import { SpinnerDefault } from "../Spinner/Spinner";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import FullScreenModalWrapper from '../../../branding/componentWrapper/FullScreenModalWrapper';
import { useDispatch, useSelector } from "react-redux";
import { setIsReportModalOpen } from "../../../redux/actions/reportModalActions";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

/* curl--location 'http://localhost:3002/api/brand/brand_profile_data/1' \
--header 'brandId: 2' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoic29uaWNodWJkZW1vMi5zdXBlcmFkbWluQHdpdHMuYnoiLCJ1c2VyX25hbWUiOiJzb25pY2h1YmRlbW8yLnN1cGVyYWRtaW5Ad2l0cy5ieiIsImxhc3RfbG9naW5fdGltZV9zdGFtcCI6IjIwMjUtMDktMjBUMDg6NDk6MjgiLCJ1c2VyX3JvbGVzIjpbIlJPTEVfU1VQRVJfQURNSU4iXSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9TVVBFUl9BRE1JTiJdLCJjbGllbnRfaWQiOiJyZXN0LWNsaWVudCIsImlzX3BlcnNvbmFsaXplZF90cmFja2luZ19hbGxvd2VkIjpmYWxzZSwidXNlcl9pZCI6MSwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sInVzZXJfZnVsbF9uYW1lIjoic3VwZXJBZG1pbk1hc3RlcmNhcmRVc2VyIiwiZXhwIjoxNzU5NTc1ODk1LCJ1c2VyX3JlZ2lzdGVyX3N0YXR1cyI6dHJ1ZSwiZXhwaXJlc19pbiI6ODQwMDAsImNzX3V1aWQiOiI2MWY5YWNhYy01Y2ZhLTRhMDQtOGJlYi00ZmQ3ZGQzYTFkOTEiLCJqdGkiOiJDRDkxMm9UUk5lUmRKUG5WV3R5R25hZU9fNzgiLCJzc19hY2Nlc3MiOnRydWV9.NBWwMQq1_gLTxybu8PDwxIUyRF6sjcbWZs7km5Le81Q' */


const SonicProfile = (props) => {
  console.log("show sonic profile", props)

  //const [isSonicProfileOpen, setIsSonicProfileOpen] = useState(props.showSonicProfile);
  //const [isLoading, setIsLoading] = useState(false);
  //const [sonicProfileHTML, setSonicProfileHTML] = useState("");

  //const brandId = BrandingContext._currentValue?.config?.brandId || localStorage.getItem("brandId");

  function getRootCSSVariables() {
    const styles = getComputedStyle(document.documentElement);
    const cssVars = {};

    for (let i = 0; i < styles.length; i++) {
      const name = styles[i];
      //temporary adding font here, we can add more styles if needed
      if (name == "--font-primary") {
        cssVars[name] = styles.getPropertyValue(name).trim();
      }
    }
    return cssVars;
  }

  function buildRootCSSVariablesStyleTag() {
    const styles = getComputedStyle(document.documentElement);
    const vars = {};
    for (let i = 0; i < styles.length; i++) {
      const name = styles[i];
      //if (name.startsWith('--')) vars[name] = styles.getPropertyValue(name).trim();
      if (name == "--font-primary") vars[name] = styles.getPropertyValue(name).trim();
    }

    // Convert to CSS string
    let cssString = ':root {\n';
    Object.entries(vars).forEach(([key, value]) => {
      cssString += `  ${key}: ${value};\n`;
    });
    cssString += `body {
      font-family: var(--font-primary, 'MyBrandFont'), sans-serif;
    }`
    cssString += '}\n';

    return { cssVarsStyleTag: `<style>${cssString}</style>`, vars };
  }


  const { cssVarsStyleTag, vars } = buildRootCSSVariablesStyleTag();
  const fontName = vars["--font-primary"]?.replace(/['"]/g, "").split(",")[0].trim();

  let fontLinkTag = "";
  if (fontName) {
    fontLinkTag = `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}&display=swap" rel="stylesheet">`;
  }

  const onClose = () => {
    console.log("onclose ")
    props.onClose();
  };

  const fullHTML = `
    <html>
      <head>
      ${fontLinkTag}
      ${cssVarsStyleTag}
        ${props.sonicProfileData.data.sonicProfileStyleData || ""}
        
      </head>
      <body>
        ${props.sonicProfileData.data.sonicProfileData || ""}
      </body>
    </html>
  `;

  if (props.sonicProfileData === "") {
    return (
      <div><p>Sonic Profile data not available</p></div>
    )
  }
  else {
    return (
      <FullScreenModalWrapper
        isOpen={props.showSonicProfile}
        onClose={() => { onClose() }}
        title=""
        className="sonicprofile-fullscreen-modal"
        disableOutsideClick={false}
        withTitle={false}
      >
        <div className='sonicprofile-container' style={{ height: "100%", display: "flex" }}>
          {props.sonicProfileData && (
            <>
              <iframe
                title="Sonic Profile"
                className='sonicprofile-containerFrame'
                style={{
                  width: "100%",
                  border: "none",
                  background: "white",
                }}
                srcDoc={fullHTML}
              />
            </>
          )}
        </div>
      </FullScreenModalWrapper>
    );

  }






};

export default SonicProfile;
