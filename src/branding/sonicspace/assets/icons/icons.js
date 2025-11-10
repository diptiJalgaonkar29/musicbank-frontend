import React from "react";
import { ReactComponent as SonicChatIcon } from "../../../../static/chat.svg";
import { ReactComponent as SonicSearchIcon } from "../../../../static/search.svg";
import { ReactComponent as SonicRightArrow } from "../../../../static/rightArrow.svg";
import { ReactComponent as SonicAddToPlaylistIcon } from "../../../../static/add-to-playlist.svg";
import { ReactComponent as SonicDownArrow } from "../../../../static/DownArrowUp.svg";
import { ReactComponent as SonicDownloadIcon } from "../../../../static/DownloadUp.svg";
// import { ReactComponent as SonicSimilaritySearchIcon } from "../../../../static/similarity-search.svg";
import { ReactComponent as SonicSimilaritySearchIcon } from "../../../../static/SonicSimilaritySearchIconnew.svg";
import { ReactComponent as SimilaritySearch } from "../../../../static/SimilaritySearch.svg";
import { ReactComponent as SonicPauseIcon } from "../../../../static/bordered-pause.svg";
import { ReactComponent as SonicPlayIcon } from "../../../../static/bordered-play.svg";
// import { ReactComponent as addToPlaylistIcon } from "../../../../static/arrow.svg";
// import { ReactComponent as addToPlaylistIcon } from "../../../../static/checkmark.svg";
import { ReactComponent as SonicCloseIcon } from "../../../../static/closeIcon.svg";
//import { ReactComponent as SonicDownloadIcon } from "../../../../static/download.svg";
import { ReactComponent as SonicDownload2Icon } from "../../../../static/download2.svg";
// import { ReactComponent as addToPlaylistIcon } from "../../../../static/downloadicon.svg";
import { ReactComponent as SonicEyeIcon } from "../../../../static/eye.svg";

import { ReactComponent as SonicHelp } from "../../../../static/help.svg";
import { ReactComponent as SonicProfile } from "../../../../static/profile.svg";
import { ReactComponent as SonicDownloadCart } from "../../../../static/downloadCart.svg";
import { ReactComponent as SonicMenuIcon } from "../../../../static/Menu_Icon.svg";
import { ReactComponent as SonicMusicLight } from "../../../../static/Music_light.svg";
import { ReactComponent as SonicAiIcon } from "../../../../static/Ai_Icon.svg";
import { ReactComponent as SonicAiIcon1 } from "../../../../static/Ai.svg";
import { ReactComponent as SonicCoinIcon } from "../../../../static/coin.svg";
import { ReactComponent as SonicSoundWaveIcon } from "../../../../static/soundWave.svg";
import { ReactComponent as BackIcon } from "../../../../static/Back.svg";
import { ReactComponent as AddProjectIcon } from "../../../../static/AddProject.svg";
import { ReactComponent as SonicVideo } from "../../../../static/video.svg";
import { ReactComponent as SonicMusicFile } from "../../../../static/music_files.svg";
import { ReactComponent as SonicSimilaritySearch } from "../../../../static/SonicSimilaritySearch.svg";
import { ReactComponent as uploadIcon } from "../../../../static/uploadIcon.svg";
import { ReactComponent as MusicIcon } from "../../../../static/MusicIcon.svg";
import { ReactComponent as SonicIconDataViewList } from "../../../../static/lineView.svg";
import { ReactComponent as SonicIconGrid } from "../../../../static/gridView.svg";

