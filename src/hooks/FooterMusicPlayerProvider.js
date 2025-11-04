import React from "react";
import useMusicPlayPause from "./useMusicPlayPause";
import { FooterMusicPlayerContext } from "./FooterMusicPlayerContext";

const FooterMusicPlayerProvider = ({ children }) => {
  const {
    audioCommonRef,
    playingAudio,
    setPlayingAudio,
    playPause,
    playList,
    setPlayList,
    playingIndex,
    setPlayingIndex,
    playListType,
    setPlayListType,
    resetMusicPlayer,
  } = useMusicPlayPause();
  return (
    <FooterMusicPlayerContext.Provider
      value={{
        audioCommonRef,
        playingAudio,
        setPlayingAudio,
        playPause,
        playList,
        setPlayList,
        playingIndex,
        setPlayingIndex,
        playListType,
        setPlayListType,
        resetMusicPlayer,
      }}
    >
      {children}
    </FooterMusicPlayerContext.Provider>
  );
};

export default FooterMusicPlayerProvider;
