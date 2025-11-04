import React, { useEffect } from "react";
import { connectCurrentRefinements } from "react-instantsearch-dom";
//import { ref } from "yup";
import SearchIcon from "../../static/supersearch/ssClose_clearAll.svg";
import trackExternalAPICalls from "../../common/services/trackExternalAPICalls";

//let clearedOnce = false;

const SSClearRefinements = ({ items, refine, ssBaseRef, clearedOnce }) => {
  return (
    <li>
      <span
        className="gsTagClearAll"
        onClick={() => {
          refine(items);
          trackExternalAPICalls({
            url: "",
            requestData: "",
            usedFor: "clearAllSuperSearch",
            serviceBy: "Algolia",
            statusCode: 200,
            statusMessage: "",
          });
          if (ssBaseRef.current !== null) ssBaseRef.current.clearAllFilter();
        }}
        disabled={!items.length}
      >
        Clear All
        {/* <img src={SearchIcon} alt={SearchIcon} className="ssClose_clearAll" /> */}
      </span>
    </li>
  );
};

export const SSCustomClearRefinements =
  connectCurrentRefinements(SSClearRefinements);
