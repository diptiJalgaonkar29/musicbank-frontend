import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { withStyles } from "@mui/styles";
import qs from "qs";
import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { connectScrollTo } from "react-instantsearch-dom";

import { connect } from "react-redux";
import SearchResultsFooter from "../../../common/components/Footer/SearchResultsPageFooter";

import CreatePlaylistModal from "../../../playlist/components/CreatePlaylistModal/CreatePlaylistModal";
import {
  setResults,
  setSearchState,
  setResultsFor,
} from "../../../redux/actions/searchActions";
import "../../../_styles/Accordion.css";
import "../../../_styles/ResponsivenessRetina.css";
import NewSearchDialog from "../../components/Dialog/NewSearchDialog";
import InstrumentalVocalFilter from "../../components/InstrumentalVocalFilter/InstrumentalVocalFilter";

import SearchResultsPageHoc from "../../layout/SearchResultsPageHoc";
import {
  CurrentRefinementsSection,
  HiddenTagAllRefinement,
  ResultsForText,
  SearchFilters,
} from "./SearchResultsPageFragments";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { connectHits } from "react-instantsearch-dom";
import ReactPagination from "./ReactPagination";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const { v4: uuidv4 } = require('uuid');

const updateAfter = 700;
const createURL = (state) => `?${qs.stringify(state)}`;
const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : "";

// var shuffled = false;

// var allTracks = [];

class ScrollTo extends Component {
  componentDidUpdate(prevProps) {
    const { value, hasNotChanged } = this.props;

    if (value !== prevProps.value && hasNotChanged) {
      this.el.scrollIntoView();
    }
  }

  render() {
    return <div ref={(ref) => (this.el = ref)}>{this.props.children}</div>;
  }
}

const drawerWidth = "40rem";

const styles = {
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#04070e",
    color: "var(--color-white)",
  },
};

class SearchResultsPage extends Component {
  state = {
    query: "",
    typeOfQuery: "",
    refinements: null,
    resultsOnLoad: null,
    loading: true,
    toggle: true,
    queryReduxFromState: "",
    uniqueKey: null,
    mobileDrawerOpen: false,
  };

  componentDidMount() {
    // console.log("componentDidMount " + this.props.results_for);
    this.getNewId();
    const searchState = this.props.search_state;
    const newState = {
      ...searchState,
      query: this.props.results_for,
    };

    this.props.setSearchState(newState);
  }

