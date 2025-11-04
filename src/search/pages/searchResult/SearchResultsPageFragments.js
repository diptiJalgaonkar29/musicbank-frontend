import React from "react";

import {
  Pagination,
  RefinementList,
  ToggleRefinement,
} from "react-instantsearch-dom";
import { connectStats } from "react-instantsearch-dom";
import { ClearRefinements, CurrentRefinements } from "react-instantsearch-dom";
import { FormattedMessage } from "react-intl";

import SearchFilterWithOneHierarchy from "../../components/SearchFilters/SearchFilterWithOneHierachy";
import SearchFilterWithoutHierarchy from "../../components/SearchFilters/SearchFilterWithoutHierarchy";
import SearchFilterWithTwoHierachies from "../../components/SearchFilters/SearchFilterWithTwoHierachies";
import TRangeSlider from "../../components/SearchFilters/components/RangeSlider";

//addition by Trupti-Wits

// Search Filters
export function SearchFilters(_isShowBPMSlider) {
  const musicFeelElements = [
    { name: "Feeling", attribute: "tag_feelings" },
    { name: "Tonality", attribute: "tag_tonality" },
    { name: "Motion", attribute: "tag_motion" },
    { name: "Impact", attribute: "tag_impact" },
  ];

  const isShowBPMSlider = _isShowBPMSlider.isShowBPMSlider;

  return (
    <React.Fragment>
      {/* <div style={{ display: "none" }}>
        <ToggleRefinement
          attribute="trackStatus"
          label="trackStatus"
          value={true}
          defaultRefinement={true}
        />
      </div> */}
      {isShowBPMSlider && <TRangeSlider name="Tempo" attribute="tempo" />}

      <SearchFilterWithOneHierarchy
        name="Musical Feel"
        elements={musicFeelElements}
      />

      <SearchFilterWithTwoHierachies
        name="Instruments"
        attribute="instruments"
      />

      <SearchFilterWithoutHierarchy name="Key" attribute="tag_key" />

      <SearchFilterWithoutHierarchy name="Tempo" attribute="tag_tempo" />
      <SearchFilterWithoutHierarchy name="Genre" attribute="tag_genre" />
      <SearchFilterWithTwoHierachies name="Used In" attribute="used_in" />
    </React.Fragment>
  );
}

//Pagination
export function SearchResultsPagination() {
  return (
    <Pagination
      padding={5}
      translations={{
        previous: "‹",
        next: "›",
        first: "«",
        last: "»",
        page(currentRefinement) {
          return currentRefinement;
        },
        ariaPrevious: "Previous page",
        ariaNext: "Next page",
        ariaFirst: "First page",
        ariaLast: "Last page",
        ariaPage(currentRefinement) {
          return `Page ${currentRefinement}`;
        },
      }}
    />
  );
}

// Results For Text
const CustomStats = connectStats(({ nbHits, processingTimeMS }) => {
  return <span>{nbHits}</span>;
});

export function ResultsForText({ results_for }) {
  // console.log("ResultsForText ", results_for);
  if (results_for === "") {
    return (
      <React.Fragment>
        <h1 style={{ margin: "0rem 5rem", minWidth: "37.3rem" }}>
          <span>Search Results</span>

          <span style={{ fontSize: "22px" }}>&nbsp;({<CustomStats />})</span>
        </h1>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <h1 style={{ margin: "1.5rem 5rem", minWidth: "37.3rem" }}>
          <span>
            {" "}
            <FormattedMessage id="results.page.resultsFor" />{" "}
          </span>
          <span>{`${results_for}`}</span>
          <span style={{ fontSize: "22px" }}>&nbsp;({<CustomStats />})</span>
        </h1>
      </React.Fragment>
    );
  }
}

// Current Refinements
export function CurrentRefinementsSection() {
  return (
    <React.Fragment>
      <ClearRefinements
        transformItems={(items) =>
          items.filter((item) => {
            if (
              item.attribute === "trackStatus" ||
              item.attribute === "trackActive"
            ) {
              return null;
            } else if (item.attribute === "tag_all") {
              return null;
            } else {
              return item.attribute !== "is_instrumental";
            }
          })
        }
        translations={{
          reset: "Clear all filters",
        }}
      />
      <CurrentRefinements
        transformItems={(items) =>
          items.filter((item) => {
            if (
              item.attribute === "trackStatus" ||
              item.attribute === "trackActive"
            ) {
              return null;
            } else if (item.attribute === "tag_all") {
              return null;
            }
            //addition for custom label of range in refinement - Trupti_Wits_26062020
            else if (item.attribute === "tempo") {
              //console.log("on change - add label")
              let labelValL =
                item.currentRefinement.min === undefined
                  ? item.min
                  : item.currentRefinement.min;
              let labelValR =
                item.currentRefinement.max === undefined
                  ? item.max
                  : item.currentRefinement.max;
              item.label = "BPM: " + labelValL + "-" + labelValR;
              item.items = [{ label: item.label, value: item.value }];
              return true;
            } else {
              return item.attribute !== "is_instrumental";
            }
          })
        }
      />
    </React.Fragment>
  );
}

// Hidden Tag_All Refinement
export function HiddenTagAllRefinement({
  newSearchID,
  uniqueKey,
  queryReduxFromState,
  queryRedux,
}) {
  return (
    <RefinementList
      key={newSearchID ? newSearchID : uniqueKey}
      limit={500}
      attribute="tag_all"
      defaultRefinement={
        newSearchID ? [`${queryReduxFromState}`] : [`${queryRedux}`]
      }
      showMore={true}
    />
  );
}
