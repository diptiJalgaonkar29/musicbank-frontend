import { useState, useContext, useEffect, useRef } from "react";
import "./MusicInspiration.css";
import { ReactComponent as SpotifyIcon } from "../../../static/spotify_icon.svg";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import LibrarySearch from "../../../cyanite/components/LibrarySearch";
import { CustomAutocomplete } from "../../../cyanite/components/AlgoSearch";
import SpotifySearch2 from "../../../cyanite/components/SpotifySearch2";
import { Formik, Form } from "formik";
import LinkInputWrapper from "../../../branding/componentWrapper/LinkInputWrapper";
import SearchResultsCard from "../../../cyanite/components/searchResultsCard/SearchResultsCard";
import { FormattedMessage, useIntl } from "react-intl";
import CheckboxWrapper from "../../../branding/componentWrapper/CheckboxWrapper";
import Picture from "../../../search1/components/AnimatedPicture/AnimatedPicture";
import MediaService from "../../../common/services/MediaService";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import Iframe from "react-iframe"; // Added
import { useDispatch, useSelector } from "react-redux";
import { setCustomTrackForm } from "./../../../redux/actions/customTrackForm/customTrackForm";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import AudioPlayerSH2 from "../../../common/components/Audiplayer/AudioPlayerSH2";

const MusicInspiration = ({ formikRef, onSubmit }) => {
  const { config } = useContext(BrandingContext);
  const intl = useIntl();
  const [stSearchFrom, setStSearchFrom] = useState("spotify");
  const [showDropDown, setShowDropDown] = useState(false);
  const [libTracks, setLibTracks] = useState([]);
  const [allTracks, setAllTracks] = useState([]);
  const [loadingTrackIds, setLoadingTrackIds] = useState({});
  const { musicInspiration } = useSelector((state) => state.customTrackForm);
  const [linkError, setLinkError] = useState("");

  const dispatch = useDispatch();
  // const addTrackToList = useCallback((newTrack) => {
  //   setAllTracks((prevTracks) => {
  //     const exists = prevTracks.some((t) => t.id === newTrack.id);
  //     if (exists) return prevTracks;

  //     const {
  //       id,
  //       title = "",
  //       image = "",
  //       duration_in_sec = 0,
  //       preview_track_url = "",
  //       //audio_url = "",
  //       source = "",
  //       link = "",
  //       // embedUrl = "",
  //       selected = false,
  //     } = newTrack;

  //     const checked = prevTracks.filter((t) => t.selected);
  //     const unchecked = prevTracks.filter((t) => !t.selected);

  //     return [
  //       ...checked,
  //       {
  //         id,
  //         title,
  //         image,
  //         duration_in_sec,
  //         preview_track_url,
  //         //audio_url,
  //         source,
  //         link,
  //         //embedUrl,
  //         selected,
  //       },
  //       ...unchecked,
  //     ];
  //   });
  // }, []);

  useEffect(() => {
    dispatch(
      setCustomTrackForm({
        key: "musicInspiration",
        values: {
          ...musicInspiration,
          tracks: allTracks,
        },
      })
    );
  }, [allTracks]);

  useEffect(() => {
    if (musicInspiration?.tracks?.length) {
      setAllTracks(musicInspiration.tracks);

      const selectedTrackIds = musicInspiration.tracks
        .filter((t) => t.selected)
        .map((t) => t.id);

      formikRef.current?.setFieldValue("selectedTracks", selectedTrackIds);

      // 🔁 Restore loading indicators for incomplete tracks
      const loadingTrackMap = {};
      musicInspiration.tracks.forEach((t) => {
        const isLibrary = t.source === "library";
        const isIncomplete =
          !t.id ||
          (!t.preview_track_url && isLibrary) ||
          (isLibrary && t.duration_in_sec === 0);

        if (isIncomplete && !loadingTrackIds[t.id]) {
          loadingTrackMap[t.id] = true;
        }
      });

      if (Object.keys(loadingTrackMap).length > 0) {
        setLoadingTrackIds((prev) => ({ ...prev, ...loadingTrackMap }));

        // Optional: auto-clear them after delay to avoid infinite spinner
        setTimeout(() => {
          setLoadingTrackIds((prev) => {
            const copy = { ...prev };
            Object.keys(loadingTrackMap).forEach((id) => delete copy[id]);
            return copy;
          });
        }, 1000); // 1 second spinner visibility
      }
    }
  }, [musicInspiration.tracks]);

  const setSearchStatus = (e) => {
    const status = e.currentTarget.getAttribute("searchstatus");
    if (status === "from-spotify") setStSearchFrom("spotify");
    else if (status === "from-library") setStSearchFrom("library");
  };

  const getTrackCyaniteData = async (track) => {
    // console.log("Track already selected", trackId);
    // Step 0: Skip if track already exists
    const alreadyExists = allTracks.some((t) => t.id === track.objectID);
    if (alreadyExists) {
      console.log("Track already selected. Skipping loader and fetch.");
      return;
    }

    // Step 1: Set loader state
    setLoadingTrackIds((prev) => ({ ...prev, [track.objectID]: true }));

    // ✅ Only required fields
    const minimalAlgoliaData = {
      track_name: track.track_name,
      track_type_id: track.track_type_id,
      duration_in_sec: track.duration_in_sec,
      sonichub_track_id: track.sonichub_track_id,
      strotswar_track_id: track.strotswar_track_id,
      wave_form_js: track.wave_form_js,
      source_id: track.source_id,
      preview_image: track.preview_image,
    };
    // Step 2: Add temp track to show loading placeholder
    setAllTracks((prevTracks) => {
      const checked = prevTracks.filter((t) => t.selected);
      const unchecked = prevTracks.filter((t) => !t.selected);

      return [
        ...checked,
        {
          id: track.objectID,
          title: "Loading...",
          image: "",
          duration_in_sec: 0,
          preview_track_url: "",
          //audio_url: "",
          source: "library",
          link: `${window.location.origin}/#/track_page/${track.objectID}`,
          //embedUrl: "",
          selected: false,
          algiliaData: minimalAlgoliaData,
        },
        ...unchecked,
      ];
    });

    try {
      // const response = await AsyncService.loadData(
      //   `/tracks?trackId=${track.objectID}`
      // );

      // const track = response?.data;

      if (track) {
        // Step 3: Replace temp track with actual data
        setAllTracks((prevTracks) =>
          prevTracks.map((t) =>
            t.id === track.objectID
              ? {
                  ...t,
                  title: track.track_name,
                  image: getMediaBucketPath(
                    track?.preview_image,
                    track?.source_id,
                    "image"
                  ),
                  duration_in_sec: track.duration_in_sec,
                  preview_track_url: track.preview_track_url,
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch track details:", err);
    } finally {
      // Step 4: Clear loading state
      setLoadingTrackIds((prev) => {
        const copy = { ...prev };
        delete copy[track.objectID];
        return copy;
      });
    }
  };

  const setSpotifyTrack = async (trackId) => {
    // Check if already added
    const alreadyExists = allTracks.some((t) => t.id === trackId);
    if (alreadyExists) {
      console.log("Spotify track already added. Skipping...");
      return;
    }

    // Show loading spinner
    setLoadingTrackIds((prev) => ({ ...prev, [trackId]: true }));

    // Add temp track immediately
    setAllTracks((prevTracks) => {
      const checked = prevTracks.filter((t) => t.selected);
      const unchecked = prevTracks.filter((t) => !t.selected);

      return [
        ...checked,
        {
          id: trackId,
          //title: "Spotify Track",
          // image: "",
          // duration_in_sec: 0,
          // preview_track_url: "",
          //audio_url: "",
          source: "spotify",
          link: `https://open.spotify.com/track/${trackId}`,
          selected: false,
        },
        ...unchecked,
      ];
    });

    try {
      // Optional delay so loader shows (helps UX)
      await new Promise((res) => setTimeout(res, 1000));

      // If you have an API to fetch actual track data from Spotify, do it here.
      // Otherwise, skip this step.
    } catch (err) {
      console.error("Error fetching Spotify track metadata:", err);
    } finally {
      // Remove loader
      setLoadingTrackIds((prev) => {
        const copy = { ...prev };
        delete copy[trackId];
        return copy;
      });
    }
  };

  // useEffect(() => {
  //   isMountedRef.current = true;

  //   const loadWaveformsAndImages = async () => {
  //     const newImageMap = {};
  //     const newWaveformMap = {};

  //     const fetchList = allTracks.filter(
  //       (t) =>
  //         t.source === "library" && // ✅ Only for library tracks
  //         (!imageMap[t.id] || (!waveformMap[t.id] && t.preview_track_url))
  //     );

  //     await Promise.all(
  //       fetchList.map(async (t) => {
  //         try {
  //           if (!imageMap[t.id] && t.image) {
  //             newImageMap[t.id] = await MediaService.getImage(t.image);
  //           }
  //           if (!waveformMap[t.id] && t.preview_track_url) {
  //             newWaveformMap[t.id] = await MediaService.getWaveform(
  //               t.preview_track_url
  //             );
  //           }
  //         } catch (err) {
  //           console.warn(`Failed to fetch media for track ${t.id}`, err);
  //         }
  //       })
  //     );

  //     // if (isMountedRef.current) {
  //     //   setImageMap((prev) => ({ ...prev, ...newImageMap }));
  //     //   setWaveformMap((prev) => ({ ...prev, ...newWaveformMap }));
  //     // }
  //   };

  //   if (allTracks.length) loadWaveformsAndImages();

  //   return () => {
  //     isMountedRef.current = false;
  //   };
  // }, [allTracks]);
  const isValidMediaLink = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    const soundcloudRegex = /^(https?:\/\/)?(www\.)?soundcloud\.com\/.+$/;

    return (
      youtubeRegex.test(url) ||
      vimeoRegex.test(url) ||
      soundcloudRegex.test(url)
    );
  };

  return (
    <div className="musicInspiration-container">
      <Formik
        innerRef={(ref) => {
          if (ref) formikRef.current = ref;
        }}
        initialValues={{
          selectedTracks:
            musicInspiration?.tracks
              ?.filter((t) => t.selected)
              .map((t) => t.id) || [],
        }}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => {
          const handleCheckboxChange = (trackId) => {
            const isChecked = values.selectedTracks.includes(trackId);

            const newSelectedTracks = isChecked
              ? values.selectedTracks.filter((id) => id !== trackId)
              : [...values.selectedTracks, trackId];

            setFieldValue("selectedTracks", newSelectedTracks);

            const updatedTracks = allTracks.map((track) => {
              if (track.id === trackId) {
                return {
                  ...track,
                  selected: !isChecked,
                };
              }
              // 🛑 Important: return existing object reference
              return track;
            });

            // 🧠 Smart reorder without recreating unchanged objects
            const selectedTrackSet = new Set(newSelectedTracks);
            const reorderedTracks = [
              ...updatedTracks.filter((t) => selectedTrackSet.has(t.id)),
              ...updatedTracks.filter((t) => !selectedTrackSet.has(t.id)),
            ];

            setAllTracks(reorderedTracks);

            dispatch(
              setCustomTrackForm({
                key: "musicInspiration",
                values: {
                  ...musicInspiration,
                  tracks: reorderedTracks,
                },
              })
            );
          };

          return (
            <Form>
              <div>
                <div className="musicInspiration-header">
                  <FormattedMessage id="CustomTrackForm.musicInspirationTitle" />
                </div>
                <div className="musicInspiration-subtitle">
                  <FormattedMessage id="CustomTrackForm.musicInspirationSubTitle" />
                </div>

                <div className="reference-track">
                  <div className="st-filter-header">
                    <div className="st-filter-lp">
                      <p className="st-filter-para">
                        <FormattedMessage id="CustomTrackForm.referencetrack" />
                      </p>
                      <div className="st-filter-lp-inner">
                        <button
                          className={`st-filter-btn st-btn-spotify ${
                            stSearchFrom === "spotify" ? "active" : ""
                          }`}
                          searchstatus="from-spotify"
                          onClick={setSearchStatus}
                          type="button"
                        >
                          <SpotifyIcon
                            style={{ height: "1.6rem", width: "1.6rem" }}
                          />
                          Spotify
                        </button>
                        <button
                          className={`st-filter-btn st-btn-library ${
                            stSearchFrom === "library" ? "active" : ""
                          }`}
                          searchstatus="from-library"
                          onClick={setSearchStatus}
                          type="button"
                        >
                          Library
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="st-filter-rp-inner">
                    {stSearchFrom === "library" && (
                      <div className="st-similar-autosearch">
                        {config.modules.removeAlgolia ? (
                          <LibrarySearch
                            setShowDropDown={setShowDropDown}
                            setLibTracks={setLibTracks}
                          />
                        ) : (
                          <CustomAutocomplete
                            defaultRefinement=""
                            setShowDropDown={setShowDropDown}
                          />
                        )}
                        {showDropDown && libTracks.length > 0 && (
                          <table className="autoTable libraryTracksList">
                            <tbody>
                              {libTracks.map((hit) => (
                                <tr
                                  key={hit.objectID}
                                  className="autoTr"
                                  onClick={() => {
                                    getTrackCyaniteData(hit);
                                  }}
                                >
                                  <td>
                                    <SearchResultsCard
                                      data_type="library"
                                      track_name={hit.track_name}
                                      preview_image_url={hit.preview_image}
                                      source_id={hit.source_id}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {stSearchFrom === "spotify" && (
                      <div className="st-similar-autosearch spotify">
                        <SpotifySearch2
                          // fromSS={true}
                          fetchSimilarFromSpotify={(trackid) => {
                            setSpotifyTrack(trackid);
                          }}
                          setShowDropDown={setShowDropDown}
                          showDropDown={showDropDown}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="link-area">
                  <p className="st-filter-link">
                    <FormattedMessage id="CustomTrackForm.pasteLink" />
                  </p>
                  <LinkInputWrapper
                    id="link"
                    name="link"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CustomTrackForm.linkPlaceholder",
                    })}
                    value={values.link}
                    onChange={(e) => setFieldValue("link", e.target.value)}
                    showSearchButton={true}
                    onSearchClick={(link) => {
                      if (!isValidMediaLink(link)) {
                        setLinkError(
                          "Invalid link. Please enter a valid link from Youtube, SoundCloud, Vimeo, etc."
                        );
                        setFieldValue("link", "");
                        return;
                      }

                      setLinkError(""); // Clear previous error
                      const parsed = MediaService.getEmbeddedMediaInfo(link);

                      if (parsed?.embedUrl) {
                        const videoType = parsed.videoType || "custom";

                        const trackId = `${videoType}-${parsed.videoID}`;

                        // Skip if already selected
                        const alreadyExists = allTracks.some(
                          (t) => t.id === trackId
                        );
                        if (alreadyExists) {
                          console.log(
                            "Link-based track already exists. Skipping..."
                          );
                          setFieldValue("link", "");
                          return;
                        }

                        // Set loader
                        setLoadingTrackIds((prev) => ({
                          ...prev,
                          [trackId]: true,
                        }));

                        // Add temporary track
                        setAllTracks((prevTracks) => {
                          const checked = prevTracks.filter((t) => t.selected);
                          const unchecked = prevTracks.filter(
                            (t) => !t.selected
                          );

                          return [
                            ...checked,
                            {
                              id: trackId,
                              // title: `${
                              //  videoType.charAt(0).toUpperCase() +
                              //  videoType.slice(1)
                              //} Track`,
                              //image: "",
                              //duration_in_sec: 0,
                              //preview_track_url: "",
                              //audio_url: "",
                              source: videoType,
                              link,
                              embedUrl: parsed.embedUrl,
                              //height: parsed.height,
                              selected: false,
                            },
                            ...unchecked,
                          ];
                        });

                        // Optional fake delay
                        setTimeout(() => {
                          setLoadingTrackIds((prev) => {
                            const copy = { ...prev };
                            delete copy[trackId];
                            return copy;
                          });
                        }, 1000);
                      }

                      setFieldValue("link", "");
                    }}
                  />
                </div>
                {linkError && (
                  <>
                    <br />
                    <p className="report_form_error">{linkError}</p>
                  </>
                )}
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
                    <div
                      className="musicInspiration-list"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {allTracks.map((track) => {
                        const isChecked = values.selectedTracks.includes(
                          track.id
                        );
                        // const resolvedImage = imageMap[track.id];
                        // const waveform = waveformMap[track.id];

                        return (
                          <div key={track.id} className="track-card">
                            {loadingTrackIds[track.id] ? (
                              (console.log(`Loading track ${track.id}`),
                              (
                                <div className="track-card__loader">
                                  <SpinnerDefault />
                                </div>
                              ))
                            ) : (
                              <>
                                {/* Track Checkbox */}
                                <div className="track-checkbox">
                                  <CheckboxWrapper
                                    name="selectedTracks"
                                    value={track.id}
                                    checked={isChecked}
                                    onChange={() =>
                                      handleCheckboxChange(track.id)
                                    }
                                  />
                                </div>

                                {/* Spotify Embed */}
                                {track.source === "spotify" ? (
                                  <Iframe
                                    url={`https://open.spotify.com/embed/track/${track.id}?theme=0`}
                                    width="100%"
                                    height="80"
                                    frameBorder="0"
                                    allow="encrypted-media"
                                    className="spotify-iframe"
                                  />
                                ) : track.source === "youtube" ||
                                  track.source === "vimeo" ||
                                  track.source === "soundcloud" ? (
                                  <iframe
                                    src={track.embedUrl}
                                    width="100%"
                                    height="112px"
                                    frameBorder="0"
                                    allow="fullscreen; autoplay; encrypted-media"
                                    allowFullScreen
                                    className="media-iframe"
                                    title={`Embedded-${track.id}`}
                                    style={{ display: "block" }}
                                  />
                                ) : (
                                  <div className="TrackcardV2">
                                    <div className="TrackcardV2__main">
                                      {/* <a
                                        target="_self"
                                        className="track-slide-show-item"
                                        href={`#/track_page/${track.id}`}
                                      > */}
                                      <div className="PlayListTitleList__Item__Left">
                                        <Picture
                                          srcUrl={track.image}
                                          index={track.id}
                                          // loading={!resolvedImage}
                                        />
                                      </div>
                                      {/* </a> */}

                                      <div className="TrackcardV2__info">
                                        <div className="TrackcardV2__title__container">
                                          <p className="TrackcardV2__item__title">
                                            <span>{track.title}</span>
                                          </p>
                                        </div>
                                        <div className="TrackcardV3__cover">
                                          {/* <Picture
                                            key={track.id}
                                            srcUrl={
                                              track?.algiliaData?.preview_image
                                            }
                                            loading={false}
                                            index={track.id}
                                          /> */}
                                          <AudioPlayerSH2
                                            imgSrc={track.image}
                                            isImgLoading={false}
                                            trackName={
                                              track?.algiliaData?.track_name
                                            }
                                            trackType={
                                              track?.algiliaData?.track_type_id
                                            }
                                            track_length={
                                              track?.algiliaData
                                                ?.duration_in_sec
                                            }
                                            index={
                                              track.algiliaData
                                                ?.sonichub_track_id
                                            }
                                            playFromPicture={false}
                                            key={track.id}
                                            type={"TpTc"}
                                            active={true}
                                            isCyaniteActive={false}
                                            trackCardNameProp={
                                              track?.algiliaData?.track_name
                                            }
                                            playingAudio={playingAudio}
                                            setPlayingAudio={setPlayingAudio}
                                            playPause={playPause}
                                            setPlayList={setPlayList}
                                            setPlayingIndex={setPlayingIndex}
                                            setPlayListType={setPlayListType}
                                            strotswar_track_id={
                                              track?.algiliaData
                                                ?.strotswar_track_id
                                            }
                                            wavefile={
                                              track?.algiliaData?.wave_form_js
                                            }
                                            wave_form_js={
                                              track?.algiliaData?.wave_form_js
                                            }
                                            track_type_id={
                                              track?.algiliaData?.track_type_id
                                            }
                                            musicInspiration={true}
                                            source_id={
                                              track?.algiliaData?.source_id
                                            }
                                          />

                                          {/* <IconWrapper
                          className="trackcard_play_pause_icon"
                          icon={true ? "Play" : "Pause"}
                        /> */}
                                        </div>
                                        {/* <div className="TrackcardV2_lower_block">
                                          <TrackCardV2AudioPlayer
                                            key={`TrackCardV2AudioPlayer-${track?.algiliaData?.sonichub_track_id}`}
                                            songUrl={track.preview_track_url}
                                            preview_track_url={
                                              track.preview_track_url
                                            }
                                            waveformDataProp={track.wavefile}
                                            track_length={track.duration_in_sec}
                                            index={
                                              track?.algiliaData
                                                ?.sonichub_track_id
                                            }
                                            type="Tc"
                                            active={
                                              playingAudio?.id ===
                                              track?.algiliaData
                                                ?.sonichub_track_id
                                            }
                                            trackCardNameProp={track.title}
                                            srcUrl={getMediaBucketPath(
                                              track?.algiliaData?.preview_image,
                                              track?.algiliaData?.source_id,
                                              "image"
                                            )}
                                            playingAudio={playingAudio}
                                            setPlayingAudio={setPlayingAudio}
                                            playPause={playPause}
                                            setPlayList={setPlayList}
                                            setPlayingIndex={setPlayingIndex}
                                            setPlayListType={setPlayListType}
                                            playListType={playListType}
                                            wavefile={
                                              track?.algiliaData?.wavefile
                                            }
                                            source_id={
                                              track?.algiliaData?.source_id
                                            }
                                            strotswar_track_id={
                                              track?.algiliaData
                                                ?.strotswar_track_id
                                            }
                                            track_mediatypes={
                                              track?.algiliaData
                                                ?.track_mediatypes
                                            }
                                            track_type_id={
                                              track?.algiliaData?.track_type_id
                                            }
                                          />
                                          <div className="TrackcardV2__duration">
                                            {formatDuration(
                                              track?.algiliaData
                                                ?.duration_in_sec
                                            )}
                                          </div>
                                        </div> */}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </FooterMusicPlayerContext.Consumer>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MusicInspiration;
