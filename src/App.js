import { createBrowserHistory } from "history";
import React, { Component } from "react";
import ReactGA from "react-ga";
import { connect } from "react-redux";
import {
  setRefinementItem,
  setResults,
  setResultsFor,
  setSearchState,
  setSearchUrl,
} from "../src/redux/actions/searchActions/index";
import { BrandingContext } from "./branding/provider/BrandingContext";
import AppTitleProvider from "./common/components/AppTitleProvider/AppTitleProvider";
import FaviconProvider from "./common/components/FaviconProvider/FaviconProvider";
import Notification from "./common/components/Notification/Notifications";
import PathRedirecter from "./routes/components/PathRedirecter";
import Router from "./routes/components/Router";
import { setLoginStatusChecker } from "./common/utils/LoginStatusChecker";
import ClearCache from "react-clear-cache";
import MusicPlayer from "./common/components/Audiplayer/Music-Player.js";
import {
  setJobHistoryProccessedData,
  removeAllJobHistoryProccessedData,
} from "./redux/actions/jobHistoryData/jobHistoryData";
import getSuperBrandName from "./common/utils/getSuperBrandName";
import loadTaxonomyTags from "./common/utils/loadTaxonomyTags";
import Cookies from "js-cookie";
import { setInitDownloadBasket } from "./redux/actions/trackDownloads/tracksDownload.js";
import SplashScreenModal from "./common/components/SplashScreenModal/SplashScreenModal.js";
import CommonMessageModal from "./common/components/CommonMessageModal/CommonMessageModal.js";
import TrackDownloadProgress from "./common/components/TrackDownloadProgress/TrackDownloadProgress.js";
import CustomNotificationTopBar from "./common/components/customNotificationTopBar/CustomNotificationTopBar.js";
import { brandConstants } from "./common/utils/brandConstants.js";
import {
  getUserAuthMeta,
  getUserId,
  isAuthenticated,
} from "./common/utils/getUserAuthMeta.js";
import { getBrandAssetBaseUrl } from "./common/utils/getBrandAssetMeta.js";
// import ErrorBoundary from "./routes/pages/ErrorBoundary.js";
import "../src/common/utils/consoleUtils.js";
import getSuperBrandId from "./common/utils/getSuperBrandId.js";
import AlgoliaWrapper from "./common/components/AlgoliaWrapper/AlgoliaWrapper";
import { withRouterCompat } from "./common/utils/withRouterCompat.js";
import { AlgoliaIndexProvider } from "./AISearchScreen/Components/AlgoliaIndexContext.js";
import AlgoliaWrapperV2 from "./AISearchScreen/Components/AlgoliaWrapperV2.js";
import SearchParamsWrapper from "./common/components/SearchParamsWrapper/SearchParamsWrapper.js";
// import "./style.css";

const _ = require("lodash");
const updateAfter = 300;
let fromPredictNavPath = "";
let predictPramToken = "";

class App extends Component {
  state = {
    open: false,
    isUserAuthorize: false,
    superBrandName: getSuperBrandName(),
    superBrandId: getSuperBrandId(),
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.removeAllJobHistoryProccessedData();
  };

  muFunction = (para) => {
    alert(para);
  };

  loadIubendaScript() {
    var iubendaScript = document.createElement("script");
    iubendaScript.type = "text/javascript";
    iubendaScript.src = `${getBrandAssetBaseUrl()}/js/iubenda.js`;
    iubendaScript.defer = "true";
    document.body.appendChild(iubendaScript);
  }

  loadBasketTrackByUser() {
    const userId = getUserId();
    const basketCookie = Cookies.get("basket")
      ? JSON.parse(Cookies.get("basket"))
      : {};
    // to clear old flow basket data
    if (Array.isArray(basketCookie)) {
      Cookies.remove("basket");
      Cookies.remove("basketFormData");
    }

    const intialState = basketCookie?.[userId + ""] || [];
    this.props.setInitDownloadBasket(intialState);
  }

