import { updateObject } from "../../common/utils/utility";
import {
  CLOSE_CREATE_NEW_PLAYLISTDIALOG,
  CLOSE_DELETE_PLAYLISTDIALOG,
  CLOSE_SHARETABS_PLAYLISTDIALOG,
  CREATE_NEW_PLAYLIST_WITH_TRACK_ID,
  GET_ALL_PLAYLISTS,
  GET_PLAYLISTDATA_BY_ID_SUCCESS,
  GET_PLAYLISTDATA_SUCESS,
  GET_PLAYLIST_BY_ID,
  GET_PLAYLIST_DATA_UNREGISTERED,
  OPEN_CREATE_NEW_PLAYLISTDIALOG,
  OPEN_DELETE_PLAYLISTDIALOG,
  OPEN_SHARETABS_PLAYLISTDIALOG,
  PLAYLIST_DOES_NOT_EXIST,
  SET_CREATE_NEW_PLAYLIST_TYPE,
  START_FETCHING_PLAYLIST_BY_ID_DATA,
  START_FETCHING_PLAYLIST_META,
} from "../constants/actionTypes";

//addition by Trupti-Wits

const initialState = {
  createNewPlaylistDialog: false,
  deletePlaylistDialogOpen: false,
  shareTabsPlaylistDialogOpen: false,
  playlistToDelete: null,
  createNewPlaylistDialogType: "withTracks",
  trackIDToAddToNewPlaylist: null,
  PlaylistMetaData: null,
  playlistDoesntExist: null,
  PlaylistMetaDataLoading: false,
  PlaylistByIdData: null,
  PlaylistByIdDataLoading: false,
};

const getPlaylistsById = () => {};

const getPlaylistDataUnregistered = () => {};

const getAllPlaylists = () => {};

const setDialogOpen = (state) => {
  return updateObject(state, {
    createNewPlaylistDialog: true,
  });
};

const setPlaylistType = (state, action) => {
  return updateObject(state, {
    createNewPlaylistDialogType: action.variety,
  });
};

const setDiaglogClosed = (state) => {
  return updateObject(state, {
    createNewPlaylistDialog: false,
    createNewPlaylistDialogType: "withTracks",
  });
};
const trackIDToAddToNewPlaylist = (state, action) => {
  return updateObject(state, {
    trackIDToAddToNewPlaylist: action.trackID,
  });
};

const setStartFetchingPlaylistMetaData = (state) => {
  return updateObject(state, {
    PlaylistMetaDataLoading: true,
  });
};

const savePlaylistMetaData = (state, action) => {
  return updateObject(state, {
    PlaylistMetaData: action.data,
    PlaylistMetaDataLoading: false,
  });
};

const setStartFetchingPlaylistByIdData = (state) => {
  return updateObject(state, {
    PlaylistByIdDataLoading: true,
  });
};

const savePlaylistByIdData = (state, action) => {
  return updateObject(state, {
    PlaylistByIdData: action.data,
    PlaylistByIdDataLoading: false,
    playlistDoesntExist: false,
  });
};
const setPlaylistDoesntExist = (state) => {
  return updateObject(state, {
    playlistDoesntExist: true,
  });
};
const openDeletePlaylistDialog = (state, action) => {
  return updateObject(state, {
    deletePlaylistDialogOpen: true,
    playlistToDelete: action.playlistId,
  });
};
const closeDeletePlaylistDialog = (state) => {
  return updateObject(state, {
    deletePlaylistDialogOpen: false,
    playlistToDelete: null,
  });
};

const openShareTabsPlaylistDialog = (state, action) => {
  return updateObject(state, {
    shareTabsPlaylistDialogOpen: true,
    playlistToShare: action.playlistId,
  });
};
const closeShareTabsPlaylistDialog = (state) => {
  return updateObject(state, {
    shareTabsPlaylistDialogOpen: false,
    playlistToShare: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAYLIST_BY_ID:
      return getPlaylistsById(state, action);
    case GET_PLAYLIST_DATA_UNREGISTERED:
      return getPlaylistDataUnregistered(state, action);
    case GET_ALL_PLAYLISTS:
      return getAllPlaylists(state, action);
    case OPEN_CREATE_NEW_PLAYLISTDIALOG:
      return setDialogOpen(state, action);
    case CLOSE_CREATE_NEW_PLAYLISTDIALOG:
      return setDiaglogClosed(state, action);
    case SET_CREATE_NEW_PLAYLIST_TYPE:
      return setPlaylistType(state, action);
    case GET_PLAYLISTDATA_SUCESS:
      return savePlaylistMetaData(state, action);
    case GET_PLAYLISTDATA_BY_ID_SUCCESS:
      return savePlaylistByIdData(state, action);
    case START_FETCHING_PLAYLIST_BY_ID_DATA:
      return setStartFetchingPlaylistByIdData(state, action);
    case START_FETCHING_PLAYLIST_META:
      return setStartFetchingPlaylistMetaData(state, action);
    case CREATE_NEW_PLAYLIST_WITH_TRACK_ID:
      return trackIDToAddToNewPlaylist(state, action);
    case PLAYLIST_DOES_NOT_EXIST:
      return setPlaylistDoesntExist(state, action);
    case OPEN_DELETE_PLAYLISTDIALOG:
      return openDeletePlaylistDialog(state, action);
    case CLOSE_DELETE_PLAYLISTDIALOG:
      return closeDeletePlaylistDialog(state, action);
    case OPEN_SHARETABS_PLAYLISTDIALOG:
      return openShareTabsPlaylistDialog(state, action);
    case CLOSE_SHARETABS_PLAYLISTDIALOG:
      return closeShareTabsPlaylistDialog(state, action);
    default:
      return state;
  }
};

export default reducer;
