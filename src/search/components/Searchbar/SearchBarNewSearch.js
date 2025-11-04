import Autocomplete from "downshift";
import qs from "qs";
import React, { Component } from "react";
import { connectAutoComplete } from "react-instantsearch-dom";
import { Configure, Index } from "react-instantsearch-dom";
import { connect } from "react-redux";

import { ReactSVG } from "react-svg";
import { toggleModalView } from "../../../redux/actions/layoutActions/index";
import {
  setResults,
  setResultsFor,
  setSearchState,
  setSearchUrl,
} from "../../../redux/actions/searchActions/index";
import MagnifingGlass from "../../../static/magnifing-glass.svg";
import "../../../_styles/SearchInput.css";
import CustomDropDownElement from "./components/CustomDropDownElement";
import {
  DropDownNewSearch,
  SearchElementWrapper,
  SearchTextBox,
} from "./SearchBarStyles";
import { TitleNewSearch } from "./Title";
import getAlogilaTags from "../../../common/utils/getAlogilaTags";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

class RawAutoComplete extends Component {
  state = {
    closeProp: false,
  };

  userClickedOnElementInDropdown = (item) => {
    let searchUrl = this.props.search_url;
    const parsedUrl = qs.parse(searchUrl);

    if (item.type === "Track") {
      this.props.setResultsFor(item.track_name);
    }

    if (item.type !== "Track") {
      this.props.setResultsFor(item.name);
      this.props.setResults(item.name);
    }

    const newQueryString = {
      ...parsedUrl,
      "?query": item.type === "Track" ? item.track_name : item.name,
    };
    const urlWithNewQuery = qs.stringify(newQueryString);
    this.props.navigate(`/search_results_algolia/${urlWithNewQuery}`);
    this.props.toggleModal();
  };

  render() {
    const { refine, hits } = this.props;

    return (
      <SearchElementWrapper closeProp={this.state.closeProp}>
        <SearchTextBox>
          <TitleNewSearch />
        </SearchTextBox>
        <Autocomplete
          className="SearchInputWarpperWithDropdown"
          itemToString={(i) => (i ? i.name : i)}
          onChange={(item) => this.userClickedOnElementInDropdown(item)}
          selectedItem={this.props.searchedForProp}
        >
          {({
            getInputProps,
            getItemProps,
            highlightedIndex,
            isOpen,
            selectedItem,
          }) => (
            <div>
              {selectedItem ? (
                <div className="search-container">
                  <input
                    className="search-input"
                    {...getInputProps({
                      id: "search",
                      onChange(e) {
                        refine(e.target.value);
                      },
                    })}
                  />
                  <ReactSVG
                    svgstyle={{ transform: "scale(1.35)" }}
                    className="search-icon"
                    src={`${MagnifingGlass}`}
                  />
                </div>
              ) : (
                <div className="search-container">
                  <input
                    className="search-input"
                    {...getInputProps({
                      id: "search",
                      onChange(e) {
                        refine(e.target.value);
                      },
                    })}
                  />
                  <ReactSVG
                    svgstyle={{ transform: "scale(1.35)" }}
                    className="search-icon"
                    src={`${MagnifingGlass}`}
                  />
                </div>
              )}
              {isOpen && (
                <DropDownNewSearch id="DropDownNewSearchElement">
                  <CustomDropDownElement
                    position={1} // changing the position will cause sideEffects
                    name="Tracks"
                    typeProp="Track"
                    attribute="track_name"
                    hits={hits}
                    highlightedIndex={highlightedIndex}
                    getItemProps={getItemProps}
                  />

                  <CustomDropDownElement
                    position={2} // changing the position will cause sideEffects
                    name="Musical Feel"
                    typeProp="Emotions"
                    attribute="name"
                    hits={hits}
                    highlightedIndex={highlightedIndex}
                    getItemProps={getItemProps}
                  />

                  <CustomDropDownElement
                    position={3} // changing the position will cause sideEffects
                    name="Instruments"
                    typeProp="Instruments"
                    attribute="name"
                    hits={hits}
                    highlightedIndex={highlightedIndex}
                    getItemProps={getItemProps}
                  />

                  <CustomDropDownElement
                    position={4} // changing the position will cause sideEffects
                    name="Genre"
                    typeProp="Genre"
                    attribute="name"
                    hits={hits}
                    highlightedIndex={highlightedIndex}
                    getItemProps={getItemProps}
                  />

                  <CustomDropDownElement
                    position={5} // changing the position will cause sideEffects
                    name="Used In"
                    typeProp="Used_In"
                    attribute="name"
                    hits={hits}
                    highlightedIndex={highlightedIndex}
                    getItemProps={getItemProps}
                  />
                </DropDownNewSearch>
              )}
            </div>
          )}
        </Autocomplete>
      </SearchElementWrapper>
    );
  }
}

// Connect to Redux Store
const mapDispatchToProps = (dispatch) => {
  return {
    setResults: (result) => dispatch(setResults(result)),
    setResultsFor: (query) => dispatch(setResultsFor(query)),
    setSearchState: (search_state) => dispatch(setSearchState(search_state)),
    toggleModal: () => dispatch(toggleModalView()),
    setSearchUrl: (url) => dispatch(setSearchUrl(url)),
  };
};

const mapStateToProps = (state) => {
  return {
    search_url: state.search.search_url,
  };
};

const AutoCompleteWithData = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouterCompat(connectAutoComplete(RawAutoComplete)));

// Connect with Algolia Settings
function SearchBarNewSearch() {
  return (
    <React.Fragment>
      <AutoCompleteWithData />
      {process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER ? (
        <>
          <Index indexName={getAlogilaTags().genreIndex}>
            <Configure
              filters="is_assigned:true"
              hitsPerPage={process.env.REACT_APP_AMOUNT_SEARCH_RESULT}
            />
          </Index>
          <Index indexName={getAlogilaTags().keyIndex}>
            <Configure
              filters="is_assigned:true"
              hitsPerPage={process.env.REACT_APP_AMOUNT_SEARCH_RESULT}
            />
          </Index>
          <Index indexName={getAlogilaTags().ampMainMoodIndex}>
            <Configure
              filters="is_assigned:true"
              hitsPerPage={process.env.REACT_APP_AMOUNT_SEARCH_RESULT}
            />
          </Index>
        </>
      ) : (
        <>
          <Index indexName={getAlogilaTags().emotionIndex}>
            <Configure
              filters="is_assigned:true"
              hitsPerPage={process.env.REACT_APP_AMOUNT_SEARCH_RESULT}
            />
          </Index>
          <Index indexName={getAlogilaTags().intrumentIndex}>
            <Configure
              filters="is_assigned:true"
              hitsPerPage={process.env.REACT_APP_AMOUNT_SEARCH_RESULT}
            />
          </Index>
          <Index indexName={getAlogilaTags().genreIndex}>
            <Configure
              filters="is_assigned:true"
              hitsPerPage={process.env.REACT_APP_AMOUNT_SEARCH_RESULT}
            />
          </Index>
          <Index indexName={getAlogilaTags().usedInIndex}>
            <Configure
              filters="is_assigned:true"
              hitsPerPage={process.env.REACT_APP_AMOUNT_SEARCH_RESULT}
            />
          </Index>
        </>
      )}
    </React.Fragment>
  );
}

export default SearchBarNewSearch;