  addSuperBrandNameClassToBodyElement = (superBrandName) => {
    try {
      let isSuperBrandClassNameAddedToBody =
        document.body.classList.contains(superBrandName);
      if (!isSuperBrandClassNameAddedToBody) {
        document.body.classList.add(superBrandName);
      }
    } catch (error) {}
  };

  addBrandNameClassToBodyElement = (brandName) => {
    try {
      //console.log("addBrandNameClassToBodyElement brandName : ", brandName);
      let isBrandClassNameAddedToBody =
        document.body.classList.contains(brandName);
      if (!isBrandClassNameAddedToBody) {
        document.body.classList.add(brandName);
      }
    } catch (error) {}
  };

  setPredictNavPathToken = () => {
    console.log("setPredictNavPathToken");
    fromPredictNavPath = window.location.href;
    const hash = window.location.hash;
    const qs = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(qs);
    predictPramToken = params.get("token");
    console.log("url data", window.location, document.location, params);
    console.log("setPredictNavPathToken", fromPredictNavPath, predictPramToken);
    window.APP_FROM_PREDICT_NAVPATH = fromPredictNavPath;
    window.APP_PREDICT_PARAM_TOKEN = predictPramToken;
    window.APP_FROM_PREDICT_HASHPATH = window.location.hash;
    console.log(
      "window vars",
      window.APP_FROM_PREDICT_NAVPATH,
      window.APP_PREDICT_PARAM_TOKEN,
      window.APP_FROM_PREDICT_HASHPATH
    );
  };

