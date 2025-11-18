import _ from "lodash";
import React, { useContext, useRef, useState } from "react";
import AsyncService from "../../networking/services/AsyncService";
import IconWrapper from "../../branding/componentWrapper/IconWrapper";
import algoliasearch from "algoliasearch/lite";
import { brandConstants } from "../../common/utils/brandConstants";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import getSuperBrandId from "../../common/utils/getSuperBrandId";

const LibrarySearch = ({ setShowDropDown, setLibTracks }) => {
  const searchClient = algoliasearch(
    "UGELINWMHK", // your App ID
    "ca0ae95e4a09ce03c09546001ac1a6d3" // your Search-Only API Key
  );
  const { config } = useContext(BrandingContext);
  const index = searchClient.initIndex("tracksData_Search"); // <-- replace with actual index name
  const brandId =
    BrandingContext._currentValue?.config?.brandId ||
    localStorage.getItem("brandId");

  let serverName = "";
  let baseFilter;
  const superBrandId = getSuperBrandId();
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    serverName = config?.modules?.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }

  if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    baseFilter = `analysis_status=1 AND facet_brand_assigned:"${serverName}-${superBrandId}_${brandId}:true" AND facet_isTrackActive:"${serverName}-${superBrandId}_${brandId}:true" AND facet_trackStatus:"${serverName}-${superBrandId}_${brandId}:true"`;
  } else {
    baseFilter = `analysis_status=1 AND brands_assigned=${brandId} AND trackStatus:true AND sonichub_track_id>0`;
  }
  const sendQuery = async (query) => {
    if (!query || query.length <= 2) {
      setLibTracks([]);
      return;
    }

    try {
      const { hits } = await index.search(query, {
        hitsPerPage: 20,
        filters: baseFilter,
        // filters: `analysis_status = 1 AND brands_assigned = ${localStorage.getItem(
        //   "brandId"
        // )} AND trackStatus:true AND sonichub_track_id>0`,
      });

      if (Array.isArray(hits) && hits.length > 0) {
        setLibTracks(hits);
      } else {
        setLibTracks([]);
      }
    } catch (error) {
      console.error("Algolia search error:", error);
      setLibTracks([]);
    }
  };

  // const sendQuery = (query) => {
  //   if (query?.length <= 2) {
  //     setLibTracks([]);
  //   } else {
  //     AsyncService.loadData(`/trackMeta/searchByTitle?trackName=${query}`)
  //       .then((res) => {
  //         if (Array.isArray(res?.data) && res?.data?.length > 0) {
  //           setLibTracks(res?.data || []);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Search error", error);
  //       });
  //   }
  // };
  const [userQuery, setUserQuery] = useState("");
  const delayedQuery = useRef(_.debounce((q) => sendQuery(q), 500)).current;
  const onChange = (e) => {
    setUserQuery(e.target.value);
    delayedQuery(e.target.value);
  };

  return (
    <div className="st-inner">
      <IconWrapper icon="Search" className="librarySearchIcon" />
      <input
        type="text"
        className="st-input-search librarySearchInput"
        placeholder="Search for a track in Library"
        value={userQuery}
        onFocus={() => {
          setShowDropDown(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setShowDropDown(false);
          }, 250);
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default LibrarySearch;
