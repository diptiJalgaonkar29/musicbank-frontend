import React, { useContext, useEffect } from "react";
import {
  connectCurrentRefinements,
  connectStats,
} from "react-instantsearch-dom";
import { SSCustomClearRefinements } from "./SSCustomClearRefinements";
import qs from "qs"
// import ssResultsNextArrow from "../../static/supersearch/ssResultsNextArrow.svg";
import { ReactComponent as SSResultsNextArrow } from "../../static/supersearch/ssResultsNextArrow.svg";
import { ReactComponent as GSTagRemove } from "../../static/supersearch/gsearch-close.svg";
import gsTagRemove from "../../static/supersearch/gsearch-close.svg";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import getAmpMainMoodTagLabel from "../../common/utils/getAmpMainMoodTagLabel";
import getSonicLogoMainMoodTagLabel from "../../common/utils/getSonicLogoMainMoodTagLabel";
import ChipWrapper from "../../branding/componentWrapper/ChipWrapper";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";

const jumpToSearchResult = () => {
  // console.log("click");
  //let clickEvent = new Event('click');
  //document.querySelector("#nav_browse").click();
  trackExternalAPICalls({
    url: "",
    requestData: "",
    usedFor: "SuperSearch To Browse Search",
    serviceBy: "Algolia",
    statusCode: 200,
    statusMessage: "",
  });
  const win = window.open(`/#/search_results_algolia/%3Fquery=`, "_self");
  win.focus();
};

const CustomStats = connectStats(({ nbHits, processingTimeMS }) => {
  return <span>{nbHits}</span>;
});

const SSCurrentRefinements = ({
  items,
  refine,
  createURL,
  ssBaseRef,
  clearedOnce,
}) => {
  //console.log("clearAll - chk",clearedOnce)

  useEffect(() => {
    localStorage.removeItem("persist:root");
  });
  const refineLabels = {
    tag_amp_mainmood: "Moods",
    tag_amp_mainmood_ids: "Moods",
    tag_genre: "Genre",
    tag_tempo: "Tempo",
    tag_soniclogo_mainmood: "Moods",
    tag_soniclogo_mainmood_ids: "Moods",
  };
  return (
    <>
      <div className="mtop20" />
      <ul className="gsTagList filteredTags" id="SSFilterdTags">
        {items.map((item) => {
          let itemTag = item.label.replace(": ", "");
          let itemTagLbl = item.label.replace(": ", "").replace("tag_", "");
          return (
            <li key={item.label} data-label={itemTag}>
              {item.items ? (
                <React.Fragment>
                  <ul>
                    {process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER && (
                      <li className="refine-tag-label">
                        {refineLabels[itemTag] || itemTag}:{" "}
                      </li>
                    )}
                    {item.items.map((nested) => (
                      <li
                        key={nested.label}
                        data-label={nested.label}
                        data-labelP={itemTag}
                      >
                        <ChipWrapper
                          label={
                            itemTag === "tag_amp_mainmood_ids"
                              ? getAmpMainMoodTagLabel(nested.label)
                              : getSonicLogoMainMoodTagLabel(nested.label)
                          }
                          className={itemTag}
                          onClose={() => {
                            if (
                              document.getElementById(
                                `btag_${nested.label}`
                              ) !== null
                            )
                              document
                                .getElementById(`btag_${nested.label}`)
                                .dispatchEvent(new Event("click"));
                            refine(nested.value);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </React.Fragment>
              ) : (
                <span
                  className={`gsTagContainer ${itemTag}`}
                  style={{
                    backgroundColor: `var(--color-bubbletag-${item.label}) !important`,
                  }}
                >
                  <span className="gsTagText">
                    {item.label} {item.count}
                  </span>
                  <button
                    className="gsTagRemove"
                    onClick={(event) => {
                      event.preventDefault();
                      if (
                        document.getElementById(`btag_${item.label}`) !== null
                      )
                        document
                          .getElementById(`btag_${item.label}`)
                          .dispatchEvent(new Event("click"));
                      refine(item.value);
                    }}
                  ></button>
                </span>
              )}
            </li>
          );
        })}

        <SSCustomClearRefinements ssBaseRef={ssBaseRef} />
        <li>
          <ButtonWrapper onClick={jumpToSearchResult}>
            Search (<CustomStats />)
          </ButtonWrapper>
          {/* <ChipWrapper onClick={jumpToSearchResult}>
            Search (<CustomStats />)
          </ChipWrapper> */}
        </li>
      </ul>
    </>
  );
};

export const SSCustomCurrentRefinements =
  connectCurrentRefinements(SSCurrentRefinements);
