import { combineReducers } from "redux";

import playerReducer, { isFooterMusicPlayerPlaying } from "./player";
import authentication from "../../authentication/reducers/AuthenticationReducer";
import recoverPassword from "../../authentication/reducers/RecoverPasswordReducer";
import searchReducer, { favTracksIds } from "./search";
import layoutReducer from "./layout";
import playlistReducer from "./playList";
import playlistMemberReducer from "./playListMember";
import notifications from "./notifications";
import notificationTopBar from "./notificationTopBar";
import playListComments from "./playListComments";
import recentlyAdded from "../../browse/reducers/RecentlyAddedTracksReducer";
import curatedPlaylists from "../../browse/reducers/CuratedPlaylistsReducer";
import popular from "../../browse/reducers/PopularTracksReducer";
import jobHistoryData, {
  jobHistoryProccessedData,
  isgetJobHistoryStatusLooped,
  getTTSVoices,
} from "./jobHistoryData";
import downloadBasket from "./tracksDownload";
import taxonomy from "./taxonomy";
import isReportModalOpen from "./reportModal";
import commonMessageModalMeta from "./commonMessageModal";
import trackFilters from "./trackFilters";
import configJson from "./configJson";
import userMeta from "./userMeta";
import VideoUploadReducer from "../reducers/videoUploadReducer";
import AIMusicReducer from "../reducers/aiMusicReducer";
import customTrackFormReducer from "./customTrackFormReducer";
import trackReducer from "./trackReducer";
import predictReducer from "./predictReducer";

const rootReducer = combineReducers({
  player: playerReducer,
  authentication,
  recoverPassword,
  search: searchReducer,
  layout: layoutReducer,
  playlist: playlistReducer,
  playlistMember: playlistMemberReducer,
  notifications,
  notificationTopBar,
  playListComments,
  recentlyAdded,
  curatedPlaylists,
  popular,
  jobHistoryStatus: jobHistoryData,
  jobHistoryProccessedData,
  isgetJobHistoryStatusLooped,
  getTTSVoices,
  downloadBasket,
  taxonomy,
  favTracksIds,
  isFooterMusicPlayerPlaying: isFooterMusicPlayerPlaying,
  isReportModalOpen,
  commonMessageModalMeta,
  configJson,
  trackFilters,
  userMeta,
  videoUpload: VideoUploadReducer,
  aiMusicGenerator: AIMusicReducer,
  customTrackForm: customTrackFormReducer,
  trackData: trackReducer,
  predict: predictReducer,
});

export default rootReducer;
