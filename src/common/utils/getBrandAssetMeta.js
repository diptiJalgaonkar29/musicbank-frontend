import getConfigJson from "./getConfigJson";

export const getBrandAssetBaseUrl = () => {
  let origin = document.location.origin;
  const brandassetsFolderName = localStorage.getItem("brandassetsFolderName");
  return `${origin}/brandassets/${brandassetsFolderName}`;
};

export const ASSET_PATHS = {
  NAV_LOGO_PATH: "NAV_LOGO_PATH",
  FAVICON_PATH: "FAVICON_PATH",
  FALLBACK_LOGO_PATH: "FALLBACK_LOGO_PATH",
  AUTH_RIGHT_BLOCK_IMAGE_PATH: "AUTH_RIGHT_BLOCK_IMAGE_PATH",
  AUTH_BACKGROUND_IMAGE_PATH: "AUTH_BACKGROUND_IMAGE_PATH",
  AUTH_RIGHT_BLOCK_BG_IMAGE_PATH: "AUTH_RIGHT_BLOCK_BG_IMAGE_PATH",
  LIGHT_FONT_PATH: "LIGHT_FONT_PATH",
  MEDIUM_FONT_PATH: "MEDIUM_FONT_PATH",
  BOLD_FONT_PATH: "BOLD_FONT_PATH",
  CSS_PATH: "CSS_PATH",
};

export const getBrandAssetPath = (to) => {
  const configJson = getConfigJson();
  return `${getBrandAssetBaseUrl()}${configJson[to]}`;
};

export const checkV3WrapperBgImage = () => {
  const configJson = getConfigJson();
  return !!configJson[ASSET_PATHS.AUTH_BACKGROUND_IMAGE_PATH];
};

export const checkRightBlockBgImage = () => {
  const configJson = getConfigJson();
  return !!configJson[ASSET_PATHS.AUTH_RIGHT_BLOCK_BG_IMAGE_PATH];
};
