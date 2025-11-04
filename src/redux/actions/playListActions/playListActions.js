import getTrackDetails from "../../../common/utils/getTrackDetails.js";
import getTrackDetailsByAlgoliaId from "../../../common/utils/getTrackDetailsByAlgoliaId.js";
import normalizeAlgoliaTrack from "../../../common/utils/normalizeAlgoliaTrack.js";
import PlaylistService from "../../../playlist/services/PlaylistService";
import {
  CLOSE_CREATE_NEW_PLAYLISTDIALOG,
  CLOSE_DELETE_PLAYLISTDIALOG,
  CLOSE_SHARETABS_PLAYLISTDIALOG,
  CREATE_NEW_PLAYLIST_WITH_TRACK_ID,
  GET_PLAYLISTDATA_BY_ID_SUCCESS,
  GET_PLAYLISTDATA_SUCESS,
  OPEN_CREATE_NEW_PLAYLISTDIALOG,
  OPEN_DELETE_PLAYLISTDIALOG,
  OPEN_SHARETABS_PLAYLISTDIALOG,
  PLAYLIST_DOES_NOT_EXIST,
  SET_CREATE_NEW_PLAYLIST_TYPE,
  START_FETCHING_PLAYLIST_BY_ID_DATA,
  START_FETCHING_PLAYLIST_META,
} from "../../constants/actionTypes.js";
import { showError } from "../notificationActions/index.js";

//addition by Trupti-Wits

// PLAYLIST BY ID
export const savePlaylistByIdMetaData = (data) => {
  return {
    type: GET_PLAYLISTDATA_BY_ID_SUCCESS,
    data,
  };
};

export const startFetchingGetPlaylistById = () => {
  return {
    type: START_FETCHING_PLAYLIST_BY_ID_DATA,
  };
};
export const setTrackIdToNewPlaylist = (trackID) => {
  return {
    type: CREATE_NEW_PLAYLIST_WITH_TRACK_ID,
    trackID,
  };
};
export const playlistDoesntExist = () => {
  return {
    type: PLAYLIST_DOES_NOT_EXIST,
  };
};

export const getPlaylistById = (id) => {
  return (dispatch) => {
    // FETCH PLAYLIST DATA HERE, DISPATCH ACTIONS TO STORE RESULST INTO STATE
    if (!id) {
      // dispatch(
      //   showError(
      //     "Something went wrong fetching your Playlist Data, please try again"
      //   )
      // );
      return;
    }
    // ID
    dispatch(startFetchingGetPlaylistById());
    PlaylistService.getById(id)
      .then(async (data) => {
        // CASE IF PLAYLIST DOESN'T EXIST
        if (data.constructor === Object && Object.entries(data).length === 0) {
          dispatch(playlistDoesntExist());
          return;
        } else {
          // --- Step 1: Extract Track IDs ---
          const memoizedIds =
            data?.tracks
              ?.filter((track) => !track?.algoliaId && track?.objectID)
              ?.map((track) => track.objectID) || [];

          const memoizedAlgoliaIds =
            data?.tracks
              ?.filter((track) => !!track?.algoliaId)
              ?.map((track) => track.algoliaId) || [];

          if (memoizedIds.length > 0 || memoizedAlgoliaIds.length > 0) {
            try {
              // --- Step 2: Fetch Algolia details in parallel ---
              const [algoliaResponseByTrackId, algoliaResponseByAlgoliaId] =
                await Promise.all([
                  memoizedIds.length > 0 ? getTrackDetails(memoizedIds) : [],
                  memoizedAlgoliaIds.length > 0
                    ? getTrackDetailsByAlgoliaId(memoizedAlgoliaIds)
                    : [],
                ]);

              const algoliaResponse = [
                ...(algoliaResponseByTrackId || []),
                ...(algoliaResponseByAlgoliaId || []),
              ];

              // --- Step 3: Merge per track (based on algoliaId or objectID) ---
              const merged = data.tracks.map((track) => {
                let match = null;

                if (track?.algoliaId) {
                  // ✅ Match by Algolia objectID
                  match = algoliaResponse.find(
                    (alg) => String(alg?.objectID) === String(track?.algoliaId)
                  );
                } else {
                  // ✅ Match by SonicHub track ID
                  match = algoliaResponse.find(
                    (alg) =>
                      String(alg?.sonichub_track_id) === String(track?.objectID)
                  );
                }

                return { ...track, ...(match || {}) };
              });

              // --- Step 4: Save enriched playlist ---
              dispatch(
                savePlaylistByIdMetaData({
                  ...data,
                  tracks: merged,
                })
              );
              // --- Step 3: Merge playlist data with Algolia directly ---
            } catch (error) {
              console.error("Error merging Algolia data:", error);
              // fallback - save raw playlist
              dispatch(savePlaylistByIdMetaData(data));
            }
          } else {
            // No tracks → directly save
            dispatch(savePlaylistByIdMetaData(data));
          }
        }
      })
      .catch(() => {
        dispatch(playlistDoesntExist());
      });
  };
};

export const getPlaylistDataUnregistered = (playlistData) => {
  return (dispatch) => {
    // FETCH PLAYLIST DATA HERE, DISPATCH ACTIONS TO STORE RESULST INTO STATE
    // data
    dispatch(startFetchingGetPlaylistById());
    dispatch(savePlaylistByIdMetaData(playlistData));
  };
};

// ALL PLAYLISTS
export const savePlaylistMetaData = (data) => {
  return {
    type: GET_PLAYLISTDATA_SUCESS,
    data,
  };
};

export const startFetchingsavePlaylistMetaData = () => {
  return {
    type: START_FETCHING_PLAYLIST_META,
  };
};

export const getAllPlaylists = () => {
  return (dispatch) => {
    // FETCH PLAYLIST DATA HERE, DISPATCH ACTIONS TO STORE RESULST INTO STATE
    dispatch(startFetchingsavePlaylistMetaData());
    PlaylistService.getAll()
      .then((data) => {
        data.forEach((item) => {
          delete item.tracks;
        });

        dispatch(savePlaylistMetaData(data));
      })
      .catch(() => {
        dispatch(
          showError(
            "Something went wrong fetching your Playlists, please try again"
          )
        );
      });
  };
};

export const closeCreateNewPlaylistDialog = () => {
  return {
    type: CLOSE_CREATE_NEW_PLAYLISTDIALOG,
  };
};
export const openCreateNewPlaylistDialog = () => {
  return {
    type: OPEN_CREATE_NEW_PLAYLISTDIALOG,
  };
};

export const closeDeletePlaylistDialog = () => {
  return {
    type: CLOSE_DELETE_PLAYLISTDIALOG,
  };
};
export const openDeletePlaylistDialog = (playlistId) => {
  return {
    type: OPEN_DELETE_PLAYLISTDIALOG,
    playlistId,
  };
};

export const closeShareTabsPlaylistDialog = () => {
  return {
    type: CLOSE_SHARETABS_PLAYLISTDIALOG,
  };
};

export const openShareTabsPlaylistDialog = (playlistId) => {
  return {
    type: OPEN_SHARETABS_PLAYLISTDIALOG,
    playlistId,
  };
};
export const setCreateNewPlaylistType = (variety) => {
  return {
    type: SET_CREATE_NEW_PLAYLIST_TYPE,
    variety,
  };
};
