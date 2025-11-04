import authBackgroundLogoHigh from "./assets/auth/logo.png";
import authNavLogo from "./assets/auth/logo.png";
import fallbackLogo from "./assets/fallback/logo.png";
import favicon from "./assets/favicon/favicon.png";
import navbarLogo from "./assets/navbar/logo.png";
import fonts from "./theme/fonts";
import theme from "./theme/theme";

//Added by Trupti-Wits (brandname, download form values)
export default {
  superBrandName: "wpp",
  assets: {
    favicon: favicon,
    navbar: {
      logo: navbarLogo,
    },
    auth: {
      backgroundImageLogo: authBackgroundLogoHigh,
      authNavLogo: authNavLogo,
    },
    home: {
      backgroundImages: [],
      backgroundImagesFallback: [],
    },
    browse: {},
    fallback: {
      logo: fallbackLogo,
    },
    IntroVideoEmbedLink: "https://www.youtube.com/embed/rbgqq2Q9RD4",
  },
  theme: theme,
  modules: {
    AcceptanceSection: true,
    RenderDocuments: true,
    RenderDownloadFormMP3: false,
    RenderDownloadFormWAV: true,
    ExtraFormFields: false,
    RenderSonicLogin: false,
    ShowBPMSlider: true,
    CommentsPopup: false,
    CyaniteProfile: true,
    CookiePro: false,
    ShareExternalLink: true,
    ShareGeneralLink: true,
    AudioEditor: true,
    HTMLDescription: true,
    HTMLDescription2: true,
    ShuffledTracks: true,
    SuperSearch: true,
    ShowRegister: true,
    UpdateUItoV2: true,
    showProfilePageToSSOUser: true,
    showLogoutToSSOUser: true,
    showFooterMusicPlayer: true,
    showUsedInVideos: true,
    showUsedInPlaylist: true,
    ShowIntroVideo: false,
    SimilaritySearch: true,
    SimilaritySearchBtn: true,
    SpotifySearchBox: true,
    DownloadPlaylistTracks: true,
    voice: false,
    showBgVoiceInput: false,
    curatorPlaylist: true,
    popularTracks: false,
    showBasketDownload: true,
    showTrackLyrics: true,
    showV3LoginUI: true,
    gmailSSOAuth: false,
    showFavourites: true,
    showPageFooter: true,
    showDisclaimerText: false,
    showSplashScreen: false,
    showReport: false,
    showReportEnquiryModal: true,
    browseUIV3: true,
    trackDetailPageUIV3: true,
    HomeUIV3: false,
    removeAlgolia: false,
    keycloakAuth: false,
  },
  fonts: fonts,
};
