import React, { Component } from "react";
import { InstantSearch, ToggleRefinement } from "react-instantsearch-dom";
import { connect } from "react-redux";

import {
  setRefinementItem,
  setResults,
  setResultsFor,
  setSearchState,
  setSearchUrl,
} from "../../../redux/actions/searchActions/index";
import {
  setJobHistoryProccessedData,
  removeAllJobHistoryProccessedData,
} from "../../../redux/actions/jobHistoryData/jobHistoryData";
import getAlogilaMeta from "../../../common/utils/getAlogilaMeta";
import { setInitDownloadBasket } from "../../../redux/actions/trackDownloads/tracksDownload.js";
import { withRouterCompat } from "../../utils/withRouterCompat.js";

const _ = require("lodash");
const updateAfter = 300;

class AlgoliaWrapper extends Component {
  static defaultProps = {
    alogilaMeta: getAlogilaMeta(),
  };

  onSearchStateChange = (searchState) => {
    // console.log("searchState", searchState);
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      if (
        !searchState?.refinementList &&
        !searchState?.range &&
        !searchState?.query
      )
        return;
      if (searchState?.range) {
        this.props.setSearchState(searchState);
        return;
      }
      if (searchState?.query) {
        this.props.setSearchState(searchState);
        return;
      }

      let isEmptyRefinementList = Object.values(
        searchState?.refinementList || {}
      ).every((x) => x === null || x === "");

      if (isEmptyRefinementList) {
        this.props.setSearchState(searchState);
        this.props.setRefinementItem([]);
        return;
      }

      this.props.setSearchState(searchState);
      const refinements = searchState.refinementList;
      const refinementValues = Object.values(refinements);
      const flattenrefinementArray = _.flatten(refinementValues);
      this.props.setRefinementItem(
        (flattenrefinementArray || []).filter(Boolean)
      );
    }, updateAfter);
  };

  render() {
    return (
      <InstantSearch
        appId={this.props.alogilaMeta.appID}
        apiKey={this.props.alogilaMeta.token}
        indexName={this.props.alogilaMeta.index}
        searchState={this.props.search_state}
        onSearchStateChange={this.onSearchStateChange}
        createURL={this.createURL}
      >
        <div style={{ display: "none" }}>
          <ToggleRefinement
            attribute="trackStatus"
            label="trackStatus"
            value={true}
            defaultRefinement={true}
          />
        </div>
        <div style={{ display: "none" }}>
          <ToggleRefinement
            attribute="trackActive"
            label="trackActive"
            value={true}
            defaultRefinement={true}
          />
        </div>
        {this.props.children}
      </InstantSearch>
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
  };
};

export default withRouterCompat(
  connect(mapStateToProps, mapDispatchToProps)(AlgoliaWrapper)
);
