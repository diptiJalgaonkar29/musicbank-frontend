import Autocomplete from "downshift";
import qs from "qs"
import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { connectAutoComplete } from "react-instantsearch-dom";
import { connect } from "react-redux";

import { scroller } from "react-scroll";
import { ReactSVG } from "react-svg";
import { compose } from "redux";
import {
  setDropdownOpenState,
  setResults,
  setResultsFor,
} from "../../../redux/actions/searchActions/index";
import MagnifingGlass from "../../../static/magnifing-glass.svg";
import "../../../_styles/ResponsivenessRetina.css";
import CustomDropDownElement from "./components/CustomDropDownElement";
import {
  DropDownTSP,
  SearchElementWrapperTSP,
  SearchTextBoxTSP,
} from "./SearchBarStyles";
import "./SearchBarTSP.css";
import { TitleHomepage } from "./Title";

class SearchBarWithDropdown extends Component {
  state = {
    dropDownOpen: false,
  };

  userClickedOnElementInDropdown = (item) => {
    let searchUrl = this.props.search_url;
    const parsedUrl = qs.parse(searchUrl);

    if (item.type === "Track") {
      this.props.setResultsFor(item.track_name);
      this.props.refine(item.track_name);
    }

    if (item.type !== "Track") {
      this.props.setResultsFor(item.name);
      this.props.setResults(item.name);
      this.props.refine(item.name);
    }
    const newQueryString = {
      ...parsedUrl,
      "?query": item.type === "Track" ? item.track_name : item.name,
    };

    const urlWithNewQuery = qs.stringify(newQueryString);
    this.props.navigate(`/search_results_algolia/${urlWithNewQuery}`);
  };

  searchAll = () => {
    this.props.setResultsFor(" ");
    this.props.setResults("");
    let searchUrl = this.props.search_url;
    const parsedUrl = qs.parse(searchUrl);

    const newQueryString = {
      ...parsedUrl,
      "?query": "",
    };

    const urlWithNewQuery = qs.stringify(newQueryString);
    this.props.navigate(`/search_results_algolia/${urlWithNewQuery}`);
  };

  triggerSearchBoxAnimationOnMobile = () => {
    // "scroll-to-point-search-mobile" is the second line of the heading
    scroller.scrollTo("scroll-to-point-search-mobile", {
      duration: 1000,
      delay: 100,
      smooth: true,
      offset: -10,
    });
  };

  stateReducer(state, changes) {
    this.toggleDropdowState(changes.isOpen);
  }

  toggleDropdowState(dropdownState) {
    this.props.setDropdownOpenState(dropdownState);
  }

  render() {
    const { refine, hits } = this.props;

    return (
      <SearchElementWrapperTSP>
        <SearchTextBoxTSP>
          <TitleHomepage />
        </SearchTextBoxTSP>
        <Autocomplete
          onStateChange={this.stateReducer.bind(this)}
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
              {!selectedItem && (
                <div className="search-container">
                  <input
                    onFocus={
                      isMobile ? this.triggerSearchBoxAnimationOnMobile : null
                    }
                    className="search-input"
                    {...getInputProps({
                      id: "search-dropdown",
                      placeholder: "tag, title or attribute ...",
                      onChange(e) {
                        refine(e.target.value);
                      },
                    })}
                  />

                  <ReactSVG className="search-icon" src={`${MagnifingGlass}`} />
                </div>
              )}
              {isOpen && (
                <DropDownTSP id="DropDownContainer">
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
                    hits={hits} //hits[2] = "dev_Emotions"
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
                </DropDownTSP>
              )}
            </div>
          )}
        </Autocomplete>
      </SearchElementWrapperTSP>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setResults: (result) => dispatch(setResults(result)),
    setResultsFor: (query) => dispatch(setResultsFor(query)),
    setDropdownOpenState: (isOpen) => dispatch(setDropdownOpenState(isOpen)),
  };
};

const mapStateToProps = (state) => {
  return {
    search_url: state.search.search_url,
  };
};

// Connect to Redux Store
const SearchBarWithDropdownComponent = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouterCompat,
  connectAutoComplete
)(SearchBarWithDropdown);

// Connect with Algolia Settings
function SearchBarWithDropdownComponentWithAlgolia() {
  return (
    <React.Fragment>
      <SearchBarWithDropdownComponent />
      {process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER ? (
        <>
          {/* <Index indexName={getAlogilaTags().genreIndex}>
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
          </Index> */}
        </>
      ) : (
        <>
          {/* <Index indexName={getAlogilaTags().emotionIndex}>
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
          </Index> */}
        </>
      )}
    </React.Fragment>
  );
}

export default SearchBarWithDropdownComponentWithAlgolia;
