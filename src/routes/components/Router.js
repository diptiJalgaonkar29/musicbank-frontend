import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Logout from "../../authentication/components/Logout/Logout";
import FallBackPage from "../../common/pages/FallBackPage";
import {
  COOKIE_STATEMENT_ROUTE,
  DISCLAIMER_ROUTE,
  PRIVACY_POLICY_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
} from "../../document/constants/constants";
import NoMatchPage from "../pages/NoMatchPage";
import ProtectedRoute from "./ProtectedRoute";
import AISearchWorkSpace from "../../AISearchWorkSpace/AISearchWorkSpace";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

const BucketList = lazy(() => import("../../bucketlist/BucketList"));
const LoginPage = lazy(() => import("../../authentication/pages/LoginPage"));
const SelectBrandPage = lazy(() =>
  import("../../authentication/pages/SelectBrandPage/SelectBrandPage")
);

const SSOProcessPage = lazy(() =>
  import("../../authentication/pages/SSOProcessPage/SSOProcessPage")
);
const SSAndCSAccessDeniedPage = lazy(() =>
  import(
    "../../authentication/pages/SSAndCSAccessDeniedPage/SSAndCSAccessDeniedPage"
  )
);
const VerificationMFAPage = lazy(() =>
  import("../../authentication/pages/VerificationMFAPage/VerificationMFAPage")
);
const V3LoginPage = lazy(() =>
  import("../../authentication/pages/V3LoginPage")
);
const V3EmailAndPasswordLoginPage = lazy(() =>
  import("../../authentication/pages/V3EmailAndPasswordLoginPage")
);
const RegisterPage = lazy(() =>
  import("../../authentication/pages/RegisterPage")
);
const V3RegisterPage = lazy(() =>
  import("../../authentication/pages/V3RegisterPage")
);
const V3RegisterSSOPage = lazy(() =>
  import("../../authentication/pages/V3RegisterSSOPage")
);
const V2RegisterSSOPage = lazy(() =>
  import("../../authentication/pages/V2RegisterSSOPage")
);
const SetPasswordPage = lazy(() =>
  import("../../authentication/pages/SetPasswordPage")
);
const V3SetPasswordPage = lazy(() =>
  import("../../authentication/pages/V3SetPasswordPage")
);
const RecoverPasswordPage = lazy(() =>
  import("../../authentication/pages/RecoverPasswordPage")
);
const V3RecoverPasswordPage = lazy(() =>
  import("../../authentication/pages/V3RecoverPasswordPage")
);

const DisclaimerPage = lazy(() => import("../../imprint/pages/Disclaimer"));
const TermsAndConditionsPage = lazy(() =>
  import("../../imprint/pages/TermsOfUse")
);
const PrivacyPolicyPage = lazy(() =>
  import("../../imprint/pages/PrivacyAndPolicy")
);
const CookieStatementPage = lazy(() =>
  import("../../imprint/pages/CookieStatement")
);

const ThreeSplitHomePage = lazy(() =>
  import("../../search/layout/ThreeSplitHomepage/ThreeSplitHomepage")
);
const ThreeSplitHomePage1 = lazy(() =>
  import("../../search1/layout/ThreeSplitHomepage/ThreeSplitHomepage")
);
const HomePageV3 = lazy(() =>
  import("../../search1/layout/HomePageV3/HomePageV3")
);
const BrowsePage = lazy(() => import("../../browse/pages/BrowsePage"));
const BrowsePageV2 = lazy(() =>
  import("../../browseV2/pages/BrowsePageV2/BrowsePageV2")
);
const TrackDetailPage = lazy(() => import("../../track/pages/TrackDetailPage"));
const TrackDetailPageAnalysis = lazy(() =>
  import("../../track/pages/TrackDetailPageAnalysis")
);
const TrackDetailPageAnalysisSH2 = lazy(() =>
  import("../../track/pages/TrackDetailPageAnalysisSH2")
);
const SimilarTracks2 = lazy(() => import("../../cyanite/SimilarTracks2"));
const SearchResultsPage = lazy(() =>
  import("../../search/pages/searchResult/SearchResultsPage")
);
const SearchResultsPage1 = lazy(() =>
  import("../../search1/pages/searchResult/SearchResultsPage")
);
const MyMusicPage = lazy(() => import("../../playlist/pages/MyMusicPage"));
const Playlist = lazy(() => import("../../playlist/pages/MyMusicPageV1/MyMusicPageV1"));
const MyMusicPageGuest = lazy(() =>
  import("../../playlist/pages/MyMusicPageGuest")
);
const DocumentsPage = lazy(() =>
  import("../../document/layout/DocumentsPageHoc")
);

