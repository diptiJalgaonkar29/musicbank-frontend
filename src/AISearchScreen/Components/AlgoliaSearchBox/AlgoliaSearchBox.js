// AlgoliaSearchBox.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { MultiSelect } from "react-multi-select-component";
import { ReactComponent as FilterIcon } from "../../../static/filterIcon.svg";
import { ReactComponent as CloseIcon } from "../../../static/closeIcon.svg";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import { CustomInfiniteHits } from "../CustomInfiniteHits";
import { useRefinementHandlers } from "../useRefinementHandlers";
import { useDispatch, useSelector } from "react-redux";
import { Configure, useStats } from "react-instantsearch";
import { last } from "lodash";
import { useAlgoliaIndex } from "../AlgoliaIndexContext";
import { LazyLoadComponent } from "../../../common/components/LazyLoadComponent/LazyLoadComponent";
import CheckboxWrapper from "../../../branding/componentWrapper/CheckboxWrapper";
import FilterSidebar from "../FilterSideBar/FilterSidebar";
import CustomSearchBox from "../CustomSearchBox";
import FilterChips from "../FilterChips";
import AsyncService from "../../../networking/services/AsyncService";
import TrackcardV3 from "../../../search1/components/TrackcardV3/TrackcardV3";
import Iframe from "react-iframe";
import "./AlgoliaSearchBox.css";
import DownloadWidgetWithCookiesV3Dialog from "../../../track/components/TrackPageTrackCard/DownloadWidgetWithCookiesV3Dialog";
import AddToPlaylistDialog from "../../../track/components/TrackPageTrackCard/AddToPlaylistDialog";
import {
  setAllFavTrackIds,
  setSimilQuery,
} from "../../../redux/actions/searchActions/searchActions";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { setPredict } from "../../../redux/actions/PredictAction/predictAction";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import { useNavigate, useSearchParams } from "react-router-dom";
import AudioPlayerMini from "../../../common/components/AudiplayerMini/AudioPlayerMini";
import { setIsPlayingIndex } from "../../../redux/actions/playerActions/playerActions";
import { SET_SIMIL_QUERY } from "../../../redux/constants/actionTypes";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";

const SORT_INDEX_MAP = {
  TrackNameAZ: "track_name_asc",
  TrackNameZA: "track_name_desc",
  Duration: "duration_desc",
  DateAdded: "date_added_desc",
};

const trendingGenres = [
  { label: "Track Name(A-Z)", value: "TrackNameAZ" },
  { label: "Track Name(Z-A)", value: "TrackNameZA" },
  { label: "Duration", value: "Duration" },
  { label: "Date Added", value: "DateAdded" },
];

function CustomStats() {
  const {
    hitsPerPage,
    nbHits,
    areHitsSorted,
    nbSortedHits,
    nbPages,
    page,
    processingTimeMS,
    query,
  } = useStats();

  return <>{`${nbHits} tracks found`}</>;
}

