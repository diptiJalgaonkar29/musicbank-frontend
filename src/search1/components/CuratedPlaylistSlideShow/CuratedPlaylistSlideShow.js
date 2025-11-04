import React, { useEffect, useState } from "react";
import "./CuratedPlaylistSlideShow.css";
import { useDispatch, useSelector } from "react-redux";
import { loadCurated } from "../../../browse/actions/CuratedPlaylistActions/CuratedPlaylistsActions";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import CuratedPlaylistSliderItem from "../../../browse/components/CuratedPlaylistSliderItem/CuratedPlaylistSliderItem";
import { FormattedMessage } from "react-intl";
import getTrackDetails from "../../../common/utils/getTrackDetails";
import getTrackDetailsByAlgoliaId from "./../../../common/utils/getTrackDetailsByAlgoliaId";

const CuratedPlaylistSlideShow = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredCuratedPlaylists, setFilteredCuratedPlaylists] = useState([]);

  const { curatedPlaylists } = useSelector((state) => state.curatedPlaylists);
  console.log("curatedPlaylists", curatedPlaylists);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurated()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    const enrichPlaylists = async () => {
      if (!Array.isArray(curatedPlaylists)) {
        setFilteredCuratedPlaylists([]);
        return;
      }

      // Collect IDs
      const allTracks = curatedPlaylists.flatMap((item) => item?.tracks || []);

      // Tracks missing Algolia ID → get by Track ID
      const missingAlgoliaIdTracks = allTracks.filter(
        (track) => !track?.algolia_id && track?.id > 0
      );
      const getIdsFromResponse = missingAlgoliaIdTracks.map(
        (track) => track.id
      );

      // Tracks having Algolia ID → get by Algolia ID
      const algoliaIdTracks = allTracks.filter((track) => !!track?.algolia_id);
      const getAlgoliaIdsFromResponse = algoliaIdTracks.map(
        (track) => track.algolia_id
      );

      console.log("getIdsFromResponse:", getIdsFromResponse);
      console.log("getAlgoliaIdsFromResponse:", getAlgoliaIdsFromResponse);

      if (
        getIdsFromResponse.length === 0 &&
        getAlgoliaIdsFromResponse.length === 0
      ) {
        setFilteredCuratedPlaylists([]);
        return;
      }

      // Fetch both datasets
      const [algoliaResponseByTrackId, algoliaResponseByAlgoliaId] =
        await Promise.all([
          getTrackDetails(getIdsFromResponse),
          getTrackDetailsByAlgoliaId(getAlgoliaIdsFromResponse),
        ]);

      // Combine all responses
      const algoliaResponse = [
        ...(algoliaResponseByTrackId || []),
        ...(algoliaResponseByAlgoliaId || []),
      ];

      console.log("algoliaResponse", algoliaResponse);

      // Merge each playlist
      const merged = curatedPlaylists
        ?.map((evt) => {
          const enrichedTracks = evt?.tracks?.map((track) => {
            const algoliaResponseMatch = algoliaResponse?.find((ids) => {
              if (!track?.algolia_id) {
                // match by sonichub_track_id when algolia_id missing
                return String(ids?.sonichub_track_id) === String(track?.id);
              } else {
                // match by Algolia objectID when available
                return String(ids?.objectID) === String(track?.algolia_id);
              }
            });

            return {
              ...track,
              ...(algoliaResponseMatch || {}),
            };
          });

          return {
            ...evt,
            tracks: enrichedTracks,
          };
        })
        .filter((item) => item.tracks && item.tracks.length > 0)
        .slice(0, 6);
      console.log("merged curated playlists:", merged);
      setFilteredCuratedPlaylists(merged);
    };

    enrichPlaylists();
  }, [curatedPlaylists]);

  if (!isLoaded) {
    return (
      <div className="CuratedPlaylistSlideShow_skeleton">
        <SpinnerDefault />
      </div>
    );
  }

  if (!filteredCuratedPlaylists || filteredCuratedPlaylists.length === 0)
    return <></>;

  return (
    <div className="CuratedPlaylistSlideShow_container">
      <span
        style={{
          fontWeight: 400,
          fontStyle: "Regular",
          fontSize: "20px",
          lineHeight: "120%",
          marginBottom: "20px",
        }}
      >
        <FormattedMessage id="browse.page.curated" />
      </span>

      <div className="slider-playlist">
        {filteredCuratedPlaylists.map(
          (item, index) => (
            console.log("item", item),
            (
              <CuratedPlaylistSliderItem
                key={`curated_${index}`}
                playlist={item}
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default CuratedPlaylistSlideShow;
