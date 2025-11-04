import React, { useContext, useEffect, useMemo, useState } from "react";
import "./BrowsePageV2.css";
import Iframe from "react-iframe";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import AsyncService from "../../../networking/services/AsyncService";
import { LazyLoadComponent } from "../../../common/components/LazyLoadComponent/LazyLoadComponent";
import TrackcardV2 from "../../../search1/components/TrackcardV2/TrackcardV2";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";
import _ from "lodash";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import CreatePlaylistModal from "../../../playlist/components/CreatePlaylistModal/CreatePlaylistModal";
import { useDispatch, useSelector } from "react-redux";
import { setAllFavTrackIds } from "../../../redux/actions/searchActions/searchActions";
import SpotifySearch3 from "../../../cyanite/components/SpotifySearch3";
import { useParams, useNavigate } from "react-router-dom";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import BrowseV2Sidebar from "../../components/BrowseV2Sidebar/BrowseV2Sidebar";
import {
  resetTrackFilters,
  resetTrackTypeFilters,
  setTrackFilters,
} from "../../../redux/actions/trackFilterActions/trackFilterActions";

const BrowsePageV2 = () => {
  const dispatch = useDispatch();
  const { spotifyId } = useParams();
  const navigate = useNavigate()
  const { createNewPlaylistDialog } = useSelector((state) => state.playlist);
  const {
    browseTrackFilters: trackFilters,
    browseTrackTypeFilters: trackTypeFilters,
  } = useSelector((state) => state.trackFilters);
  const favTracksIds = useSelector((state) => state.favTracksIds);
  const { config } = useContext(BrandingContext);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredTags = useMemo(() => {
    let formattedData = _(trackFilters)
      .map((values, attribute) => values.map((tag) => ({ attribute, ...tag })))
      .flatten()
      .value();
    return formattedData;
  }, [trackFilters]);

  const filterItemsMemo = useMemo(() => trackFilters, [trackFilters]);

  const getTrackMeta = async (trackFilters, spotifyId, trackTypes = []) => {
    const formData = new FormData();

    if (trackTypes?.length > 0) {
      formData.append(
        "track_type_id",
        trackTypes?.map((type) => type?.value)
      );
    }
    if (!!spotifyId && spotifyId?.startsWith("spt-")) {
      formData.append("spotify_id", spotifyId?.replace("spt-", ""));
    }
    if (trackFilters?.tag_tempo?.length > 0) {
      formData.append("tag_tempo", trackFilters?.tag_tempo?.[0]?.value);
    }
    if (trackFilters?.tempo?.[0]?.value?.length > 0) {
      formData.append(
        "tempo",
        `[tempo>=${trackFilters?.tempo?.[0]?.value?.[0]},tempo<=${trackFilters?.tempo?.[0]?.value?.[1]}]`
      );
    }
    if (trackFilters?.tag_amp_allmood_ids?.length > 0) {
      formData.append(
        "tag_amp_allmood_ids",
        JSON.stringify(trackFilters?.tag_amp_allmood_ids?.map((x) => x.value))
      );
    }
    if (trackFilters?.tag_amp_mainmood_ids?.length > 0) {
      formData.append(
        "tag_amp_mainmood_ids",
        JSON.stringify(trackFilters?.tag_amp_mainmood_ids?.map((x) => x.value))
      );
    }
    if (trackFilters?.instrument_ids?.length > 0) {
      formData.append(
        "instrument_ids",
        JSON.stringify(trackFilters?.instrument_ids?.map((x) => x.value))
      );
    }
    if (trackFilters?.tag_key?.length > 0) {
      formData.append(
        "tag_key",
        JSON.stringify(trackFilters?.tag_key?.map((x) => x.value))
      );
    }
    if (trackFilters?.tag_genre?.length > 0) {
      formData.append(
        "tag_genre",
        JSON.stringify(trackFilters?.tag_genre?.map((x) => x.value))
      );
    }
    if (!!trackFilters?.assetTypeId?.[0]) {
      formData.append(
        "assetTypeId",
        JSON.stringify(trackFilters?.assetTypeId?.[0]?.value)
      );
    }

    formData.append(
      "allTracks",
      filteredTags?.length === 0 && trackTypes?.length === 0 ? "true" : "false"
    );

    try {
      let trackMeta = await AsyncService.postFormData(
        `/trackMeta/tracks`,
        formData
      );
      setTracks(trackMeta?.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLikedTracks = () => {
    AsyncService.loadData(`/favourites/1`).then((res) => {
      var favTracks = res.data.map((data) => {
        return data.fav_data;
      });
      dispatch(setAllFavTrackIds(favTracks));
    });
  };

  useEffect(() => {
    getLikedTracks();
  }, []);

  useEffect(() => {
    let id = setTimeout(() => {
      getTrackMeta(filterItemsMemo, spotifyId, trackTypeFilters);
    }, 50);
    return () => clearTimeout(id);
  }, [filterItemsMemo, spotifyId, trackTypeFilters?.length]);

  const removeFilteredTag = (attribute, value) => {
    if (attribute === "tempo") {
      dispatch(setTrackFilters({ tempo: [] }));
      return;
    }
    const updatedArray = _.filter(
      trackFilters[attribute],
      (x) => x.value !== value
    );
    dispatch(setTrackFilters({ [attribute]: updatedArray }));
  };

  // const handleFilterTrackType = (e) => {
  //   let trackTypeDataSetObj = { ...e?.target?.dataset };
  //   if (Object.keys(trackTypeDataSetObj).length === 0) return;
  //   let trackTypeObj = {
  //     id: +trackTypeDataSetObj?.trackTypeId,
  //     name: trackTypeDataSetObj?.trackType,
  //   };
  //   if (trackTypeObj?.name === 0) {
  //     dispatch(resetTrackTypeFilters());
  //   } else {
  //     dispatch(setTrackTypeFilters(trackTypeObj));
  //   }
  // };

  return (
    <MainLayout>
      {isLoading ? (
        <div className="browseV2_loading_container">
          <SpinnerDefault />
        </div>
      ) : (
        <main className="browseV2_container">
          <BrowseV2Sidebar
            filteredTags={filteredTags}
            trackTypeFilters={trackTypeFilters}
            tracks={tracks}
            filterItems={trackFilters}
            filterItemsMemo={filterItemsMemo}
          // trackType={[
          //   { id: 0, name: "All Tracks" },
          //   ...(trackTypeMaster || []),
          // ]}
          />
          <div className="browseV2_content_main">
            {/* <div
              className="browseV2_trackType_filter_container"
              onClick={handleFilterTrackType}
            >
              {[{ id: 0, name: "All Tracks" }, ...(trackTypeMaster || [])]
                ?.map((e, i) => e)
                ?.map((trackType, i) => (
                  <p
                    className={`trackType_filter_item ${
                      +trackTypeFilters?.id === +trackType?.id
                        ? "trackType_filter_item_active"
                        : ""
                    }`}
                    data-track-type-id={trackType?.id}
                    data-track-type={trackType?.name}
                    key={trackType?.name}
                  >
                    {trackType?.name}
                  </p>
                ))}
            </div> */}
            <div className="browseV2_content_header">
              <div className="browseV2_content_header_count_search">
                <h1 className="browseV2_header">
                  Search Results ({tracks?.Result?.length ?? 0})
                </h1>
                <SpotifySearch3 />
              </div>
              {filteredTags?.length > 0 && (
                <div className="filteredTags_container">
                  <button
                    onClick={() => {
                      dispatch(resetTrackFilters());
                      dispatch(resetTrackTypeFilters());
                    }}
                    className="clear_all_filters_btn"
                  >
                    <ChipWrapper
                      label={"Clear all filters"}
                      className="clear_all_filters_btn_chip"
                    />
                  </button>
                  {filteredTags?.map(({ attribute, label, value }) => (
                    <ChipWrapper
                      key={label}
                      label={
                        attribute == "tempo"
                          ? `BPM: ${tracks?.tempo?.[0]?.min_tempo ||
                          filteredTags?.[0]?.value?.[0]
                          }-${tracks?.tempo?.[0]?.max_tempo ||
                          filteredTags?.[0]?.value?.[1]
                          }`
                          : label
                      }
                      className={`${attribute}`}
                      onClose={() => {
                        removeFilteredTag(attribute, value);
                      }}
                    />
                  ))}
                </div>
              )}
              {spotifyId && spotifyId?.startsWith("spt-") && (
                <div className="searchResult_SingleResBlock">
                  <span
                    className="custSearch_closeBtn"
                    onClick={() => {
                      navigate("/search_results/");
                    }}
                  >
                    <IconButtonWrapper icon="Close" />
                  </span>
                  <Iframe
                    src={
                      "https://open.spotify.com/embed/track/" +
                      spotifyId?.replace("spt-", "") +
                      "?theme=0"
                    }
                    width="250px"
                    height="80"
                    frameBorder="0"
                    allowtransparency="true"
                    allow="encrypted-media"
                    style={{ borderRadius: "20px !important" }}
                  />
                </div>
              )}
            </div>
            <section className="browseV2_tracklist">
              {tracks?.Result?.length > 0 ? (
                <div className="browseV2_track_list">
                  <CreatePlaylistModal openProp={createNewPlaylistDialog} />
                  {tracks?.Result?.sort(
                    (a, b) =>
                      Number(favTracksIds?.includes(b.objectID)) -
                      Number(favTracksIds?.includes(a.objectID)) ||
                      a.track_name.localeCompare(b.track_name)
                  )?.map((hitObj, index) => {
                    let ampMainMoodTags = [];
                    let ampMoodTags = [];
                    let sonicLogoMainMoodTags = [];
                    let sonicLogoMoodTags = [];
                    let tagGenre = [];
                    let otherTags = [];
                    let emotionTags = [];
                    let instrumentTags = [];
                    let feelingsTags = [];
                    let impactTags = [];
                    let motionTags = [];
                    let tonalityTags = [];
                    let keyTags = [];
                    let tempoTags = [];
                    try {
                      if (
                        process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER
                      ) {
                        ampMainMoodTags = hitObj?.tag_amp_allmood_ids || [];
                        ampMoodTags = hitObj?.tag_amp_allmood_ids || [];
                        sonicLogoMainMoodTags =
                          hitObj?.tag_soniclogo_mainmood_ids || [];
                        sonicLogoMoodTags =
                          hitObj?.tag_soniclogo_allmood_ids || [];
                        tagGenre = hitObj?.tag_genre || [];
                        otherTags = [
                          ...(hitObj.tag_key || []),
                          ...([hitObj.tag_tempo] || []),
                        ];
                        keyTags = hitObj?.tag_key || [];
                        tempoTags = [hitObj?.tag_tempo];
                        instrumentTags = hitObj?.instrument_ids || [];
                      }
                    } catch (error) {
                      // console.log("error", error);
                    }
                    return (
                      <LazyLoadComponent
                        ref={React.createRef()}
                        defaultHeight={config.modules.browseUIV3 ? 110 : 195}
                        key={`${hitObj?.objectID}-${index}`}
                      >
                        <div className="lload">
                          <TrackcardV2
                            id={hitObj?.created_at_timestamp}
                            key={hitObj?.created_at_timestamp}
                            indexProp={hitObj?.objectID}
                            cyanite_id={hitObj?.cyanite_id}
                            track_length={hitObj?.duration_in_sec}
                            allTags={hitObj?.tag_all}
                            track_name={hitObj?.track_name}
                            preview_image_url={hitObj?.preview_image_url}
                            preview_track_url={hitObj?.preview_track_url}
                            track_url={hitObj?.track_url}
                            stems_zip_wav_url={hitObj?.stems_zip_wav_url}
                            tempo={hitObj?.tempo}
                            tag_tempo={hitObj?.tag_tempo}
                            cyaniteProfile={config.modules.CyaniteProfile}
                            UpdateUItoV2={config.modules.UpdateUItoV2}
                            emotionTags={emotionTags}
                            instrumentTags={instrumentTags}
                            ampMainMoodTags={ampMainMoodTags}
                            ampMoodTags={ampMoodTags}
                            sonicLogoMainMoodTags={sonicLogoMainMoodTags}
                            sonicLogoMoodTags={sonicLogoMoodTags}
                            otherTags={otherTags}
                            feelingsTags={feelingsTags}
                            impactTags={impactTags}
                            motionTags={motionTags}
                            tonalityTags={tonalityTags}
                            keyTags={keyTags}
                            tempoTags={tempoTags}
                            genreTags={tagGenre}
                            paid={hitObj?.paid}
                            unpaid={hitObj?.unpaid}
                            radio={hitObj?.radio}
                            config={config}
                            track_cs_status={hitObj?.trackCSStatus}
                            trackType={hitObj?.track_type_id}
                            csToSsStatus={hitObj?.csToSsStatus}
                            track_flaxid={encodeURIComponent(
                              hitObj?.csFlaxTrackId
                            )}
                          />
                        </div>
                      </LazyLoadComponent>
                    );
                  })}
                </div>
              ) : (
                <h1 className="browseV2_no_data_header">No Tracks Found</h1>
              )}
            </section>
          </div>
        </main>
      )}
    </MainLayout>
  );
};

export default BrowsePageV2;
