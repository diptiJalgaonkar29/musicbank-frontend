import React from "react";
import {
  Pagination,
  RefinementList,
  ToggleRefinement,
} from "react-instantsearch-dom";
import { connectStats } from "react-instantsearch-dom";
import { ClearRefinements } from "react-instantsearch-dom";
import { FormattedMessage } from "react-intl";
import SearchFilterWithOneHierarchy from "../../components/SearchFilters/SearchFilterWithOneHierachy";
import SearchFilterWithoutHierarchy from "../../components/SearchFilters/SearchFilterWithoutHierarchy";
import SearchFilterWithTwoHierachies from "../../components/SearchFilters/SearchFilterWithTwoHierachies";

import { SearchResultCurrentRefinement } from "./SearchResultCurrentRefinement";
import SearchFilterWithoutHierarchyTaxonomy from "../../components/SearchFilters/SearchFilterWithoutHierarchyTaxonomy";

// Search Filters
export function SearchFilters(_isShowBPMSlider) {
  const musicFeelElements = [
    { name: "Feeling", attribute: "tag_feelings" },
    { name: "Tonality", attribute: "tag_tonality" },
    { name: "Motion", attribute: "tag_motion" },
    { name: "Impact", attribute: "tag_impact" },
  ];

  const isShowBPMSlider = _isShowBPMSlider.isShowBPMSlider;

  const IS_TAXOMONY_SERVER =
    process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER;

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
      {isShowBPMSlider && (
        <SearchFilterWithoutHierarchy
          name="Tempo"
          attribute="tag_tempo"
          isRangerSlider={true}
        />
      )}
      {IS_TAXOMONY_SERVER ? (
        <>
          <SearchFilterWithoutHierarchyTaxonomy
            name="Musical Feel"
            attribute="tag_amp_allmood_ids"
          />
          <div style={{ display: "none" }}>
            <SearchFilterWithoutHierarchyTaxonomy
              name="Mood"
              attribute="tag_amp_mainmood_ids"
            />
            {/* <SearchFilterWithoutHierarchyTaxonomy
            name="Sonic Logo Mood"
            attribute="tag_soniclogo_mainmood_ids"
          /> */}
          </div>
          <SearchFilterWithoutHierarchyTaxonomy
            name="Instruments"
            attribute="instrument_ids"
          />
          <SearchFilterWithoutHierarchy name="Key" attribute="tag_key" />
        </>
      ) : (
        <>
          <SearchFilterWithOneHierarchy
            name="Musical Feel"
            elements={musicFeelElements}
          />
          <SearchFilterWithTwoHierachies
            name="Instruments"
            attribute="instruments"
          />
        </>
      )}
      <div style={{ display: "none" }}>
        <SearchFilterWithoutHierarchy name="Tempo" attribute="tag_tempo" />
      </div>
      <SearchFilterWithoutHierarchy name="Genre" attribute="tag_genre" />
      {IS_TAXOMONY_SERVER && (
        <SearchFilterWithoutHierarchyTaxonomy
          name="Asset Type"
          attribute="assetTypeId"
        />
      )}
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
const CustomStats = connectStats(({ nbHits }) => {
  return <span className="resultCount">{nbHits}</span>;
});

export function ResultsForText({ results_for }) {
  if (results_for === " ") {
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

      <SearchResultCurrentRefinement
        transformItems={(items) =>
          items.filter((item) => {
            if (
              item.attribute === "trackStatus" ||
              item.attribute === "trackActive"
            ) {
              return null;
            } else if (item.attribute === "tag_all") {
              return null;
            } else if (item.attribute === "tempo") {
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
              if (item.attribute !== "is_instrumental") return `${item.label}`;
            }
            return null;
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