const SuperSearchPageV2 = lazy(() =>
  import("../../supersearch2/layout/SuperSearchBaseV2")
);

const SuperSearchPageV2DB = lazy(() =>
  import("../../supersearch2/layout/SuperSearchBaseV2DB")
);

const basketPage = lazy(() => import("../../basket/pages/BasketPage"));

const DownloadBasketFormPage = lazy(() =>
  import("../../basket/pages/DownloadBasketFormPage")
);

const ProfileForm = lazy(() =>
  import("../../common/components/ProfileForm/ProfileForm")
);

const ProjectDownload = lazy(() =>
  import("../../projectdownload/projectDownloadV1/projectDownloadV1")
);
const CreditRequest = lazy(() => import("../../creditrequest/creditrequest"));
const V3TestLoginPage = lazy(() =>
  import("../../authentication/pages/V3TestLoginPage")
);
const AIMusicSearchPage = lazy(() =>
  import("../../AISearch/AIMusicSearchPage/AIMusicSearchPage")
);
const CustomTrackFormPage = lazy(() =>
  import("../../CustomTrack/CustomTrackForm/CustomTrackForm")
);
const CustomTrackFormLayout = lazy(() =>
  import("../../CustomTrack/CustomTrackFormLayout/CustomTrackFormLayout")
);
const AISearchScreen = lazy(() =>
  import("../../AISearchScreen/AISearchScreen")
);
const Editor = lazy(() => import("../../JsonEditor/Editor"));
class Router extends Component {
  componentDidMount() {
    const removeAlgolia = this.props.config?.modules?.removeAlgolia;
    if (removeAlgolia) {
      localStorage.removeItem("algoliasearch-client-js");
    }
  }

