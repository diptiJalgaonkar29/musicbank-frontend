import Axios from "axios";
import getSuperBrandName from "../common/utils/getSuperBrandName";
import loadConfigJson from "../common/utils/loadConfigJson";
import AsyncService from "../networking/services/AsyncService";
import {
  ASSET_PATHS,
  getBrandAssetPath,
} from "../common/utils/getBrandAssetMeta";
import getSuperBrandId from "../common/utils/getSuperBrandId";
import axios from "axios";

const fetchFont = async () => {
  const lightFontUrl = getBrandAssetPath(ASSET_PATHS.LIGHT_FONT_PATH);
  const mediumFontUrl = getBrandAssetPath(ASSET_PATHS.MEDIUM_FONT_PATH);
  const boldFontUrl = getBrandAssetPath(ASSET_PATHS.BOLD_FONT_PATH);

  console.log("lightFontUrl", lightFontUrl);
  console.log("mediumFontUrl", mediumFontUrl);
  console.log("boldFontUrl", boldFontUrl);

  try {
    const style = document.createElement("style");
    style.innerHTML = `
    @font-face {
      font-family: 'font-light';
      src: url('${lightFontUrl}') format('truetype'); 
    }
    @font-face {
      font-family: 'font-medium';
      src: url('${mediumFontUrl}') format('truetype'); 
    }
    @font-face {
      font-family: 'font-bold';
      src: url('${boldFontUrl}') format('truetype');
    }
  `;
    document.head.appendChild(style);
  } catch (error) {
    console.log("Error loading the font file:", error);
  }
};

const fetchStyle = () => {
  return new Promise((resolve, reject) => {
    try {
      const cssUrl = getBrandAssetPath(ASSET_PATHS.CSS_PATH);
      console.log("cssUrl", cssUrl);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssUrl;
      link.type = "text/css";

      link.onload = () => {
        console.log("Style loaded:", cssUrl);
        resolve();
      };

      link.onerror = (err) => {
        console.error("Error loading the CSS file:", err);
        reject(new Error(`CSS file not found at: ${cssUrl}`));
      };

      document.head.appendChild(link);
    } catch (error) {
      reject(error);
    }
  });
};

const loadBrandCSS = async (superBrandName) => {
  try {
    let style = await import(`./${superBrandName}/theme/style.css`);
    console.log("Style loaded:", style);
  } catch (error) {
    console.log("error", error);
  }
};

const loadConfigThemeMessages = async () => {
  try {
    const brandMetaResponse = await AsyncService?.loadDataUnauthorized(
      "metaData/getBrandAssets?type=ss"
    );
    //console.log("brandMetaResponse", brandMetaResponse);
    let findresponse = brandMetaResponse.data.config;
    let CuratorMCode = findresponse.CURATOR_MCODE;
    const updateConfig = {
      brandCuratorMCode: CuratorMCode,
      ...findresponse,
    };
    window.globalConfig = updateConfig;
    //console.log("brandMetaResponse", brandMetaResponse?.data);
    //console.log("loading css");
    await fetchStyle();
    //console.log("loading fonts");
    await fetchFont();

    return {
      modules: brandMetaResponse.data.module,
      messages: brandMetaResponse.data.messages,
      theme: brandMetaResponse.data.theme,
      jsonConfig: updateConfig,
    };
  } catch (error) {
    console.log("Fallback Called : ", error);
    const jsonConfig = await loadConfigJson();
    console.error("error", error);
    fetchFont();
    fetchStyle();
    const themePath = `${
      document.location.origin
    }/brandassetsFallback/json/theme.json?t=${Date.now()}`;
    const messagePath = `${
      document.location.origin
    }/brandassetsFallback/languages/en.json?t=${Date.now()}`;
    const modulesPath = `${
      document.location.origin
    }/brandassetsFallback/json/modules.json?t=${Date.now()}`;

    const [messages, theme, modules] = await Promise.all([
      Axios.get(messagePath),
      Axios.get(themePath),
      Axios.get(modulesPath),
    ]);
    return {
      modules: modules.data,
      messages: messages.data,
      theme: theme.data,
      jsonConfig,
    };
  }
};

