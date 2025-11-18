// AlgoliaWrapperV2.jsx
import { InstantSearch, Configure } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import { useAlgoliaIndex } from "./AlgoliaIndexContext"; // adjust path as needed
import { BrandingContext } from "../../branding/provider/BrandingContext";
import getSuperBrandId from "../../common/utils/getSuperBrandId";
import React from "react";
import { brandConstants } from "../../common/utils/brandConstants";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { useContext } from "react";
const searchClient = algoliasearch(
  "UGELINWMHK",
  "ca0ae95e4a09ce03c09546001ac1a6d3"
);

const superBrandId = getSuperBrandId();
const brandId =
  BrandingContext._currentValue?.config?.brandId ||
  localStorage.getItem("brandId");
//const serverName = process.env.REACT_APP_SERVER_NAME;

const AlgoliaWrapperV2 = ({ children }) => {
  const { config } = useContext(BrandingContext);
  const { indexName } = useAlgoliaIndex(); // dynamic from context
  let serverName = "";
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    serverName = config?.modules?.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }

  const filterQuery =
    serverName === "sh2Dev" || serverName === "sh2Wpp"
      ? `analysis_status=1 AND facet_brand_assigned:"${serverName}-${superBrandId}_${brandId}:true" AND facet_isTrackActive:"${serverName}-${superBrandId}_${brandId}:true" AND facet_trackStatus:"${serverName}-${superBrandId}_${brandId}:true"`
      : `analysis_status=1 AND brands_assigned=${brandId} AND trackStatus:true AND sonichub_track_id>0`;

  return (
    <div>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <Configure hitsPerPage={15} filters={filterQuery} />
        {children}
      </InstantSearch>
    </div>
  );
};

export default AlgoliaWrapperV2;