import { ReactComponent as AITrackIcon } from "../../../../static/AITrack.svg";
import { ReactComponent as BrandedTrackIcon } from "../../../../static/BrandedTrack.svg";
import { ReactComponent as LibraryTrackIcon } from "../../../../static/LibraryTrack.svg";
import { ReactComponent as OnDemandTrackIcon } from "../../../../static/OnDemandTrack.svg";
import { ReactComponent as AITrackIconSH2 } from "../../../../static/ai_track_icon.svg";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import Add from "@mui/icons-material/Add";
import { MdQueue } from "react-icons/md";
import { BsSuitHeartFill, BsSuitHeart } from "react-icons/bs";
import { BsShuffle } from "react-icons/bs";
import { TbArrowsShuffle2, TbRepeat, TbRepeatOff } from "react-icons/tb";
import {
  FaEye,
  FaEyeSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaCheck,
  FaPlay,
} from "react-icons/fa";
import {
  MdVolumeOff,
  MdVolumeUp,
  MdShuffle,
  MdSkipNext,
  MdSkipPrevious,
  MdOutlinePlaylistPlay,
  MdEdit,
  MdCheck,
} from "react-icons/md";

// const SonicUpArrowIcon = () => {
//   return <SonicRightArrow style={{ transform: "rotate(270deg)" }} />;
// };

const SonicUpArrowIcon = () => {
  return <SonicDownArrow style={{ transform: "rotate(180deg)" }} />;
};
const SonicDownArrowIcon = () => {
  return <SonicDownArrow />;
};

const SonicRightArrowIcon = () => {
  return <SonicDownArrow style={{ transform: "rotate(270deg)" }} />;
};

const SonicLeftArrowIcon = () => {
  return <SonicDownArrow style={{ transform: "rotate(90deg)" }} />;
};

export default {
  Chat: SonicChatIcon,
  Search: SonicSearchIcon,
  LeftArrow: SonicLeftArrowIcon,
  RightArrow: SonicRightArrowIcon,
  UpArrow: SonicUpArrowIcon,
  DownArrow: SonicDownArrowIcon,
  Add: Add,
  AddToPlaylist: SonicAddToPlaylistIcon,
  AddToQueue: MdQueue,
  SimilaritySearch: SonicSimilaritySearchIcon,
  SimilaritySearchSH2: SimilaritySearch,
  AITrackIconSH2: AITrackIconSH2,
  Close: SonicCloseIcon,
  Edit: MdEdit,
  Done: FaCheck,
  Cart: SonicChatIcon,
  Info: SonicChatIcon,
  Trash: DeleteOutlinedIcon,
  Share: ShareOutlinedIcon,
  Download: SonicDownloadIcon,
  Download2: SonicDownload2Icon,
  EyeOn: FaEye,
  EyeOff: FaEyeSlash,
  Upload: SonicChatIcon,
  Play: SonicPlayIcon,
  Pause: SonicPauseIcon,
  Next: MdSkipNext,
  Previous: MdSkipPrevious,
  RepeatOn: TbRepeat,
  RepeatOff: TbRepeatOff,
  ShuffleOn: TbArrowsShuffle2,
  ShuffleOff: TbArrowsShuffle2,
  VolumeOn: MdVolumeUp,
  VolumeOff: MdVolumeOff,
  FilePdf: SonicChatIcon,
  LikeOn: BsSuitHeartFill,
  LikeOff: BsSuitHeart,
  Logout: SonicChatIcon,
  Music: SonicChatIcon,
  PlaylistPlay: MdOutlinePlaylistPlay,
  DownloadCart: SonicDownloadCart,
  Help: SonicHelp,
  Profile: SonicProfile,
  videoPlay: FaPlay,
  MenuIcon: SonicMenuIcon,
  MusicLightIcon: SonicMusicLight,
  AiIcon: SonicAiIcon,
  AiIcon1: SonicAiIcon1,
  Coin: SonicCoinIcon,
  SoundWave: SonicSoundWaveIcon,
  Back: BackIcon,
  AddIcon: AddProjectIcon,
  Video: SonicVideo,
  AIMusic: SonicSimilaritySearch,
  MusicFile: SonicMusicFile,
  uploadIcon: uploadIcon,
  MusicIcon: MusicIcon,
  ListView: SonicIconDataViewList,
  GridView: SonicIconGrid,
  BrandedTrack: BrandedTrackIcon,
  AiTrack: AITrackIcon,
  LibraryTrack: LibraryTrackIcon,
  OnDemandTrack: OnDemandTrackIcon,
};
