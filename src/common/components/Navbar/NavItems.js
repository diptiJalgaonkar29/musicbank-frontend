import React, { Component, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import {
  setResults,
  setResultsFor,
  setSearchState,
} from "../../../redux/actions/searchActions/index";
import NavItem from "./NavItem";
import "./ToggleNavBar.css";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

import { connectCurrentRefinements } from "react-instantsearch-dom";
import { FaCartArrowDown } from "react-icons/fa";
import Badge from "@mui/material/Badge";
import BasketPopup from "../../../basket/components/BasketPopup/BasketPopup";
import getConfigJson from "../../utils/getConfigJson";
import ReportBug from "../ReportBug/ReportBug";
import { isMobile } from "react-device-detect";
import Cookies from "js-cookie";
import { setInitDownloadBasket } from "../../../redux/actions/trackDownloads/tracksDownload";
import appendCSUrlParams from "../../utils/appendCSUrlParams";
import { withRouterCompat } from "../../utils/withRouterCompat";

class NavItems extends Component {
  goToSearchAll = () => {
    this.props.navigate("/search_results_algolia/%3Fquery=");
    if (
      document.getElementsByClassName("ais-ClearRefinements-button").length !==
      0
    ) {
      document.getElementsByClassName("ais-ClearRefinements-button")[0].click();
    }

    this.props.setSearchState({});
    this.props.setResultsFor("");
  };

  goToSuperSearch = () => {
    document.getElementById("clearIt").click();

    this.props.navigate("/supersearch/");
  };

  renderDocumentsLink = () => {
    const { config } = this.props;
    const isDocumentsModules = config.modules.RenderDocuments;
    if (isDocumentsModules) {
      return (
        <NavItem link="/documents" dontActivate={false}>
          <FormattedMessage
            id={
              config.modules.showReport
                ? "navbar.navItems.documentsReport"
                : "navbar.navItems.documents"
            }
          ></FormattedMessage>
        </NavItem>
      );
    } else {
      return (
        <div
          onClick={() =>
            window.open(
              process.env.REACT_APP_DELOITTE_DOCUMENTS_ROUTE,
              "_blank"
            )
          }
        >
          <NavItem link="#" dontActivate={true}>
            <FormattedMessage
              id={
                config.modules.showReport
                  ? "navbar.navItems.documentsReport"
                  : "navbar.navItems.documents"
              }
            ></FormattedMessage>
          </NavItem>
        </div>
      );
    }
  };

  renderCreationStationLink = () => {
    const { jsonConfig: CONFIG } = useContext(BrandingContext);
    return (
      <div
        onClick={() => {
          localStorage.setItem("CSLoggingOut", "false");
          const urlToNavigate = `${
            process.env.NODE_ENV === "development"
              ? "http://localhost:3098"
              : CONFIG?.CS_BASE_URL
          }?${appendCSUrlParams()}`;
          // console.log("navitems-urlToNavigate::", urlToNavigate);
          window.open(urlToNavigate, "_self");
        }}
        className="nav_div"
        style={{ display: "contents" }}
      >
        <NavItem link="#" dontActivate={true}>
          <FormattedMessage id="navbar.navItems.creationStation"></FormattedMessage>
        </NavItem>
      </div>
    );
  };

  toggleMenu = () => {
    if (document.querySelector(".toggleMeunBtn")) {
      document.querySelector(".toggleMeunBtn").classList.toggle("change");
    }

    if (document.querySelector(".navitems__toggleContainer")) {
      if (
        document.querySelector(".navitems__toggleContainer").style.right ===
        "0vw"
      ) {
        document.querySelector(".navitems__toggleContainer").style.right =
          "-41vw";
      } else {
        document.querySelector(".navitems__toggleContainer").style.right =
          "0vw";
      }
    }
  };

  render() {
    const isCSUser = this.props?.userMeta?.isCSUser;
    let content = (
      <BrandingContext.Consumer>
        {({ config }) => (
          <ul id="navitems" className="navitems__menu">
            <NavItem link="/" exact dontActivate={false}>
              <FormattedMessage id="navbar.navItems.search"></FormattedMessage>
            </NavItem>
            <NavItem
              link="/search_results_algolia/%3Fquery="
              dontActivate={false}
              clickFunction={this.goToSearchAll}
              id="nav_browse"
            >
              <FormattedMessage id="navbar.navItems.browse"></FormattedMessage>
            </NavItem>
            {config.modules.SimilaritySearch && (
              <NavItem
                link="/similar_tracks/"
                dontActivate={false}
                id="nav_SimilaritySearch"
              >
                <FormattedMessage id="navbar.navItems.SimilaritySearch"></FormattedMessage>
              </NavItem>
            )}
            {config.modules.SuperSearch && (
              <NavItem
                // exact={false}
                link="/supersearch/"
                dontActivate={false}
                clickFunction={this.goToSuperSearch}
                id="nav_supersearch"
              >
                <FormattedMessage id="navbar.navItems.supersearch"></FormattedMessage>
              </NavItem>
            )}
            {config.modules.voice && (
              <NavItem link="/voice/" dontActivate={false}>
                <FormattedMessage id="navbar.navItems.voice"></FormattedMessage>
              </NavItem>
            )}
            {isCSUser && this.renderCreationStationLink()}
            <NavItem link="/mymusic/" dontActivate={false}>
              <FormattedMessage id="navbar.navItems.myMusic"></FormattedMessage>
            </NavItem>
            {this.renderDocumentsLink()}
            {config.modules.showReportEnquiryModal && (
              <li className="navitem">
                <div
                  className={
                    isMobile ? "MobileNavbar--anchor" : "WebNavbar--anchor"
                  }
                >
                  <ReportBug FormattedMessageId="navbar.navItems.reportEnquiry" />
                </div>
              </li>
            )}
            <NavItem link="/logout" dontActivate={false}>
              <FormattedMessage id="navbar.navItems.logout"></FormattedMessage>
            </NavItem>
            {config.modules.showBasketDownload && (
              <NavItem
                link="/basket/"
                dontActivate={false}
                id="basket_nav"
                blurFunction={() => {
                  document.getElementById(
                    "basketPopup_container"
                  ).style.display = "none";
                }}
                hoverFunction={() => {
                  document.getElementById(
                    "basketPopup_container"
                  ).style.display = !this.props?.downloadBasket
                    ?.tracksInDownloadBasket?.length
                    ? "none"
                    : "block";
                }}
              >
                <Badge
                  badgeContent={
                    this.props?.downloadBasket?.tracksInDownloadBasket?.length
                  }
                  overlap="rectangular"
                >
                  <FaCartArrowDown
                    style={{
                      fontSize: "18px",
                    }}
                  />
                </Badge>
                <BasketPopup history={this.props.history} />
              </NavItem>
            )}
          </ul>
        )}
      </BrandingContext.Consumer>
    );

    return (
      <>
        <div className="toggleMenuContainer">
          <div
            className="toggleMeunBtn"
            onClick={() => {
              this.toggleMenu();
            }}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
          <div className="navitems__toggleContainer">{content}</div>
        </div>
        <div className="navitems__customHolder">{content}</div>
        <CustomClearAllRefs />
      </>
    );
  }
}

const ClearRefinements = ({ items, refine }) => (
  <button
    id="clearIt"
    style={{ display: "none" }}
    onClick={() => refine(items)}
    disabled={!items.length}
  >
    Clear all refinements
  </button>
);

const CustomClearAllRefs = connectCurrentRefinements(ClearRefinements);

const mapStateToProps = (state) => {
  return {
    downloadBasket: state.downloadBasket,
    authentication: state.authentication,
    userMeta: state.userMeta,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setResults: (result) => dispatch(setResults(result)),
  setResultsFor: (query) => dispatch(setResultsFor(query)),
  setSearchState: (search_state) => dispatch(setSearchState(search_state)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouterCompat(NavItems));