  render() {
    const { config } = this.props;

    return (
      <Suspense fallback={<FallBackPage />}>
        <Routes>
          {config.modules.showV3LoginUI ? (
            <Route path="/login/" exact element={<V3LoginPage />} />
          ) : (
            <Route path="/login/" exact element={<LoginPage />} />
          )}
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/user-login/"
            exact
            element={<V3EmailAndPasswordLoginPage />}
          />
          <Route
            path="/ms_sso/:encodedUserString"
            exact
            element={<SSOProcessPage />}
          />
          <Route
            path="/access_denied"
            exact
            element={<SSAndCSAccessDeniedPage />}
          />
          <Route path="/verify-mfa" exact element={<VerificationMFAPage />} />
          <Route
            path="/recover-password/"
            exact
            element={
              config.modules.showV3LoginUI ? (
                <V3RecoverPasswordPage />
              ) : (
                <RecoverPasswordPage />
              )
            }
          />
          <Route
            path="/register/"
            exact
            element={
              config.modules.showV3LoginUI ? (
                <V3RegisterPage />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route path="/testloginentry/" exact element={<V3TestLoginPage />} />
          <Route
            path="/registerSSO/"
            exact
            element={
              config.modules.showV3LoginUI ? (
                <V3RegisterSSOPage />
              ) : (
                <V2RegisterSSOPage />
              )
            }
          />
          <Route
            path="/set-password/:encodedString"
            exact
            element={
              config.modules.showV3LoginUI ? (
                <V3SetPasswordPage />
              ) : (
                <SetPasswordPage />
              )
            }
          />
          <Route path={DISCLAIMER_ROUTE} exact element={<DisclaimerPage />} />
          <Route
            path={TERMS_AND_CONDITIONS_ROUTE}
            exact
            element={<TermsAndConditionsPage />}
          />
          <Route
            path={PRIVACY_POLICY_ROUTE}
            exact
            element={<PrivacyPolicyPage />}
          />
          <Route
            path={COOKIE_STATEMENT_ROUTE}
            exact
            element={<CookieStatementPage />}
          />
          <Route
            path="/select-brand"
            config={config}
            element={<SelectBrandPage />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                config={config}
                element={<HomePageV3 />}
                /* element={
                  config.modules.HomeUIV2 ? (
                    <HomePageV3 />
                  ) : config.modules.UpdateUItoV2 ? (
                    <ThreeSplitHomePage1 />
                  ) : (
                    <ThreeSplitHomePage />
                  )
                } */
              />
            }
          />
          <Route
            path="/browse/"
            element={
              <ProtectedRoute config={config} element={<BrowsePage />} />
            }
          />
          <Route
            path="/playlist/"
            element={
              <ProtectedRoute config={config} element={<Playlist />} />
            }
          />

          <Route
            path="/ai_search"
            element={
              <ProtectedRoute config={config} element={<AIMusicSearchPage />} />
            }
          />

          <Route
            path="/ai_search/workspace"
            element={
              <ProtectedRoute config={config} element={<AISearchWorkSpace />} />
            }
          />

          <Route
            path="/customTrackForm"
            element={
              <ProtectedRoute
                config={config}
                element={<CustomTrackFormPage />}
              />
            }
          />

          <Route
            path="/editor/:type"
            element={<ProtectedRoute config={config} element={<Editor />} />}
          />

          <Route
            path="/CustomTrackFormLayout"
            element={
              <ProtectedRoute
                config={config}
                element={<CustomTrackFormLayout />}
              />
            }
          />
          <Route
            path="/AISearchScreen"
            element={
              <ProtectedRoute config={config} element={<AISearchScreen />} />
            }
          />
          <Route
            path="/search_results/:spotifyId?"
            element={
              <ProtectedRoute config={config} element={<BrowsePageV2 />} />
            }
          />

          <Route
            path="/mymusic/"
            element={
              <ProtectedRoute config={config} element={<MyMusicPage />} />
            }
          />

          <Route path="/mymusic/:id/:mcode" element={<MyMusicPageGuest />} />

          <Route
            path="/mymusic/:id"
            element={
              <ProtectedRoute config={config} element={<MyMusicPage />} />
            }
          />

          <Route
            path="/track_page/:id"
            element={
              <ProtectedRoute
                config={config}
                element={
                  config.modules.PROJECT_VERSION === "SH2" ? (
                    <TrackDetailPageAnalysisSH2 configModules={config.modules} />
                  ) : (
                     config.modules.CyaniteProfile ? (
                    <TrackDetailPageAnalysis configModules={config.modules} />
                  ) : (
                    <TrackDetailPage configModules={config.modules} />
                  )                    
                  )                 
                }
              />
            }
          />

          {config.modules.SuperSearch && (
            <Route
              path="/supersearch/"
              element={
                <ProtectedRoute
                  config={config}
                  element={
                    config.modules.removeAlgolia ? (
                      <SuperSearchPageV2DB />
                    ) : (
                      <SuperSearchPageV2 />
                    )
                  }
                />
              }
            />
          )}

          <Route
            path="/similar_tracks/:id?"
            element={
              <ProtectedRoute config={config} element={<SimilarTracks2 />} />
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute config={config} element={<ProfileForm />} />
            }
          />

          <Route
            path="/search_results_algolia/:id"
            element={
              <ProtectedRoute
                config={config}
                element={
                  config.modules.UpdateUItoV2 ? (
                    <SearchResultsPage1 />
                  ) : (
                    <SearchResultsPage />
                  )
                }
              />
            }
          />

          {config.modules.showBasketDownload && (
            <>
              <Route
                path="/projects/"
                element={
                  <ProtectedRoute config={config} element={<BucketList />} />
                }
              />
              <Route
                path="/predict/"
                element={
                  <ProtectedRoute config={config} element={<BucketList />} />
                }
              />
              <Route
                path="/credit-request/"
                element={
                  <ProtectedRoute config={config} element={<CreditRequest />} />
                }
              />
              <Route
                path="/track-download/:projectId"
                element={
                  <ProtectedRoute
                    config={config}
                    element={<ProjectDownload />}
                  />
                }
              />
              <Route
                path="/download_basket_form/"
                element={
                  <ProtectedRoute
                    config={config}
                    element={<DownloadBasketFormPage />}
                  />
                }
              />
              <Route
                path="/basket/"
                element={
                  <ProtectedRoute config={config} element={<basketPage />} />
                }
              />
            </>
          )}

          {config.modules.RenderDocuments && (
            <>
              <Route
                path="/documents"
                element={
                  <Navigate
                    to={
                      config.modules.showReport
                        ? "/documents/report"
                        : "/documents/guidelines"
                    }
                  />
                }
              />
              <Route
                path="/documents/:category"
                element={
                  <ProtectedRoute config={config} element={<DocumentsPage />} />
                }
              />
            </>
          )}

          {config.modules.keycloakAuth && (
            <Route path="/:kcMeta" element={<V3LoginPage />} />
          )}

          <Route path="*" element={<NoMatchPage />} />
        </Routes>
      </Suspense>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default withRouterCompat(connect(mapStateToProps, null)(Router));