const loadSuperConfigThemeMessages = async () => {
  try {
    const brandMetaResponse = await axios?.get(
      "api/metaData/getBrandAssets?type=ss",
      { headers: { BrandName: getSuperBrandId(), BrandId: "null" } }
    );
    console.log(
      "loadSuperConfigThemeMessages brandMetaResponse::",
      brandMetaResponse?.data
    );
    let findresponse = brandMetaResponse.data?.config;
    let CuratorMCode = findresponse.CURATOR_MCODE;
    const updateConfig = {
      brandCuratorMCode: CuratorMCode,
      ...findresponse,
    };
    window.globalConfig = updateConfig;
    //console.log("brandMetaResponse", window.globalConfig);
    //console.log("loading css");
    await fetchStyle();
    //console.log("loading fonts");
    await fetchFont();

    return {
      modules: brandMetaResponse.data.module,
      messages: brandMetaResponse.data.messages,
      theme: brandMetaResponse.data.theme,
      jsonConfig: updateConfig,
    };
  } catch (error) {
    console.log("Fallback Called : ", error);
    const jsonConfig = await loadConfigJson();
    console.error("error", error);
    fetchFont();
    fetchStyle();
    const themePath = `${
      document.location.origin
    }/brandassetsFallback/json/theme.json?t=${Date.now()}`;
    const messagePath = `${
      document.location.origin
    }/brandassetsFallback/languages/en.json?t=${Date.now()}`;
    const modulesPath = `${
      document.location.origin
    }/brandassetsFallback/json/modules.json?t=${Date.now()}`;

    const [messages, theme, modules] = await Promise.all([
      Axios.get(messagePath),
      Axios.get(themePath),
      Axios.get(modulesPath),
    ]);
    return {
      modules: modules.data,
      messages: messages.data,
      theme: theme.data,
      jsonConfig,
    };
  }
};

class BrandingService {
  async get() {
    let superBrandId = getSuperBrandId();
    const isSelectBrandPage = window.location.hash
      .toLowerCase()
      .includes("select-brand");
    try {
      console.log("isSelectBrandPage", isSelectBrandPage);
      if (isSelectBrandPage) {
        localStorage.setItem("brandassetsFolderName", superBrandId);
        return await loadSuperConfigThemeMessages();
      }
      const brandId = localStorage.getItem("brandId");
      if (!!brandId) {
        superBrandId = `${superBrandId}_${brandId}`;
      }
      let brandassetsFolderName = superBrandId;
      console.log("brandassetsFolderName", brandassetsFolderName);
      localStorage.setItem("brandassetsFolderName", brandassetsFolderName);
      return await loadConfigThemeMessages();
    } catch (error) {
      console.log(
        "error while loading brand config,theme and messages...",
        error
      );
      let brandassetsFolderName = getSuperBrandId();
      localStorage.setItem("brandassetsFolderName", brandassetsFolderName);
      return await loadConfigThemeMessages();
    }
  }

  async getWPP() {
    let superBrandName = getSuperBrandName();
    console.log("superBrandName getWPP :: ", superBrandName);

    // try {
    //   loadBrandCSS(superBrandName);
    //   let config = await import(`./${superBrandName}/config.js`);
    //   //let messages = await import(`./${superBrandName}/messages/messages.js`);
    //   let brandassetsFolderName = getSuperBrandId();
    //   localStorage.setItem("brandassetsFolderName", brandassetsFolderName);
    //   return [config.default, config.default.messages];
    // }
    try {
      // 1️⃣ load static config
      loadBrandCSS(superBrandName);
      const configModule = await import(`./${superBrandName}/config.js`);

      // 2️⃣ fetch dynamic brand assets
      const brandMetaResponse = await AsyncService?.loadDataUnauthorized(
        "metaData/getBrandAssets?type=ss"
      );

      const findresponse = brandMetaResponse.data?.config || {};
      const CuratorMCode = findresponse.CURATOR_MCODE;
      const updateConfig = { brandCuratorMCode: CuratorMCode, ...findresponse };
      window.globalConfig = updateConfig;

      const modules = brandMetaResponse.data?.module || {};
      const messages = brandMetaResponse.data?.messages || {};
      const jsonConfig = brandMetaResponse.data?.config || {};

      // 3️⃣ store assets folder name for later
      const brandassetsFolderName = getSuperBrandId();
      localStorage.setItem("brandassetsFolderName", brandassetsFolderName);

      // 4️⃣ merge dynamic data into config
      const finalConfig = {
        ...configModule.default,
        modules,
        messages,
        config: jsonConfig,
      };

      // ✅ return as array [config, messages] like before
      return [finalConfig, messages];
    } catch (error) {
      console.log(
        "error while loading company config,theme and messages, loading default brand theme",
        error
      );
    }
  }
}

export default new BrandingService();
