import React, { useState, useEffect, useContext } from "react";
import { IntlProvider } from "react-intl";
import { flattenMessages } from "../../common/utils/messagesUtils";
import BrandingService from "../BrandingService";
import { BrandingContext } from "./BrandingContext";
import StylingProvider from "./StylingProvider";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { useWPPOs, WPPOsProvider } from "../wpp/GetWPPOsContextData";
import getWPPThemeJson from "../wpp/theme/getWPPThemeJson";
import loadConfigJson from "../../common/utils/loadConfigJson";
import { setConfigJson } from "../../redux/actions/configJsonActions/configJsonActions";
import { brandConstants } from "../../common/utils/brandConstants";
import { createTheme } from "@wppopen/components-library";
import "@wppopen/components-library/dist/platform-ui-kit/wpp-theme.css";

import { store } from "../../redux/stores/store";
//import { setConfigJson } from "../../redux/actions/configJsonActions/configJsonActions";

const BrandingProviderWPP = ({ children }) => {
  const [config, setConfig] = useState({ isDefault: true });
  const [messages, setMessages] = useState({ isDefault: true });
  const [jsonConfig, setJsonConfig] = useState({ isDefault: true });
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState({});
  const [isBrandNameUpdate, setIsBrandNameUpdate] = useState(false);

  let superBrandName = getSuperBrandName();

  const { osContext, osApi, osToken } = useWPPOs() || {};
  console.log("BrandingProviderWPP:: ---::", osContext, osApi, osToken);

  let shouldUseOsContext =
    superBrandName === brandConstants.WPP &&
      process.env.NODE_ENV === "production" &&
      osContext !== null &&
      osContext !== undefined &&
      osToken !== null
      ? true
      : false;

  console.log("BrandingProviderWPP::shouldUseOsContext", shouldUseOsContext);
  useEffect(() => {
    setIsLoading(true);
    BrandingService.getWPP().then(async (result) => {
      console.log("BrandingProviderWPP::result", result);
      let configResult = result[0];
      let messagesResult = result[1];
      let themeResult;
      let wppThemeOriginal;

      if (shouldUseOsContext) {
        let themeObj = getWPPThemeJson(osContext);
        console.log("BrandingProviderWPP::themeObj", themeObj);
          console.log("##WPP wppTheme osContext", osContext);

        try {          
          const wppTheme = createTheme(osContext?.theme);
          console.log("##WPP wppTheme JSON", wppTheme);

        } catch (error) {
          console.log("##WPP wppTheme Catch ", error);
        }

         try {          
          wppThemeOriginal = createTheme(osContext?.originalTheme);
          console.log("##WPP wppThemeOriginal JSON", wppThemeOriginal);

        } catch (error) {
          console.log("##WPP wppThemeOriginal Catch ", error);
        }

        /* try {
          const WPPThemeData = createTheme(osContext?.themeData);
          console.log("##WPP WPPThemeData JSON", WPPThemeData);
        } catch (error) {
          console.log("##WPP WPPThemeData Catch ", error);
        } */



        //themeResult = themeObj;
        themeResult = {... themeObj, ...wppThemeOriginal}
      } else {
        themeResult = result[0]?.theme;
        console.log("BrandingProviderWPP::themeObj else", themeResult);
      }

      const jsonConfig = result[0]?.config; //await loadConfigJson();

      if (!!jsonConfig?.CS_IFRAME_URL) {
        embedCSIframe(jsonConfig.CS_IFRAME_URL);
      }

      // const jsonConfig = await loadConfigJson();
      // store.dispatch(setConfigJson(jsonConfig));

      //updateStateAndFonts(configResult, themeResult, messagesResult);
      updateStatesAndCallSetBodyFonts1(
        configResult,
        themeResult,
        messagesResult,
        jsonConfig
      );
    });
  }, []); // Empty dependency array means this effect runs once on mount

  const updateBrandThemeConfig = async () => {
    setIsLoading(true);

    try {
      const result = await BrandingService.getWPP();
      console.log("updateBrandThemeConfig::result", result);

      const configResult = result[0];
      const messagesResult = result[1];
      let themeResult;

      if (shouldUseOsContext) {
        let themeObj = getWPPThemeJson(osContext);
        console.log("BrandingProviderWPP::themeObj", themeObj);
        themeResult = themeObj;
      } else {
        themeResult = result[0]?.theme;
        console.log("BrandingProviderWPP::themeObj else", themeResult);
      }

      const jsonConfig = result[0]?.config;

      if (!!jsonConfig?.CS_IFRAME_URL) {
        embedCSIframe(jsonConfig.CS_IFRAME_URL);
      }

      await updateStatesAndCallSetBodyFonts1(
        configResult,
        themeResult,
        messagesResult,
        jsonConfig
      );

      setIsBrandNameUpdate((prev) => !prev);

      // ✅ return success for chaining
      return true;
    } catch (error) {
      console.error("updateBrandThemeConfig error:", error);
      // ✅ rethrow for catch()
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  async function updateStatesAndCallSetBodyFonts1(
    configResult,
    themeResult,
    messagesResult,
    jsonConfig
  ) {
    console.log(
      "BrandingProviderWPP::updateStatesAndCallSetBodyFonts1:::configResult",
      configResult
    );
    await Promise.all([
      setConfig(configResult),
      setTheme(themeResult),
      setMessages(messagesResult),
      setJsonConfig(jsonConfig),
      setIsLoading(false),
    ]);

    setBodyFonts();
  }

  // const updateStateAndFonts = (configResult, themeResult, messagesResult) => {
  //   this.setState(
  //     {
  //       config: configResult,
  //       theme: themeResult,
  //       messages: messagesResult,
  //       isLoading: false,
  //       osContext: osContext,
  //       osApi: osApi,
  //       osToken: osToken,
  //     },
  //     () => {
  //       setBodyFonts();
  //     }
  //   );
  // };

  const embedCSIframe = (csIframeUrl) => {
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("id", "CS-iframe");
    ifrm.setAttribute("src", csIframeUrl);
    ifrm.style.display = "none";
    ifrm.style.position = "relative";
    ifrm.style.zIndex = -10;
    document.body.appendChild(ifrm);
  };

  const setBodyFonts = () => {
    console.log("BrandingProviderWPP::setBodyFonts:::config", config.fonts);
    var fonts = document.createElement("style");
    fonts.appendChild(document.createTextNode(config.fonts));
    document.head.appendChild(fonts);
  };

  const renderLoading = () => (
    <div
      style={{
        backgroundColor: "#000",
        height: "100vh",
        color: "var(--color-white)",
      }}
    >
      Loading...
    </div>
  );

  if (isLoading) {
    return renderLoading();
  }

  const state = {
    config,
    messages,
    theme,
    jsonConfig,
    osContext,
    osApi,
    osToken,
    updateBrandThemeConfig,
  };

  return (
    <BrandingContext.Provider value={state}>
      <IntlProvider locale="en" messages={flattenMessages(messages)}>
        <StylingProvider stylingVariables={theme}>{children}</StylingProvider>
      </IntlProvider>
    </BrandingContext.Provider>
  );
};

export default BrandingProviderWPP;
