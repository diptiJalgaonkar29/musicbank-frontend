import React from "react";
import {
  WppIconAdd,
  WppIconEdit,
  WppIconSearch,
  WppIconClose,
  WppIconCart,
  WppIconChatMessage,
  WppIconInfo,
  WppIconChevron,
  WppIconDownload,
  WppIconDone,
  WppIconEyeOn,
  WppIconEyeOff,
  WppIconLikeOn,
  WppIconLikeOff,
  WppIconTrash,
  WppIconShare,
  WppIconUpload,
  WppIconPlay,
  WppIconPause,
  WppIconNext,
  WppIconPrevious,
  WppIconRepeatOn,
  WppIconSpeaker,
  WppIconFilePdf,
  WppIconLogout,
  WppIconMusic,
  WppIconRepeatOff,
  WppIconSpeakerOff,
  WppIconWrapOn,
  WppIconWrapOff,
  WppIconHelp,
  WppIconUser,
} from "@wppopen/components-library-react";
import { MdQueue } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { ReactComponent as SonicMenuIcon } from "../../../../static/Menu_Icon.svg";
import { ReactComponent as SonicMusicLight } from "../../../../static/Music_light.svg";
import { ReactComponent as SonicAiIcon } from "../../../../static/Ai_Icon.svg";
import { ReactComponent as SonicSoundWaveIcon } from "../../../../static/soundWave.svg";
import { ReactComponent as BackIcon } from "../../../../static/Back.svg";
import { ReactComponent as AddProjectIcon } from "../../../../static/AddProject.svg";
import { ReactComponent as AITrackIcon } from "../../../../static/AITrack.svg";
import { ReactComponent as AITrackIconWPP } from "../../../../static/ai_track_icon_wpp.svg";
import { ReactComponent as BrandedTrackIcon } from "../../../../static/BrandedTrack.svg";
import { ReactComponent as LibraryTrackIcon } from "../../../../static/LibraryTrack.svg";
import { ReactComponent as OnDemandTrackIcon } from "../../../../static/OnDemandTrack.svg";
import { ReactComponent as SimilaritySearch } from "../../../../static/SimilaritySearch.svg";
import { ReactComponent as SonicPauseIcon } from "../../../../static/bordered-pause.svg";
import { ReactComponent as SonicPlayIcon } from "../../../../static/bordered-play.svg";
const WPPUpArrowIcon = () => {
  return <WppIconChevron direction="up"></WppIconChevron>;
};

const WPPDownArrowIcon = () => {
  return <WppIconChevron direction="down"></WppIconChevron>;
};

const WPPRightArrowIcon = () => {
  return <WppIconChevron direction="right"></WppIconChevron>;
};

const WPPLeftArrowIcon = () => {
  return <WppIconChevron direction="left"></WppIconChevron>;
};

export default {
  Chat: WppIconChatMessage,
  Search: WppIconSearch,
  LeftArrow: WPPLeftArrowIcon,
  RightArrow: WPPRightArrowIcon,
  UpArrow: WPPUpArrowIcon,
  DownArrow: WPPDownArrowIcon,
  Add: WppIconAdd,
  AddToPlaylist: WppIconAdd,
  AddToQueue: MdQueue,
  SimilaritySearch: WppIconMusic,
  SimilaritySearchSH2: WppIconMusic,
  AITrackIconSH2: AITrackIconWPP,
  Close: WppIconClose,
  Edit: WppIconEdit,
  Done: WppIconDone,
  Cart: WppIconCart,
  Info: WppIconInfo,
  Trash: WppIconTrash,
  Share: WppIconShare,
  Download: WppIconDownload,
  Download2: WppIconDownload,
  EyeOn: WppIconEyeOn,
  EyeOff: WppIconEyeOff,
  Upload: WppIconUpload,
  Play: WppIconPlay,
  Pause: WppIconPause,
  // Play: SonicPlayIcon,
  // Pause: SonicPauseIcon,
  Next: WppIconNext,
  Previous: WppIconPrevious,
  RepeatOn: WppIconRepeatOn,
  RepeatOff: WppIconRepeatOff,
  ShuffleOn: WppIconWrapOn,
  ShuffleOff: WppIconWrapOff,
  VolumeOn: WppIconSpeaker,
  VolumeOff: WppIconSpeakerOff,
  FilePdf: WppIconFilePdf,
  LikeOn: WppIconLikeOn,
  LikeOff: WppIconLikeOff,
  Logout: WppIconLogout,
  Music: WppIconMusic,
  PlaylistPlay: WppIconMusic,
  DownloadCart: WppIconDownload,
  Help: WppIconHelp,
  Profile: WppIconUser,
  videoPlay: FaPlay,
  MenuIcon: SonicMenuIcon,
  MusicLightIcon: SonicMusicLight,
  AiIcon: SonicAiIcon,
  SoundWave: SonicSoundWaveIcon,
  Back: BackIcon,
  AddIcon: AddProjectIcon,
  BrandedTrack: BrandedTrackIcon,
  AiTrack: AITrackIcon,
  LibraryTrack: LibraryTrackIcon,
  OnDemandTrack: OnDemandTrackIcon,
  MusicIcon: WppIconMusic,
};
