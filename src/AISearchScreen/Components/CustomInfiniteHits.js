import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useInfiniteHits,
  useCurrentRefinements,
  Configure,
} from "react-instantsearch";
import CheckboxWrapper from "../../branding/componentWrapper/CheckboxWrapper";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import { LazyLoadComponent } from "../../common/components/LazyLoadComponent/LazyLoadComponent";
import CreatePlaylistModal from "../../playlist/components/CreatePlaylistModal/CreatePlaylistModal";
import { useDispatch, useSelector } from "react-redux";
import getMediaBucketPath from "../../common/utils/getMediaBucketPath";
import { Tooltip } from "@mui/material";
import { FormattedMessage } from "react-intl";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";
import getSuperBrandId from "../../common/utils/getSuperBrandId";
import { ConsoleView } from "react-device-detect";

// ✅ Helper function to get server-wise sonicTrackId
const getSonicTrackId = (hit, serverName) => {
  if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    if (Array.isArray(hit?.facet_sonic_track_id)) {
      const match = hit.facet_sonic_track_id.find((id) =>
        id.startsWith(serverName + ":")
      );
      return match ? match.split(":")[1] : "";
    }
    return "";
  }
  return hit?.sonichub_track_id;
};

export function CustomInfiniteHits({
  hitComponent: HitComponent,
  isFilterOpen,
  selectedTrackIds,
  setSelectedTrackIds,
  onHitsUpdate,
  trackIdsFromApi,
  selected,
  cyaniteIds,
  algoliaFilterMGT,
  algoliaFilter,
  ...props
}) {
  const disableInfiniteScroll = selected === "similarity" || algoliaFilterMGT;
  const hitsPerPage = disableInfiniteScroll ? 60 : 15;
  const { hits, isLastPage, showMore } = useInfiniteHits({
    ...props,
    hitsPerPage,
    filters: algoliaFilterMGT ? algoliaFilterMGT : algoliaFilter,
  });
  const { createNewPlaylistDialog } = useSelector((state) => state.playlist);
  const cyaniteIdsMGT = useSelector((state) => state.search.cyaniteIdsMGT);
  const sentinelRef = useRef(null);
  const { config } = useContext(BrandingContext);
  const { items: currentRefinementItems } = useCurrentRefinements();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [hasFirstResponse, setHasFirstResponse] = useState(false);
  const superBrandId = getSuperBrandId();
  let serverName = "";
  const brandId =
    BrandingContext._currentValue?.config?.brandId ||
    localStorage.getItem("brandId");
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    const { config } = React.useContext(BrandingContext);
    serverName = config.modules.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }

  const orderedHits = React.useMemo(() => {
    if (algoliaFilterMGT && cyaniteIdsMGT.length > 0 && hits) {
      const hitMap = new Map(hits.map((hit) => [hit.cyanite_id, hit]));
      return cyaniteIdsMGT.map((id) => hitMap.get(id)).filter(Boolean);
    }
    if (selected === "similarity" && cyaniteIds && hits) {
      const hitMap = new Map(hits.map((hit) => [hit.cyanite_id, hit]));
      return cyaniteIds.map((id) => hitMap.get(id)).filter(Boolean);
    }
    return hits;
  }, [hits, cyaniteIds, selected, cyaniteIdsMGT]);

  const isTagRefined = (attribute, value) => {
    const item = currentRefinementItems.find((i) => i.attribute === attribute);
    return item?.refinements?.some((ref) =>
      typeof ref === "string" ? ref === value : ref.label === value
    );
  };

  // Infinite scroll observer
  useEffect(() => {
    if (disableInfiniteScroll) return;
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) showMore();
        });
      });
      observer.observe(sentinelRef.current);
      return () => observer.disconnect();
    }
  }, [isLastPage, showMore, disableInfiniteScroll]);

  // Hits update handler
  useEffect(() => {
    if (!hasFirstResponse && hits) {
      setHasFirstResponse(true);
      setLoading(false);
    }
    if (hits.length > 0) onHitsUpdate(hits);
  }, [hits, onHitsUpdate, hasFirstResponse]);

  return (
    <ul
      className={`ais-InfiniteHits-list AlgoliaSearchResults ${
        isFilterOpen ? "push-right" : ""
      }`}
    >
      <Configure
        hitsPerPage={hitsPerPage}
        filters={algoliaFilterMGT || algoliaFilter}
        page={0}
      />

      {loading ? (
        <div className="loading-wrapper">
          <p style={{ fontSize: "1.6rem", textAlign: "center" }}>
            Loading tracks...
          </p>
        </div>
      ) : orderedHits.length === 0 ? (
        <div style={{ padding: "1rem" }}>No results found.</div>
      ) : (
        <>
          <CreatePlaylistModal openProp={createNewPlaylistDialog} />
          {orderedHits.map((hit, index) => {
            // Initialize tag arrays and preview image
            let ampMainMoodTags = [];
            let ampMoodTags = [];
            let sonicLogoMainMoodTags = [];
            let sonicLogoMoodTags = [];
            let sonicFunctionalValues = [];
            let tagGenre = [];
            let otherTags = [];
            let instrumentTags = [];
            let eventTags = [];
            let movementTags = [];
            let keyTags = [];
            let tempoTags = [];
            let previewImageUrl = "";
            const sonicTrackId = getSonicTrackId(hit, serverName);
            try {
              ampMainMoodTags = hit?.amp_all_mood_tags.tag_names || [];
              ampMoodTags = hit?.amp_all_mood_tags.tag_names || [];
              sonicLogoMainMoodTags = hit?.tag_soniclogo_mainmood_ids || [];
              sonicLogoMoodTags = hit?.tag_soniclogo_allmood_ids || [];
              sonicFunctionalValues = hit?.sonic_logo_functional_values || [];
              tagGenre = hit?.amp_genre_tags.tag_names || [];
              otherTags = [...(hit.tag_key || []), ...([hit.tag_tempo] || [])];
              keyTags = hit?.tag_key || [];
              tempoTags = [hit?.tag_tempo];
              instrumentTags = hit?.amp_instrument_tags.tag_names || [];
              eventTags = hit?.event_tags.tag_names || [];
              movementTags = hit?.moment_tags.tag_names || [];
              previewImageUrl = getMediaBucketPath(
                hit?.preview_image,
                hit?.source_id,
                "image"
              );
            } catch (error) {}

            const isMatch = Boolean(
              Array.isArray(trackIdsFromApi) &&
                trackIdsFromApi.length > 0 &&
                (!trackIdsFromApi.some((item) =>
                  item.AssetType?.includes(hit.asset_type_id)
                ) ||
                  trackIdsFromApi.some((item) =>
                    item.trackIds?.includes(Number(sonicTrackId))
                  ))
            );

            let tooltipMsg = "";
            if (
              Array.isArray(trackIdsFromApi) &&
              trackIdsFromApi.length === 0
            ) {
              tooltipMsg = "";
            } else if (
              trackIdsFromApi.length > 0 &&
              !trackIdsFromApi.some((item) =>
                item.AssetType?.includes(hit.asset_type_id)
              )
            ) {
              tooltipMsg = (
                <FormattedMessage id="trackDetail.dowloadWAV.DifferentType" />
              );
            } else if (
              trackIdsFromApi.length > 0 &&
              trackIdsFromApi.some((item) =>
                item.trackIds?.includes(Number(sonicTrackId))
              )
            ) {
              tooltipMsg =
                (
                  <FormattedMessage id="trackDetail.dowloadWAV.AlreadySelected" />
                ) || "Already selected";
            }

            return (
              <LazyLoadComponent
                key={`${hit?.objectID}-${index}`}
                defaultHeight={119}
                className="track-card-block"
                dataAttrs={{
                  "data-track-id": hit?.objectID,
                  "data-source-id": hit?.source_id,
                  "data-sonichub-id": sonicTrackId,
                  "data-cyanite-id": hit?.cyanite_id,
                }}
              >
                <div className="lload">
                  <div className="track-card">
                    <Tooltip
                      title={tooltipMsg}
                      slotProps={{
                        popper: {
                          sx: {
                            "& .MuiTooltip-tooltip": {
                              backgroundColor: "#333",
                              color: "#fff",
                              fontSize: "14px",
                              borderRadius: "8px",
                              padding: "8px 12px",
                            },
                          },
                        },
                      }}
                    >
                      <div
                        className="track-checkbox"
                        style={{ alignSelf: "flex-start", marginTop: "45px" }}
                      >
                        <CheckboxWrapper
                          name="selectedTracks"
                          value={sonicTrackId}
                          checked={selectedTrackIds.some(
                            (item) => item.trackId === sonicTrackId
                          )}
                          disabled={isMatch}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setSelectedTrackIds((prev) => {
                              if (isChecked) {
                                const exists = prev.some(
                                  (item) => item.trackId === sonicTrackId
                                );
                                if (exists) return prev;
                                return [
                                  ...prev,
                                  {
                                    trackId: sonicTrackId,
                                    algoliaId: hit.objectID,
                                  },
                                ];
                              } else {
                                return prev.filter(
                                  (item) => item.trackId !== sonicTrackId
                                );
                              }
                            });
                          }}
                          label=""
                        />
                      </div>
                    </Tooltip>

                    <HitComponent
                      {...hit}
                      id={sonicTrackId}
                      key={sonicTrackId}
                      indexProp={hit?.sonichub_track_id}
                      cyanite_id={hit?.cyanite_id}
                      track_length={hit?.duration_in_sec}
                      allTags={hit?.tag_all}
                      track_name={hit?.track_name}
                      preview_image_url={previewImageUrl}
                      preview_track_url={hit?.preview_track_url}
                      track_url={hit?.track_url}
                      stems_zip_wav_url={hit?.stems_zip_wav_url}
                      tempo={hit?.bpm}
                      tag_tempo={hit?.tag_tempo}
                      cyaniteProfile={config.modules.CyaniteProfile}
                      UpdateUItoV2={config.modules.UpdateUItoV2}
                      emotionTags={[]}
                      instrumentTags={instrumentTags}
                      ampMainMoodTags={ampMainMoodTags}
                      ampMoodTags={ampMoodTags}
                      sonicLogoMainMoodTags={sonicLogoMainMoodTags}
                      sonicLogoMoodTags={sonicLogoMoodTags}
                      sonicFunctionalValues={sonicFunctionalValues}
                      otherTags={otherTags}
                      feelingsTags={[]}
                      impactTags={[]}
                      motionTags={[]}
                      tonalityTags={[]}
                      keyTags={keyTags}
                      tempoTags={tempoTags}
                      genreTags={tagGenre}
                      paid={hit?.paid}
                      unpaid={hit?.unpaid}
                      config={config}
                      trackType={hit?.track_type_id}
                      csToSsStatus={hit?.csToSsStatus}
                      isTagRefined={isTagRefined}
                      onRefine={props.onRefine}
                      wavefile={hit?.wave_form_js}
                      instrument_vocal={hit?.instrument_vocal}
                      stems_zipYesNo={hit?.stems_zip != "" ? "Yes" : "No"}
                      strotswar_track_id={hit?.strotswar_track_id}
                      trackdetails_objectID={hit?.objectID}
                      favTracksIds={props.favTracksIds}
                      instrument_vocal_data={hit?.instrument_vocal_data}
                      asset_type_id={hit?.asset_type_id}
                      track_mediatypes={hit?.track_mediatypes || []}
                      eventTags={eventTags}
                      movementTags={movementTags}
                      source_id={hit?.source_id}
                      // track_flaxid={encodeURIComponent(hit?.csFlaxTrackId)}
                      track_flaxid={
                        hit?.facet_cs_flex_id
                          ?.find(
                            (id) =>
                              typeof id === "string" &&
                              id.startsWith(
                                serverName +
                                  "-" +
                                  superBrandId +
                                  "_" +
                                  brandId +
                                  ":"
                              )
                          )
                          ?.split(":")[1] || null
                      }
                      //track_cs_status={hit?.trackCSStatus}
                      track_cs_status={
                        hit?.facet_enableTrackForCS
                          ?.find(
                            (id) =>
                              typeof id === "string" &&
                              id.startsWith(serverName + ":")
                          )
                          ?.split(":")[1] || null
                      }
                    />
                  </div>
                </div>
              </LazyLoadComponent>
            );
          })}
        </>
      )}
      {!disableInfiniteScroll && (
        <li
          className="ais-InfiniteHits-sentinel"
          ref={sentinelRef}
          aria-hidden="true"
        >
          {!isLastPage && !loading && orderedHits.length > 0 && (
            <p
              className="ais-InfiniteHits-load-more-message"
              style={{ fontSize: "1.6rem", textAlign: "center" }}
            >
              Loading more tracks...
            </p>
          )}
        </li>
      )}
    </ul>
  );
}
