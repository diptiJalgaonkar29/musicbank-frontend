// import AsyncService from "../../networking/services/AsyncService";
// import authBackgroundLogoHigh from "./assets/auth/logo.png";
// import authNavLogo from "./assets/auth/logo.png";
// import fallbackLogo from "./assets/fallback/logo.png";
// import favicon from "./assets/favicon/favicon.png";
// import navbarLogo from "./assets/navbar/logo.png";
// import fonts from "./theme/fonts";
// import theme from "./theme/theme";

// //Added by Trupti-Wits (brandname, download form values)
// const brandMetaResponse = await AsyncService?.loadDataUnauthorized(
//   "metaData/getBrandAssets?type=ss"
// );
// let findresponse = brandMetaResponse.data?.config;
// let CuratorMCode = findresponse.CURATOR_MCODE;
// const updateConfig = {
//   brandCuratorMCode: CuratorMCode,
//   ...findresponse,
// };
// window.globalConfig = updateConfig;
// //console.log("brandMetaResponse", brandMetaResponse);
// let modules = brandMetaResponse.data.module;
// let messages = brandMetaResponse.data.messages;
// let config = brandMetaResponse.data.config;
// export default {
//   superBrandName: "wpp",
//   assets: {
//     favicon: favicon,
//     navbar: {
//       logo: navbarLogo,
//     },
//     auth: {
//       backgroundImageLogo: authBackgroundLogoHigh,
//       authNavLogo: authNavLogo,
//     },
//     home: {
//       backgroundImages: [],
//       backgroundImagesFallback: [],
//     },
//     browse: {},
//     fallback: {
//       logo: fallbackLogo,
//     },
//     IntroVideoEmbedLink: "",
//   },
//   theme: theme,
//   modules: modules,
//   messages: messages,
//   config: config,
//   // config: {
//   // modules: {
//   //   AcceptanceSection: true,
//   //   RenderDocuments: true,
//   //   RenderDownloadFormMP3: false,
//   //   RenderDownloadFormWAV: true,
//   //   ExtraFormFields: false,
//   //   RenderSonicLogin: false,
//   //   ShowBPMSlider: true,
//   //   CommentsPopup: false,
//   //   CyaniteProfile: true,
//   //   CookiePro: false,
//   //   ShareExternalLink: true,
//   //   ShareGeneralLink: true,
//   //   AudioEditor: true,
//   //   HTMLDescription: true,
//   //   HTMLDescription2: true,
//   //   ShuffledTracks: true,
//   //   SuperSearch: true,
//   //   ShowRegister: true,
//   //   UpdateUItoV2: true,
//   //   showProfilePageToSSOUser: true,
//   //   showLogoutToSSOUser: false,
//   //   showFooterMusicPlayer: true,
//   //   showUsedInVideos: true,
//   //   showUsedInPlaylist: true,
//   //   ShowIntroVideo: false,
//   //   SimilaritySearch: true,
//   //   SimilaritySearchBtn: true,
//   //   SpotifySearchBox: true,
//   //   DownloadPlaylistTracks: true,
//   //   voice: false,
//   //   showBgVoiceInput: false,
//   //   curatorPlaylist: true,
//   //   popularTracks: false,
//   //   showBasketDownload: true,
//   //   showTrackLyrics: true,
//   //   showV3LoginUI: true,
//   //   gmailSSOAuth: false,
//   //   showFavourites: true,
//   //   showPageFooter: true,
//   //   showDisclaimerText: false,
//   //   showSplashScreen: false,
//   //   showReport: false,
//   //   showReportEnquiryModal: true,
//   //   browseUIV3: true,
//   //   trackDetailPageUIV3: true,
//   //   HomeUIV3: false,
//   //   removeAlgolia: true,
//   //   keycloakAuth: false,
//   // },
//   fonts: fonts,
// };

import authBackgroundLogoHigh from "./assets/auth/logo.png";
import authNavLogo from "./assets/auth/logo.png";
import fallbackLogo from "./assets/fallback/logo.png";
import favicon from "./assets/favicon/favicon.png";
import navbarLogo from "./assets/navbar/logo.png";
import fonts from "./theme/fonts";
import theme from "./theme/theme";

export default {
  superBrandName: "wpp",
  assets: {
    favicon,
    navbar: { logo: navbarLogo },
    auth: { backgroundImageLogo: authBackgroundLogoHigh, authNavLogo },
    home: { backgroundImages: [], backgroundImagesFallback: [] },
    browse: {},
    fallback: { logo: fallbackLogo },
    IntroVideoEmbedLink: "",
  },
  theme,
  fonts,
};
