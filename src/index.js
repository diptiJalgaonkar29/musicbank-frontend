//Material UI
import "normalize.css";
import React, { Suspense } from "react";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
// Device Detect
import { isIE } from "react-device-detect";
//Redux
import { Provider } from "react-redux";
//Router
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";
import { persistor, store } from "./redux/stores/store";
import "./_styles/NavBar.css";
import "./_styles/SearchInput.css";
import "./_styles/SearchResultsPageHoc.css";
//IMPORT ALL CSS SETTINGS
import "./_styles/TrackCard.css";
import "./_styles/Swiper.css";
import FooterMusicPlayerProvider from "./hooks/FooterMusicPlayerProvider";
import getSuperBrandName from "./common/utils/getSuperBrandName";
// import { WPPOsProvider } from "./branding/wpp/GetWPPOsContextData";
import { brandConstants } from "./common/utils/brandConstants";
import FallBackPage from "./common/pages/FallBackPage";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";
import ReactDOM from "react-dom/client";
import { WPPOsProvider } from "./branding/wpp/GetWPPOsContextData";

const BrandingProvider = React.lazy(() =>
  import("./branding/provider/BrandingProvider")
);
const BrandingProviderWPP = React.lazy(() =>
  import("./branding/provider/BrandingProviderWPP")
);

const theme = createTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1.2rem",
        fontFamily: "var(--font-primary)",
      },
    },
  },
});

let app;
let superBrandName = getSuperBrandName();

if (isIE) {
  app = (
    <h1 style={{ color: "var(--color-white)" }}>
      {" "}
      IE is not supported. Download Chrome/Opera/Firefox{" "}
    </h1>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

const DefaultApp = () => {
  return (
    <Suspense fallback={<FallBackPage />}>
      <BrandingProvider>
        <App />
      </BrandingProvider>
    </Suspense>
  );
};

const WPPApp = () => {
  return (
    <Suspense fallback={<FallBackPage />}>
      <WPPOsProvider>
        <BrandingProviderWPP>
          <App />
        </BrandingProviderWPP>
      </WPPOsProvider>
    </Suspense>
  );
};

const MainApp = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <FooterMusicPlayerProvider>
        <ThemeProvider theme={theme}>
          <HashRouter>
            {/* {superBrandName == brandConstants.WPP &&
            process.env.NODE_ENV === "production" ? ( */}
            {superBrandName == brandConstants.WPP ? <WPPApp /> : <DefaultApp />}
          </HashRouter>
        </ThemeProvider>
      </FooterMusicPlayerProvider>
    </PersistGate>
  </Provider>
);

root.render(MainApp);