  componentDidMount() {
    console.log("STARTING APP");

    this.setPredictNavPathToken();
    window.addEventListener("hashchange", this.setPredictNavPathToken);

    localStorage.removeItem("superBrandName");
    localStorage.removeItem("superBrandId");

    let superBrandName = getSuperBrandName();
    this.addSuperBrandNameClassToBodyElement(superBrandName);
    const brandName = this.props.userMeta?.brandName || "";
    try {
      document.body.classList.remove(
        brandName?.replaceAll(" ", "")?.toLowerCase()
      );
    } catch (error) {}

    if (!!brandName && !window.location.hash.includes("/select-brand")) {
      this.addBrandNameClassToBodyElement(
        brandName?.replaceAll(" ", "")?.toLowerCase()
      );
    }

    var history = createBrowserHistory();
    if (
      process.env.REACT_APP_IUBENDA_POLICY_ENABLED &&
      process.env.NODE_ENV !== "development"
    ) {
      setTimeout(() => {
        this.loadIubendaScript();
      }, 1000);
    }

    // Set Up Google Analytics
    if (process.env.REACT_APP_GOOGLE_ANALYTICS_ENABLED) {
      switch (superBrandName) {
        case brandConstants.MASTERCARD:
          ReactGA.initialize("UA-50237976-4");
          break;
        case brandConstants.MERCEDES:
          ReactGA.initialize("UA-50237976-6");
          break;
        case brandConstants.AMP:
          //this need to be updated for amp
          ReactGA.initialize("UA-50237976-6");
          break;
        default:
          break;
      }
    }
    history.listen((location) => ReactGA.pageview(location.pathname));
    setLoginStatusChecker();

    const isUserAuthenticated = isAuthenticated();
    //console.log("isUserAuthenticated", isUserAuthenticated);
    if (isUserAuthenticated) {
      this.setState({ isUserAuthorize: true });
      // console.log(
      /// "LOGGED IN",
      //   Object.keys(this.props?.taxonomy?.ampMainMoodTagsIdAndLabelObj)?.length
      // );
      if (
        this.props?.userMeta?.ssAccess &&
        Object.keys(this.props?.taxonomy?.trackTypeIdAndLabelObj)?.length === 0
      ) {
        //console.log("this.props?.taxonomy**", this.props?.taxonomy);
        loadTaxonomyTags();
      }
      // this.loadBasketTrackByUser();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (!!this.props.authentication.userAuthorization?.result?.token &&
        this.props.authentication.userAuthorization?.result?.token !==
          prevProps.authentication.userAuthorization?.result?.token) ||
      (!!this.props.authentication.userAuthorization?.token &&
        this.props.authentication.userAuthorization?.token !==
          prevProps.authentication.userAuthorization?.token)
    ) {
      const isUserAuthenticated = isAuthenticated();
      //console.log("isUserAuthenticated", isUserAuthenticated);
      if (isUserAuthenticated) {
        this.setState({ isUserAuthorize: true });
        // this.loadBasketTrackByUser();
        //  console.log(
        //    "LOGGED IN",
        ///    Object.keys(this.props?.taxonomy?.ampMainMoodTagsIdAndLabelObj)
        //      ?.length
        // );
        if (
          this.props?.userMeta?.ssAccess &&
          Object.keys(this.props?.taxonomy?.trackTypeIdAndLabelObj)?.length ===
            0
        ) {
          loadTaxonomyTags();
        }
      }
    }
  }
  render() {
    return (
      // <ErrorBoundary>
      <ClearCache auto={true}>
        {({ isLatestVersion, emptyCacheStorage }) => {
          if (!isLatestVersion) {
            emptyCacheStorage();
            localStorage.clear();
            document.cookie = `mu-logstatus=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;SameSite=Strict`;
          }
          return (
            <BrandingContext.Consumer>
              {({ config }) => (
                <div className={`${this.state.superBrandName}`}>
                  <SearchParamsWrapper>
                    <CustomNotificationTopBar />
                    <PathRedirecter />
                    <FaviconProvider />
                    <AppTitleProvider />
                    <CommonMessageModal />
                    <Notification allIds={this.props.notifications} />
                    <SplashScreenModal />
                    {config?.modules?.showFooterMusicPlayer && <MusicPlayer />}
                    {config?.modules?.showBasketDownload && (
                      <TrackDownloadProgress />
                    )}
                    {/* {config?.modules?.removeAlgolia ? ( */}
                    <AlgoliaIndexProvider>
                      <AlgoliaWrapperV2>
                        <Router config={config} />
                      </AlgoliaWrapperV2>
                    </AlgoliaIndexProvider>
                    {/* ) : (
                      <AlgoliaWrapper>
                        <Router config={config} />
                      </AlgoliaWrapper>
                    )} */}
                  </SearchParamsWrapper>
                </div>
              )}
            </BrandingContext.Consumer>
          );
        }}
      </ClearCache>
      // </ErrorBoundary>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSearchState: (search_state) => dispatch(setSearchState(search_state)),
    setSearchUrl: (url) => dispatch(setSearchUrl(url)),
    setResults: (result) => dispatch(setResults(result)),
    setResultsFor: (query) => dispatch(setResultsFor(query)),
    setRefinementItem: (refinementArray) =>
      dispatch(setRefinementItem(refinementArray)),
    setJobHistoryProccessedData: (jobHistoryProccessedData) =>
      dispatch(setJobHistoryProccessedData(jobHistoryProccessedData)),
    removeAllJobHistoryProccessedData: () =>
      dispatch(removeAllJobHistoryProccessedData()),
    setInitDownloadBasket: (basketTracksInCookieByUser) =>
      dispatch(setInitDownloadBasket(basketTracksInCookieByUser)),
  };
};

const mapStateToProps = (state) => {
  return {
    search_state: state.search.search_state,
    search_result: state.search.search_result,
    isNotification: state.notifications.byId,
    jobHistoryProccessedData: state.jobHistoryProccessedData,
    authentication: state.authentication,
    taxonomy: state.taxonomy,
    userMeta: state.userMeta,
  };
};

export default withRouterCompat(
  connect(mapStateToProps, mapDispatchToProps)(App)
);