const AlgoliaSearchBox = ({
  selected,
  setSelected,
  handleUploadVideoBriefToTXt,
  isLoading,
  stopPolling,
  selectedFiles,
  algoliaFilterMGT,
  setBaseFilter,
  trackData,
}) => {
  const [AIquery, setAIquery] = useState("");
  const [similquery, setSimilquery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState([]);
  const [allHits, setAllHits] = useState([]);
  const [musicLibraryMaster, setMusicLibraryMaster] = useState([]);
  const { indexName, setIndexName } = useAlgoliaIndex();
  const { trackTypeIdAndLabelObj } = useSelector((state) => state.taxonomy);
  const { trackDetails } =
    useSelector((state) => state.musicLicensingForm) || {};
  useEffect(() => {
    if (Object.keys(trackTypeIdAndLabelObj || {}).length === 0) return;
    fetchMusicLibrary(trackTypeIdAndLabelObj);
  }, [trackTypeIdAndLabelObj]);

  const fetchMusicLibrary = async (trackTypeIdAndLabelObj) => {
    try {
      // Convert object to array
      const formatted = Object.keys(trackTypeIdAndLabelObj || {}).map(
        (key) => ({
          value: key, // key is the `id`
          label: trackTypeIdAndLabelObj[key], // value is the `name`
        })
      );

      setMusicLibraryMaster(formatted);
    } catch (error) {
      console.error("Failed to load music library:", error);
    }
  };

  const handleGenreChange = (selected) => {
    const selectedVal = selected?.[0]?.value;

    setSelectedGenres(selected);
    setIndexName(SORT_INDEX_MAP[selectedVal] || "tracksData_Search");
  };

  return (
    <AlgoliaSearchBoxInner
      selected={selected}
      algoliaFilterMGT={algoliaFilterMGT}
      setSelected={setSelected}
      AIquery={AIquery}
      setAIquery={setAIquery}
      similquery={similquery}
      setSimilquery={setSimilquery}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      selectedLibraries={selectedLibraries}
      setSelectedLibraries={setSelectedLibraries}
      selectedGenres={selectedGenres}
      handleGenreChange={handleGenreChange}
      musicLibraryMaster={musicLibraryMaster}
      selectedTrackIds={selectedTrackIds}
      setSelectedTrackIds={setSelectedTrackIds}
      allHits={allHits}
      setAllHits={setAllHits}
      handleUploadVideoBriefToTXt={handleUploadVideoBriefToTXt}
      isLoading={isLoading}
      stopPolling={stopPolling}
      selectedFiles={selectedFiles}
      setBaseFilter={setBaseFilter}
      trackData={trackData}
    />
  );
};

const AlgoliaSearchBoxInner = ({
  selected,
  algoliaFilterMGT,
  setSelected,
  AIquery,
  setAIquery,
  similquery,
  setSimilquery,
  isFilterOpen,
  setIsFilterOpen,
  selectedLibraries,
  setSelectedLibraries,
  selectedGenres,
  handleGenreChange,
  musicLibraryMaster,
  selectedTrackIds,
  setSelectedTrackIds,
  allHits,
  setAllHits,
  handleUploadVideoBriefToTXt,
  isLoading,
  stopPolling,
  selectedFiles,
  setBaseFilter,
  trackData,
}) => {
  const {
    genreRefine,
    instrumentRefine,
    keyRefine,
    tempoRefine,
    libraryRefine,
    emotionRefine,
  } = useRefinementHandlers();

  const [selectedTrack, setSelectedTrack] = useState(false);
  const [similarityTrack, setSimilarityTrack] = useState(null);
  const [track, setTrackData] = useState(null);
  // const [showSuggestions, setShowSuggestions] = useState(true);
  const [cyaniteIdFilter, setCyaniteIdFilter] = useState(null);
  //const [baseFiltering, setBaseFiltering] = useState(false);
  const [cyaniteId, setCyaniteId] = useState(null);
  const [addToProjectOpen, setAddToProjectOpen] = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [createPredictProject, setCreatePredictProject] = useState(false);
  const [creditRequest, setCreditRequest] = useState(null);
  const [brandType, setBrandType] = useState(null);
  const navigate = useNavigate();
  const { config, jsonConfig } = useContext(BrandingContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const superBrandId = getSuperBrandId();
  const brandId =
    BrandingContext._currentValue?.config?.brandId ||
    localStorage.getItem("brandId");
  let serverName = "";
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    serverName = config?.modules?.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }
  useEffect(() => {
    if (trackData && Object.keys(trackData).length > 0) {
      console.log("trackData:", trackData);
      handleSimilaritySearch(trackData);
    }
  }, [trackData]);

  const handleSimilaritySearch = (trackObj) => {
    // console.log("handleSimilaritySearch", trackObj);
    setSimilarityTrack(trackObj);
    getLibraryToLibraryData(trackObj?.cyanite_id);
    setSelected("similarity");

    dispatch({ type: SET_SIMIL_QUERY, payload: trackObj.track_name });
  };
  let baseFilter;

  if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    baseFilter = `analysis_status=1 AND facet_brand_assigned:"${serverName}-${superBrandId}_${brandId}:true" AND facet_isTrackActive:"${serverName}-${superBrandId}_${brandId}:true" AND facet_trackStatus:"${serverName}-${superBrandId}_${brandId}:true"`;
  } else {
    baseFilter = `analysis_status=1 AND brands_assigned=${brandId} AND trackStatus:true AND sonichub_track_id>0`;
  }

  //const filterQuery = "";
  // console.log("algoliasearchboxtInner-token"+token);
  const playingIndexFromStore = useSelector(
    (state) => state.player.playingIndex
  );
  const [retriveDataFromTokenByAPi, setRetriveDataFromTokenApi] = useState([]);
  // console.log("algoliasearchboxtInner-token" + token);
  //const [retriveDataFromTokenByAPi, setRetriveDataFromTokenApi] = useState([])

  const favTracks = useSelector((state) => state.favTracksIds);
  const dispatch = useDispatch();

  const handleRefineFromTrack = useCallback(
    (attribute, value) => {
      console.log("Refine attribute:", attribute, "value:", value);
      // If value is an object, log wave_form_js

      switch (attribute) {
        case "tag_genre":
          genreRefine(value);
          break;
        case "instrument_ids":
          instrumentRefine(value);
          break;
        case "tag_key":
          keyRefine(value);
          break;
        case "tag_tempo":
          tempoRefine(value);
          break;
        case "tag_library":
          libraryRefine(value);
          break;
        case "tag_amp_allmood_ids":
          emotionRefine(value);
      }
    },
    [
      genreRefine,
      instrumentRefine,
      keyRefine,
      tempoRefine,
      libraryRefine,
      emotionRefine,
    ]
  );

  const renderHit = useCallback(
    (props) => (
      <>
        <TrackcardV3
          {...props}
          onRefine={handleRefineFromTrack}
          favTracksIds={favTracks}
          onSimilaritySearch={handleSimilaritySearch}
        />
      </>
    ),
    [handleRefineFromTrack, favTracks]
  );

  useEffect(() => {
    AsyncService.loadData(`/favourites/1`)
      .then((res) => {
        const favs = res.data.map((data) => String(data.fav_data));
        dispatch(setAllFavTrackIds(favs));
      })
      .catch((err) => console.error("Error fetching favourites:", err));
  }, [dispatch]);

  useEffect(() => {
    setIsFilterOpen(false);
    setAIquery("");
    setSimilquery("");
    setBaseFilter();

    //setCyaniteIdFilter(null);
    // setSelectedTrack(false);
    // setSimilarityTrack(null);
  }, [selected]);

  const handleLibraryChange = useCallback(
    (selected) => {
      const newValues = selected.map((lib) => lib.value);
      const prevValues = selectedLibraries.map((lib) => lib.value);

      newValues.forEach((val) => {
        if (!prevValues.includes(val)) libraryRefine(val);
      });
      prevValues.forEach((val) => {
        if (!newValues.includes(val)) libraryRefine(val);
      });

      setSelectedLibraries(selected);
    },
    [selectedLibraries, libraryRefine]
  );

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    // Fetch the track details directly when a track is selected
    fetchTrackDetails(track);
  };
  const handleTrackClose = (track) => {
    setCyaniteIdFilter(null);
    setCyaniteId(null);
    setSimilarityTrack(null);
  };

  const fetchTrackDetails = (trackId) => {
    if (!trackId) return;
    AsyncService.loadData(`/cyanite/fetchSpotifyAnalysis?spotifyId=${trackId}`)
      .then((res) => {
        // console.log("res", res)
        if (res.data?.[0]?.statusMessage === "trackNotAnalyzed") {
          setTrackData("Error");
          return;
        }
        setTrackData(res.data[0]);
      })
      .catch(() => {
        setTrackData("Error");
      });

    AsyncService.loadDataParam(
      `/cyanite/fetchSimilarFromSpotifyToLibrary_advanced?spotifyId=${trackId}`
    )
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // ✅ remove duplicates + ensure numbers
          const uniqueIds = [...new Set(res.data.map((id) => Number(id)))];

          // ✅ build Algolia OR filter string
          const filterString = `(${uniqueIds
            .map((id) => `cyanite_id:${id}`)
            .join(" OR ")})`;

          setCyaniteIdFilter(filterString);
          setCyaniteId(uniqueIds);
        } else {
          setCyaniteIdFilter(null); // nothing found
        }
      })
      .catch((err) => {
        console.error("getLibraryToLibraryData failed", err);
        setCyaniteIdFilter(null);
      });
  };

  // function getSpotifyToLibraryData(_sptid, transfer) {
  //   const filterString = `bpm:${transfer?.bpm - 5} TO ${
  //     transfer?.bpm + 5
  //   } AND ${transfer?.moodTags
  //     ?.map((tag) => `amp_all_mood_tags.tag_names:"${tag}"`)
  //     .join(" OR ")} AND ${transfer?.genreTags
  //     ?.map((tag) => `amp_genre_tags.tag_names:"${tag}"`)
  //     .join(" OR ")}`;

  //   setCyaniteIdFilter(filterString); // 👈 save filter to state
  // }

  function getLibraryToLibraryData(_cyaniteId) {
    AsyncService.loadDataParam(
      `cyanite/fetchSimilarFromLibrary_advanced?cyaniteId=${_cyaniteId}`
    )
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // ✅ remove duplicates + ensure numbers
          const uniqueIds = [...new Set(res.data.map((id) => Number(id)))];

          // ✅ build Algolia OR filter string
          const filterString = `(${uniqueIds
            .map((id) => `cyanite_id:${id}`)
            .join(" OR ")})`;

          setCyaniteIdFilter(filterString);
          setCyaniteId(uniqueIds);
        } else {
          setCyaniteIdFilter(null); // nothing found
        }
      })
      .catch((err) => {
        console.error("getLibraryToLibraryData failed", err);
        setCyaniteIdFilter(null);
      });
  }

  const trackDetails =
    track && track.spotifyTrack ? (
      <tr>
        <td>
          <LazyLoadComponent>
            <Iframe
              src={`https://open.spotify.com/embed/track/${track.spotifyTrack.id}?theme=0`}
              width="auto"
              height="80"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
            />
          </LazyLoadComponent>
        </td>
        <td>{track?.spotifyTrack?.audioAnalysisV6?.result?.bpm}</td>
        <td>{track?.spotifyTrack?.audioAnalysisV6?.result?.key}</td>
        <td>
          {track?.spotifyTrack?.audioAnalysisV6?.result?.predominantVoiceGender}
        </td>
        <td>
          {track?.spotifyTrack?.audioAnalysisV6?.result?.genreTags?.join(", ")}
        </td>
        <td>
          {track?.spotifyTrack?.audioAnalysisV6?.result?.moodTags?.join(", ")}
        </td>
        {config?.modules?.showVendorLicensing && (
          <td>
            <div
              className="request-license-button"
              onClick={() => {
                // console.log("track.spotifyTrack",track.spotifyTrack);

                navigate("/MusicLincensingReq", {
                  state: {
                    trackId: track?.spotifyTrack?.id,
                    requestTrack: trackDetails.requestTrack,
                  },
                });
              }}
            >
              Request License
            </div>
          </td>
        )}
      </tr>
    ) : (
      <tr>
        <td colSpan={9} style={{ textAlign: "center", padding: "25px" }}>
          No track data available
        </td>
      </tr>
    );

  const getCreditInfoByCompanyOrBrand = () => {
    let userId = Number(localStorage?.getItem("brandId"));
    if (!userId) return;
    AsyncService.loadData("users/getUserInternalOrExternalUser")
      .then((response) => {
        setBrandType(response?.data?.companyType);
        // 1 = "internal" & 2 = "external"
        AsyncService?.loadData(
          `credit/getCreditOfBrand?${
            response?.data?.companyType === 1 ? "brandId" : "companyId"
          }=${response?.data?.companyType === 1 ? userId : response?.data?.id}`
        )
          .then((creditResponse) => {
            setCreditRequest(creditResponse?.data?.creditremaining);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // this.setState({
        //   isLoading: false
        // })
      });
  };

  // Helper function to get sonic track ID based on server
  // const getSonicTrackId = (track) => {
  //   if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
  //     if (Array.isArray(track?.facet_sonic_track_id)) {
  //       const match = track.facet_sonic_track_id.find((id) =>
  //         id.startsWith(serverName + ":")
  //       );
  //       return match ? match.split(":")[1] : "";
  //     }
  //     return "";
  //   }
  //   return track?.sonichub_track_id;
  // };

  const getSonicTrackId = (track) => {
    if (serverName === "sh2Demo") {
      return track?.sonichub_track_id != null
        ? String(track.sonichub_track_id)
        : "";
    } else {
      if (Array.isArray(track?.facet_sonic_track_id)) {
        const match = track.facet_sonic_track_id.find((id) =>
          id.startsWith(serverName + ":")
        );
        if (match) {
          return String(match.split(":")[1]);
        }
      }
    }
  };

  // Get selected asset types
  const selectedAssetTypes =
    allHits
      ?.filter((t) =>
        selectedTrackIds.some((item) => item.trackId === getSonicTrackId(t))
      )
      ?.map((t) => t.asset_type_id) || [];

  // Check if all selected tracks share the same asset_type_id
  const allSelectedSameType =
    selectedAssetTypes.length > 0 &&
    selectedAssetTypes.every((id) => id === selectedAssetTypes[0]);

  const maxSelectable = 10;

  const apiTrackIds =
    retriveDataFromTokenByAPi?.flatMap((item) =>
      Array.isArray(item.trackIds) ? item.trackIds : []
    ) || [];

  // Filter out already-existing track IDs from selection
  const newSelectedTracks =
    allHits?.filter(
      (track) =>
        selectedTrackIds.some(
          (item) => item.trackId === getSonicTrackId(track)
        ) && !apiTrackIds.includes(getSonicTrackId(track))
    ) || [];

  // Extract only IDs
  const newSelectedIds = newSelectedTracks.map((t) => getSonicTrackId(t));

  // Remaining limit (exclude already in API)
  const remainingSelectable = maxSelectable - apiTrackIds.length;

  // Final condition
  const canSendToPredict =
    newSelectedIds.length > 0 && // must have at least 1 new
    newSelectedIds.length <= remainingSelectable && // within limit
    creditRequest > 0 &&
    allSelectedSameType;
  // selectedTrackIds.length > 0;

  const cameFromPredict = (predictToken) => {
    // helper to get track ID based on current server
    // const getSonicTrackId = (track) => {
    //   if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    //     if (Array.isArray(track?.facet_sonic_track_id)) {
    //       const match = track.facet_sonic_track_id.find((id) =>
    //         id.startsWith(serverName + ":")
    //       );
    //       return match ? match.split(":")[1] : "";
    //     }
    //     return "";
    //   }
    //   return track?.sonichub_track_id;
    // };
    const getSonicTrackId = (track) => {
      if (serverName === "sh2Demo") {
        return track?.sonichub_track_id != null
          ? String(track.sonichub_track_id)
          : "";
      } else {
        if (Array.isArray(track?.facet_sonic_track_id)) {
          const match = track.facet_sonic_track_id.find((id) =>
            id.startsWith(serverName + ":")
          );
          if (match) {
            return String(match.split(":")[1]);
          }
        }
      }
    };

    // build track list based on selected IDs
    const trackListCustomMade = allHits
      ?.filter((track) =>
        selectedTrackIds.some((item) => item.trackId === getSonicTrackId(track))
      )
      ?.flatMap((track) => {
        const matchedItem = selectedTrackIds.find(
          (item) => item.trackId === getSonicTrackId(track)
        );

        return [
          {
            id: getSonicTrackId(track),
            audio_type: "MP3", // static mp3
            checked: 0,
            algoliaId: matchedItem?.algoliaId || "",
          },
        ];
      });

    // call API and process project details
    AsyncService.loadData(`predict/getProjectId?token=${predictToken}`)
      .then((projectResponse) => {
        if (!projectResponse?.data) return;
        const projectDetails = projectResponse.data;

        const data = {
          id: projectDetails?.projectId || null,
          name: projectDetails?.name || "",
          status: projectDetails?.status || "active",
          audioType: trackListCustomMade,
          description: projectDetails?.description || null,
          airingDate: projectDetails?.airingDate,
          airingCountry: projectDetails?.airingCountry || "",
        };

        addToExistingProjectForPredict(data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const addToExistingProjectForPredict = (pTxt) => {
    AsyncService.postData("/project/addProject", pTxt)
      .then((Update) => {
        updateToPredictAfterThatIsConfirm(pTxt?.id);
      })
      .catch((error) => {});
  };

  const updateToPredictAfterThatIsConfirm = (P_ID) => {
    // Pass Data to update data to predict
    // same as addTransaction API but uses the old token to update the same project

    const predictToken = token == null || token == undefined ? "" : token;
    const trackIds = selectedTrackIds;

    // 🔹 helper to get sonicTrackId based on current server
    // const getSonicTrackId = (track) => {
    //   if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    //     if (Array.isArray(track?.facet_sonic_track_id)) {
    //       const match = track.facet_sonic_track_id.find((id) =>
    //         id.startsWith(serverName + ":")
    //       );
    //       return match ? match.split(":")[1] : "";
    //     }
    //     return "";
    //   }
    //   return track?.sonichub_track_id;
    // };

    const getSonicTrackId = (track) => {
      if (serverName === "sh2Demo") {
        return track?.sonichub_track_id != null
          ? String(track.sonichub_track_id)
          : "";
      } else {
        if (Array.isArray(track?.facet_sonic_track_id)) {
          const match = track.facet_sonic_track_id.find((id) =>
            id.startsWith(serverName + ":")
          );
          if (match) {
            return String(match.split(":")[1]);
          }
        }
      }
    };

    if (trackIds.length > 0) {
      const dataArr =
        allHits
          ?.filter((track) =>
            selectedTrackIds.some(
              (item) => item.trackId === getSonicTrackId(track)
            )
          )
          .map((track) => ({
            projectId: P_ID || "",
            assetType: track?.asset_type_id,
            assetName: (track?.mp3_track || "")?.split("/")[1],
            assetSourceId: track?.strotswar_track_id,
            d_link: getMediaBucketPath(
              track?.mp3_track,
              track?.strotswar_track_id,
              "download"
            ),
            source: 2, // from library (2), from project (1)
            algoliaTrackId: track?.objectID,
            sonicTrackId: getSonicTrackId(track), // ✅ server-aware logic
            txnToken: predictToken,
          })) || [];

      AsyncService.postData("predict/updateAssetOfPrediction", dataArr)
        .then((updateDataToPredict) => {
          // redirect to external predict page
          redirectToExternal(predictToken);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const sendToPredict = (generatedToken) => {
    const predictToken = token == null || token == undefined ? "" : token;
    console.log("sendtopredict", token);
    setCreatePredictProject(true);

    // ✅ Reusable helper for consistent ID extraction
    // const getSonicTrackId = (track) => {
    //   if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    //     if (Array.isArray(track?.facet_sonic_track_id)) {
    //       const match = track.facet_sonic_track_id.find((id) =>
    //         id.startsWith(serverName + ":")
    //       );
    //       return match ? match.split(":")[1] : "";
    //     }
    //     return "";
    //   }
    //   return track?.sonichub_track_id;
    // };
    const getSonicTrackId = (track) => {
      if (serverName === "sh2Demo") {
        return track?.sonichub_track_id != null
          ? String(track.sonichub_track_id)
          : "";
      } else {
        if (Array.isArray(track?.facet_sonic_track_id)) {
          const match = track.facet_sonic_track_id.find((id) =>
            id.startsWith(serverName + ":")
          );
          if (match) {
            return String(match.split(":")[1]);
          }
        }
      }
    };

    if (predictToken.length > 0) {
      // 🔹 Existing prediction flow
      console.log("TOKEN EXISTS - code pending here");
      cameFromPredict(predictToken);
    } else {
      // 🔹 New prediction flow
      console.log("NO TOKEN - start new predict process");
      const trackIds = selectedTrackIds;

      if (trackIds.length > 0) {
        const dataArr =
          allHits
            ?.filter((track) =>
              selectedTrackIds.some(
                (item) => item.trackId === getSonicTrackId(track)
              )
            )
            .map((track) => ({
              assetType: track?.asset_type_id,
              assetName: (track?.mp3_track || "")?.split("/")[1],
              assetSourceId: track?.strotswar_track_id,
              d_link: getMediaBucketPath(
                track?.mp3_track,
                track?.strotswar_track_id,
                "download"
              ),
              source: 2, // from library (2), from project (1)
              algoliaTrackId: track?.objectID,
              sonicTrackId: getSonicTrackId(track), // ✅ consistent ID logic
            })) || [];

        console.log("dataArr", dataArr);

        if (dataArr?.length) {
          dispatch(setPredict(dataArr));
          setAddToProjectOpen(true);
          // setCreatePredictProject(false)
        }
      }
    }
  };

  const getDetailsFromPredictToken = () => {
    console.log("getDetailsFromPredictToken", token);
    AsyncService.loadData(`predict/getCountOfTransactions?token=${token}`)
      .then((predictData) => {
        console.log("predictData.data", predictData);
        setRetriveDataFromTokenApi(
          predictData?.data[0].txn_token === "Token_not_valid"
            ? []
            : predictData?.data
        );
      })
      .catch((err) => {
        console.log("err", err);
        setRetriveDataFromTokenApi([]);
      })
      .catch((err) => {
        console.log("err", err);
        setRetriveDataFromTokenApi([]);
      });
  };

  const redirectToExternal = (token) => {
    const form = document.createElement("form");
    form.method = "POST";
    //form.action = "https://demo.predict.sonic-hub.com/predict-login";
    form.action = window.globalConfig?.PREDICT_BASE_URL + "/predict-login";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "txn_token";
    input.value = token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit(); // 🚀 sends user away to external site
  };

  useEffect(() => {
    getCreditInfoByCompanyOrBrand();
    getDetailsFromPredictToken();
  }, []);
  //const searchBoxRef = useRef();
  return (
    <div className="AlgoliaSearchContainer">
      {addToProjectOpen && (
        <DownloadWidgetWithCookiesV3Dialog
          open={addToProjectOpen} // explicitly pass open
          onClose={() => setAddToProjectOpen(false)} // control closing
          allHits={allHits}
          selectedTrackIds={selectedTrackIds}
          buttonText={null} // suppress internal trigger
          createPredictProject={createPredictProject}
        />
      )}
      {addToPlaylistOpen && (
        <AddToPlaylistDialog
          open={addToPlaylistOpen} // explicitly pass open
          onClose={() => setAddToPlaylistOpen(false)} // control closing
          selectedTrackIds={selectedTrackIds}
          buttonText={null} // suppress internal trigger
        />
      )}

      <CustomSearchBox
        //ref={searchBoxRef}
        AIquery={AIquery}
        setAIquery={setAIquery}
        similquery={similquery}
        setSimilquery={setSimilquery}
        selected={selected}
        onTrackSelect={handleTrackSelect}
        ontrackClose={handleTrackClose}
        handleUploadVideoBriefToTXt={handleUploadVideoBriefToTXt}
        isLoading={isLoading}
        stopPolling={stopPolling}
        setBaseFilter={setBaseFilter}
        selectedFiles={selectedFiles}
        // showSuggestions={showSuggestions} // ✅ control from parent
        //setShowSuggestions={setShowSuggestions}
      />

      <div className="SearchBelow">
        <div className={`filter-panel ${isFilterOpen ? "open" : ""}`}>
          <div className="filter-toggle-wrapper">
            <button
              className="filter-toggle-btn"
              onClick={() => {
                console.log("toggle clicked", isFilterOpen);
                setIsFilterOpen(!isFilterOpen);
              }}
              title={isFilterOpen ? "Close Filters" : "Open Filters"}
            >
              {isFilterOpen ? <CloseIcon /> : <FilterIcon />}
            </button>
          </div>

          <div className={`filter-content ${isFilterOpen ? "show" : "hide"}`}>
            <FilterSidebar
              open={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              //setSidebarFilters={setSidebarFilters}
            />
          </div>
        </div>

        <div className="search-panel">
          {/* Show Track Details Table only when a track is selected */}
          {(selectedTrack || similarityTrack) && ( //&& selected != "ai"
            <div
              className="spotifyTrackDetails"
              style={{ marginBottom: "10px" }}
            >
              <table className="table table-bordered table-dark" width="100%">
                <thead>
                  <tr>
                    <th scope="col">Track Name</th>
                    <th scope="col">BPM</th>
                    <th scope="col">Dominant Key</th>
                    <th scope="col">Predominant Voice Gender</th>
                    <th scope="col">Genre Tags</th>
                    <th scope="col">Mood Tags</th>
                  </tr>
                </thead>

                {selectedTrack ? (
                  <tbody>{trackDetails}</tbody>
                ) : similarityTrack ? (
                  <tbody>
                    <tr>
                      <td>
                        <div className="st-tbl-logo-text-holder">
                          <span className="st-tbl-logo-holder">
                            <img
                              src={similarityTrack.image}
                              alt=""
                              className="st-tbl-logo"
                            />
                          </span>
                          <AudioPlayerMini
                            key={similarityTrack.id}
                            songUrl={similarityTrack.preview_track_url}
                            track_length={similarityTrack.duration_in_sec}
                            index={similarityTrack.id}
                            waveformDataProp={similarityTrack.waveformData}
                            playFromPicture={similarityTrack.clickedOnImage}
                            type="Tc"
                            active={
                              playingIndexFromStore === similarityTrack.id
                            }
                            onPlay={() =>
                              dispatch(setIsPlayingIndex(similarityTrack.id))
                            }
                            onPause={() => dispatch(setIsPlayingIndex(null))}
                            trackCardNameProp={similarityTrack.track_name}
                            srcUrl={similarityTrack.image}
                            strotswar_track_id={
                              similarityTrack.strotswar_track_id
                            }
                            track_mediatypes={similarityTrack.track_mediatypes}
                            track_type_id={similarityTrack.track_type_id}
                          />
                          {similarityTrack.track_name}
                        </div>
                      </td>
                      <td>{similarityTrack.bpm || "-"}</td>
                      <td>{similarityTrack.key || "-"}</td>
                      <td>{similarityTrack.voice_gender || "-"}</td>
                      <td>
                        {Array.isArray(similarityTrack.genreTags)
                          ? similarityTrack.genreTags.join(", ")
                          : "-"}
                      </td>
                      <td>
                        {Array.isArray(similarityTrack.moodTags)
                          ? similarityTrack.moodTags.join(", ")
                          : "-"}
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "25px" }}
                      >
                        No track data available
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          )}

          {(selected == "ai" || cyaniteIdFilter) && (
            <>
              <div className="search-header">
                <div className="searchBtnLeft">
                  {/* <CheckboxWrapper
                    name="selectAll"
                    value="selectAll"
                    checked={
                      selectedTrackIds.length > 0 &&
                      selectedTrackIds.length ===
                      allHits.filter((hit) => {
                        const apiTrackIds = retriveDataFromTokenByAPi?.flatMap(item =>
                          Array.isArray(item.trackIds) ? item.trackIds : []
                        ) || [];

                        const apiAssetTypes = retriveDataFromTokenByAPi?.flatMap(item =>
                          Array.isArray(item.AssetType) ? item.AssetType : []
                        ) || [];

                        return (
                          apiAssetTypes.includes(hit.asset_type_id) &&      // ✅ must match API asset type
                          !apiTrackIds.includes(hit.sonichub_track_id)      // ✅ not already in API
                        );
                      }).length
                    }
                    indeterminate={
                      selectedTrackIds.length > 0 &&
                      selectedTrackIds.length <
                      allHits.filter((hit) => {
                        const apiTrackIds = retriveDataFromTokenByAPi?.flatMap(item =>
                          Array.isArray(item.trackIds) ? item.trackIds : []
                        ) || [];

                        const apiAssetTypes = retriveDataFromTokenByAPi?.flatMap(item =>
                          Array.isArray(item.AssetType) ? item.AssetType : []
                        ) || [];

                        return (
                          apiAssetTypes.includes(hit.asset_type_id) &&
                          !apiTrackIds.includes(hit.sonichub_track_id)
                        );
                      }).length
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;

                      const apiTrackIds = retriveDataFromTokenByAPi?.flatMap(item =>
                        Array.isArray(item.trackIds) ? item.trackIds : []
                      ) || [];

                      const apiAssetTypes = retriveDataFromTokenByAPi?.flatMap(item =>
                        Array.isArray(item.AssetType) ? item.AssetType : []
                      ) || [];

                      if (isChecked) {
                        // ✅ Select only tracks with the same asset type & not in API
                        const selectableIds = allHits
                          .filter(
                            (hit) =>
                              apiAssetTypes.includes(hit.asset_type_id) &&
                              !apiTrackIds.includes(hit.sonichub_track_id)
                          )
                          .map((hit) => hit.sonichub_track_id);

                        setSelectedTrackIds(selectableIds);
                      } else {
                        setSelectedTrackIds([]);
                      }
                    }}
                    label="Select All"
                  /> */}

                  <CheckboxWrapper
                    name="selectAll"
                    value="selectAll"
                    checked={
                      selectedTrackIds.length > 0 &&
                      selectedTrackIds.length ===
                        allHits.filter((hit) => {
                          const apiTrackIds =
                            retriveDataFromTokenByAPi?.flatMap((item) =>
                              Array.isArray(item.trackIds) ? item.trackIds : []
                            ) || [];

                          const apiAssetTypes =
                            retriveDataFromTokenByAPi?.flatMap((item) =>
                              Array.isArray(item.AssetType)
                                ? item.AssetType
                                : []
                            ) || [];

                          return (
                            // ✅ if no assetType from API → allow all
                            (apiAssetTypes.length === 0 ||
                              apiAssetTypes.includes(hit.asset_type_id)) &&
                            !apiTrackIds.includes(hit.sonichub_track_id)
                          );
                        }).length
                    }
                    indeterminate={
                      selectedTrackIds.length > 0 &&
                      selectedTrackIds.length <
                        allHits.filter((hit) => {
                          const apiTrackIds =
                            retriveDataFromTokenByAPi?.flatMap((item) =>
                              Array.isArray(item.trackIds) ? item.trackIds : []
                            ) || [];

                          const apiAssetTypes =
                            retriveDataFromTokenByAPi?.flatMap((item) =>
                              Array.isArray(item.AssetType)
                                ? item.AssetType
                                : []
                            ) || [];

                          return (
                            (apiAssetTypes.length === 0 ||
                              apiAssetTypes.includes(hit.asset_type_id)) &&
                            !apiTrackIds.includes(hit.sonichub_track_id)
                          );
                        }).length
                    }
                    onChange={(e) => {
                      const isChecked = e.target.checked;

                      const apiTrackIds =
                        retriveDataFromTokenByAPi?.flatMap((item) =>
                          Array.isArray(item.trackIds) ? item.trackIds : []
                        ) || [];

                      const apiAssetTypes =
                        retriveDataFromTokenByAPi?.flatMap((item) =>
                          Array.isArray(item.AssetType) ? item.AssetType : []
                        ) || [];

                      const getSonicTrackId = (hit) => {
                        if (
                          serverName === "sh2Dev" ||
                          serverName === "sh2Wpp"
                        ) {
                          if (Array.isArray(hit?.facet_sonic_track_id)) {
                            const match = hit.facet_sonic_track_id.find((id) =>
                              id.startsWith(serverName + ":")
                            );
                            return match
                              ? Number(match.split(":")[1]) || null
                              : null;
                          }
                          return null;
                        }
                        return Number(hit?.sonichub_track_id) || null;
                      };

                      if (isChecked) {
                        const selectableTracks = allHits
                          .filter((hit) => {
                            const sonicTrackId = getSonicTrackId(hit);
                            const numericApiTrackIds = apiTrackIds.map(Number); // ✅ normalize types

                            return (
                              (apiAssetTypes.length === 0 ||
                                apiAssetTypes.includes(hit.asset_type_id)) &&
                              !numericApiTrackIds.includes(sonicTrackId)
                            );
                          })
                          .map((hit) => ({
                            trackId: String(getSonicTrackId(hit)),
                            algoliaId: hit.objectID,
                          }));
                        console.log("selectableTracks", selectableTracks);
                        setSelectedTrackIds(selectableTracks);
                      } else {
                        setSelectedTrackIds([]);
                      }
                    }}
                    label="Select All"
                  />

                  {selectedTrackIds.length > 0 && (
                    <>
                      <ButtonWrapper
                        className="searchHeadBtn"
                        variant="filledSecondary"
                        onClick={sendToPredict}
                        disabled={!canSendToPredict}
                      >
                        Add to Prediction
                      </ButtonWrapper>
                      <ButtonWrapper
                        variant="filledSecondary"
                        className="searchHeadBtn"
                        onClick={() => {
                          setCreatePredictProject(false);
                          setAddToProjectOpen(true);
                        }}
                      >
                        Add to Project
                      </ButtonWrapper>
                      <ButtonWrapper
                        variant="filledSecondary"
                        className="searchHeadBtn"
                        onClick={() => {
                          setCreatePredictProject(false);
                          setAddToPlaylistOpen(true);
                        }}
                      >
                        Add to Playlist
                      </ButtonWrapper>
                    </>
                  )}
                </div>

                <div className="searchBtnRht">
                  <div className="totalCount">
                    <CustomStats />
                  </div>
                  <div className="requestTrackWrapper">
                    <MultiSelect
                      options={musicLibraryMaster}
                      value={selectedLibraries}
                      onChange={handleLibraryChange}
                      disableSearch
                      hasSelectAll
                      labelledBy="Select"
                      className="multi_select_music_library_filter selectAll"
                      overrideStrings={{
                        selectSomeItems: "Filter by Music Libraries",
                        allItemsAreSelected: "Filter by Music Libraries",
                        selectAll: "All Libraries",
                      }}
                      valueRenderer={() => "Filter by Music Libraries"}
                    />
                  </div>

                  <div className="genreWrapper">
                    <MultiSelect
                      options={trendingGenres}
                      value={selectedGenres}
                      onChange={(selected) => {
                        const lastSelected = selected.slice(-1);
                        handleGenreChange(lastSelected);
                      }}
                      hasSelectAll={false}
                      disableSearch
                      labelledBy="Select"
                      className="multi_select_music_library_filter selectAll"
                      overrideStrings={{
                        selectSomeItems: "Sort by",
                        allItemsAreSelected: "Sort by",
                      }}
                      valueRenderer={(value) =>
                        value && value.length > 0
                          ? `Sort by ${value[0].label}`
                          : "Sort by \u00A0\u00A0\u00A0\u00A0\u00A0"
                      }
                    />
                  </div>
                </div>
              </div>

              <FilterChips />
            </>
          )}

          <>
            {/* <Configure
              hitsPerPage={selected !== "ai" ? 60 : 15}
              filters={
                cyaniteIdFilter || selected !== "ai"
                  ? `${cyaniteIdFilter} AND ${baseFilter}`
                  : baseFilter
              }
            /> */}
            {/* {alert(algoliaFilterMGT)} */}
            <CustomInfiniteHits
              selected={selected}
              algoliaFilterMGT={
                algoliaFilterMGT
                  ? `${algoliaFilterMGT} AND ${baseFilter}`
                  : null
              }
              algoliaFilter={
                cyaniteIdFilter || selected !== "ai"
                  ? `${cyaniteIdFilter} AND ${baseFilter}`
                  : baseFilter
              }
              selectedTrackIds={selectedTrackIds}
              setSelectedTrackIds={setSelectedTrackIds}
              onHitsUpdate={setAllHits}
              hitComponent={renderHit}
              trackIdsFromApi={retriveDataFromTokenByAPi}
            />
          </>
        </div>
      </div>
    </div>
  );
};

export default AlgoliaSearchBox;
