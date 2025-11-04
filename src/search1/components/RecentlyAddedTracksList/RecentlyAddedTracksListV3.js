import React, { useEffect, useState } from "react";
import "./RecentlyAddedTracksList.css";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import SearchResultsCardV3 from "../../../cyanite/components/searchResultsCard/SearchResultsCardV3";
import { FormattedMessage } from "react-intl";
import { LazyLoadComponent } from "../../../common/components/LazyLoadComponent/LazyLoadComponent";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import { useInstantSearch } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import AsyncService from "../../../networking/services/AsyncService";
import { setAllFavTrackIds } from "../../../redux/actions/searchActions/searchActions";
import { useDispatch } from "react-redux";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";

const RecentlyAddedTracksListV3 = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favTracksIds, setAllFavTrackIds] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const ALGOLIA_APP_ID = "UGELINWMHK"; // Your Algolia Application ID
  const ALGOLIA_SEARCH_KEY = "ca0ae95e4a09ce03c09546001ac1a6d3"; // Your Algolia Search Key

  // Initialize the Algolia client
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
  const index = client.initIndex("tracksData_Search"); // Initialize the index with the given name

  const brandId =
    BrandingContext._currentValue?.config?.brandId ||
    localStorage.getItem("brandId");

  let serverName = "";
  let baseFilter;
  const superBrandId = getSuperBrandId();
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    const { config } = React.useContext(BrandingContext);
    serverName = config.modules.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }

  if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    baseFilter = `analysis_status=1 AND facet_brand_assigned:"${serverName}-${superBrandId}_${brandId}:true" AND facet_isTrackActive:"${serverName}-${superBrandId}_${brandId}:true" AND facet_trackStatus:"${serverName}-${superBrandId}_${brandId}:true"`;
  } else {
    baseFilter = `analysis_status=1 AND brands_assigned=${brandId} AND trackStatus:true AND sonichub_track_id>0`;
  }
  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        // ✅ Fetch tracks with filters (no limit here)
        const { hits } = await index.search("", {
          //filters: `analysis_status = 1 AND brands_assigned = ${brandId} AND trackStatus:true AND sonichub_track_id>0`,
          filters: baseFilter,
          hitsPerPage: 100,
        });

        const sorted = hits.sort(
          (a, b) => b.sonichub_track_id - a.sonichub_track_id
        );
        setTracks(sorted.slice(0, 15));
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
      }
    };
    setIsLoading(false);

    fetchTracks();
    console.log("RecentlyAddedTracksListV3 - tracks", tracks);
  }, []);

  useEffect(() => {
    AsyncService.loadData(`/favourites/1`)
      .then((res) => {
        const favs = res.data.map((data) => String(data.fav_data));
        dispatch(setAllFavTrackIds(favs));
      })
      .catch((err) => console.error("Error fetching favourites:", err));
  }, [dispatch]);
  // if (isLoading) {
  //   return (
  //     <div className="RecentlyAddedTracksList_skeleton">
  //       <SpinnerDefault />
  //     </div>
  //   );
  // }

  // if (!tracks?.length) return <></>;
  const hideMoodTags = (window.globalConfig?.HIDE_MOOD_TAGS || []).map((t) =>
    t.toLowerCase()
  );
  return (
    <>
      {loading ? (
        <div className="project_loader">
          <SpinnerDefault />
        </div>
      ) : (
        <FooterMusicPlayerContext.Consumer>
          {({
            playingAudio,
            setPlayingAudio,
            playPause,
            setPlayList,
            setPlayingIndex,
            setPlayListType,
            playListType,
          }) => (
            <div className="RecentlyAddedTracksList_container">
              <div style={{ marginBottom: "20px" }}>
                <span
                  style={{
                    fontWeight: 400,
                    fontStyle: "Regular",
                    fontSize: "20px",
                    leadingTrim: "NONE",
                    lineHeight: "120%",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  <FormattedMessage id="browse.page.recently" />
                </span>
              </div>
              <div className="RecentlyAddedTracksList recent-tracksv3">
                {tracks?.map((track, index) => (
                  <LazyLoadComponent
                    ref={React.createRef()}
                    defaultHeight={50}
                    key={`${track?.objectID}-${index}`}
                  >
                    <SearchResultsCardV3
                      sonichub_track_id={track?.sonichub_track_id}
                      data_type="library"
                      track_name={track?.track_name}
                      preview_image_url={getMediaBucketPath(
                        track?.preview_image,
                        track?.source_id,
                        "image"
                      )}
                      duration={track?.duration_in_sec}
                      tags={
                        //track?.amp_all_mood_tags?.tag_names.slice(0, 3)
                        (track?.amp_all_mood_tags?.tag_names || [])
                          .filter(
                            (tag) => !hideMoodTags.includes(tag.toLowerCase())
                          )
                          .slice(0, 3)
                      }
                      icon_url={track?.icon_url}
                      defaultImg="/assets/default-track.png"
                      keyTags={track?.tag_key || []}
                      playingAudio={playingAudio}
                      setPlayingAudio={setPlayingAudio}
                      playPause={playPause}
                      setPlayList={setPlayList}
                      setPlayingIndex={setPlayingIndex}
                      setPlayListType={setPlayListType}
                      playListType={playListType}
                      strotswar_track_id={track?.strotswar_track_id}
                      wavefile={track?.wave_form_js}
                      genreTags={track?.amp_genre_tags?.tag_names}
                      eventTags={track?.event_tags?.tag_names || []}
                      movementTags={track?.moment_tags?.tag_names || []}
                      ampMoodTags={track?.amp_all_mood_tags?.tag_names || []}
                      instrumentTags={track?.amp_instrument_tags || []}
                      bpm={track?.bpm}
                      objectID={track?.objectID}
                      wav_track={track?.wav_track}
                      mp3_track={track?.mp3_track}
                      stems_zip={track?.stems_zip}
                      favTracksIds={favTracksIds}
                      instrument_vocal_data={track?.instrument_vocal_data}
                      source_id={track?.source_id}
                    />
                  </LazyLoadComponent>
                ))}
              </div>
            </div>
          )}
        </FooterMusicPlayerContext.Consumer>
      )}
    </>
  );
};
export default RecentlyAddedTracksListV3;