  componentDidUpdate(prevProps) {
    // console.log(
    //   "componentDidUpdate- refinementList" +
    //     prevProps.search_state.refinementList,
    //   this.props.search_state.refinementList
    // );
    // update Url and Search State here, (because of new refinements)
    if (
      prevProps.search_state.refinementList !==
      this.props.search_state.refinementList
    ) {
      // console.log("componentDidUpdate1- " + this.props.search_state);
      clearTimeout(this.debouncedSetState);
      this.debouncedSetState = setTimeout(() => {
        this.props.navigate(
          searchStateToUrl(this.props, this.props.search_state),
          this.props.search_state
        );
      }, updateAfter);
    }

    // console.log(
    //   "componentDidUpdate-- " + this.props.queryRedux,
    //   prevProps.queryRedux + "|| " + this.props.newSearch,
    //   prevProps.newSearch
    // );

    if (
      this.props.queryRedux !== prevProps.queryRedux ||
      this.props.newSearch !== prevProps.newSearch
    ) {
      // console.log("componentDidUpdate1-- " + this.props.queryRedux);
      this.setState({
        queryReduxFromState: this.props.queryRedux,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout();
    this.props.setSearchState({});
    this.props.setResultsFor("");
  }

  getNewId() {
    let uniqueKey = uuidv4();
    this.setState({
      uniqueKey: uniqueKey,
    });
  }

  setToggle = () => {
    this.setState(({ toggle }) => ({ toggle: !toggle }));
  };

  renderSideBar(_ShowBPMSlider) {
    return (
      <React.Fragment>
        <InstrumentalVocalFilter attribute={"is_instrumental"} />
        <div style={{ display: "none" }}>
          {this.props.newSearch === false ? (
            <HiddenTagAllRefinement
              newSearchID={this.props.newSearchID}
              uniqueKey={this.state.uniqueKey}
              queryReduxFromState={this.state.queryReduxFromState}
              queryRedux={this.props.queryRedux}
            />
          ) : null}
        </div>
        <SearchFilters isShowBPMSlider={_ShowBPMSlider} />
      </React.Fragment>
    );
  }

  toggleDrawer = (e) => {
    if (e && e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }

    this.setState({ mobileDrawerOpen: true });
  };
  closeDrawer = () => {
    this.setState({ mobileDrawerOpen: false });
  };

  renderWebVersion(Results, _ShowBPMSlider) {
    //extra code - vikas

    setTimeout(function () {
      if (document.querySelector(".searchResults__results--header")) {
        let boxSResult = document.querySelector(
          ".searchResults__results--header"
        );
        let heightSResult = boxSResult?.offsetHeight;
        let height = heightSResult + 20;
        document.getElementById("searchResults_container") &&
          (document.getElementById("searchResults_container").style.marginTop =
            height + "px");
      }
    }, 1000);

    /////////////
    return (
      <React.Fragment>
        <div className="searchResults__refinements">
          {this.renderSideBar(_ShowBPMSlider)}
        </div>
        <div className="searchResults__results">
          <div className="searchResults__results--header">
            <div className="searchResults__results--headerTextBox">
              <NewSearchDialog isShowBPMSlider={_ShowBPMSlider} />
              {/* {this.props.results_for && (
                <ResultsForText results_for={this.props.results_for} />
              )} */}
              <ResultsForText results_for={this.props.results_for} />
            </div>

            <div className="searchResults__results--refinements">
              <CurrentRefinementsSection />
            </div>
          </div>

          <div
            className="searchResults__results--body"
            id="searchResults_container"
          >
            <div className="results__hits--cards">
              <CustomScrollTo /* scrollOn="page" */>{Results}</CustomScrollTo>
            </div>

            {/* <ReactPagination allTracksData = {allTracks} />  */}

            {/* <SearchResultsPagination /> */}
            <SearchResultsFooter />
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderMobileVersion(Results, _ShowBPMSlider) {
    setTimeout(function () {
      let navMobile = document.querySelector(".navbar__container");
      let heightNavMobile = navMobile.offsetHeight;
      let boxSResult = document.querySelector(
        ".searchResults__Mobile__results--header"
      );
      let heightSResult = boxSResult.offsetHeight;
      let height = heightNavMobile + heightSResult + 20;
      document.getElementById("searchResultsMobile_container").style.marginTop =
        height + "px";
    }, 1000);
    return (
      <React.Fragment>
        <SwipeableDrawer
          anchor="left"
          ModalProps={{ keepMounted: true }}
          classes={{
            paper: this.props.classes.drawerPaper,
          }}
          open={this.state.mobileDrawerOpen}
          onClose={this.closeDrawer}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          {this.renderSideBar(_ShowBPMSlider)}
        </SwipeableDrawer>

        <div className="searchResults__Mobile__results">
          <div className="searchResults__Mobile__results--header">
            <div className="searchResults__results--headerTextBox">
              <NewSearchDialog isShowBPMSlider={_ShowBPMSlider} />
              {/* {this.props.results_for && ( 
                <ResultsForText results_for={this.props.results_for} />
              )} */}
              <ResultsForText results_for={this.props.results_for} />
            </div>

            <div className="searchResults__results--refinements">
              <div className="ais-ClearRefinements">
                <button
                  className="openFilter-button"
                  onClick={(e) => this.toggleDrawer(e)}
                >
                  &#8592; Open Filter
                </button>
              </div>
              <CurrentRefinementsSection />
            </div>
          </div>

          <div
            className="searchResults__results--body"
            id="searchResultsMobile_container"
          >
            <div className="results__Mobile__hits--cards">
              {" "}
              <ScrollTo /* scrollOn="page" */>{Results}</ScrollTo>
            </div>
            {/* sahil */}
            {/* <ReactPagination />  */}

            {/* <SearchResultsPagination  /> */}
            <SearchResultsFooter />
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderSearchResultBlocks(hits, config) {
    if (config.modules.ShuffledTracks) {
      hits = hits.sort(() => Math.random() - 0.5);

      // loadTrackData();
    }
    return (
      <>
        <ReactPagination allTracksData={hits} config={config} />
      </>
    );
  }

  render() {
    const { createNewPlaylistDialogOpen } = this.props;

    const Hits = ({ hits }) => {
      return (
        <BrandingContext.Consumer>
          {({ config }) => <>{this.renderSearchResultBlocks(hits, config)}</>}
        </BrandingContext.Consumer>
      );
    };

    const CustomHits = connectHits(Hits);
    let Results = <CustomHits />;

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <SearchResultsPageHoc>
            <CreatePlaylistModal openProp={createNewPlaylistDialogOpen} />
            {isMobile
              ? this.renderMobileVersion(Results, config.modules.ShowBPMSlider)
              : this.renderWebVersion(Results, config.modules.ShowBPMSlider)}
          </SearchResultsPageHoc>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const CustomScrollTo = connectScrollTo(ScrollTo);
// Redux connector
const mapDispatchToProps = (dispatch) => {
  return {
    setSearchState: (search_state) => dispatch(setSearchState(search_state)),
    setResultsFor: (result) => dispatch(setResultsFor(result)),
    setResults: (result) => dispatch(setResults(result)),
  };
};

const mapStateToProps = (state) => {
  return {
    result: state.search,
    refinement_items: state.refinement_items,
    queryRedux: state.search.search_result,
    results_for: state.search.results_for,
    createNewPlaylistDialogOpen: state.playlist.createNewPlaylistDialog,
    search_state: state.search.search_state,
    newSearch: state.layout.newSearchModalOpen,
    newSearchID: state.layout.id,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchResultsPage));
