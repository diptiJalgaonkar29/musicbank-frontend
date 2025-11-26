import React, { useState, useRef, useEffect, useContext } from "react";
import "./Music-Player.css";
import MediaService from "../../services/MediaService";
import AddItemToPlaylistMenu from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenuV2";
import { useDispatch, useSelector } from "react-redux";
import { setIsFooterMusicPlayerPlaying } from "../../../redux/actions/playerActions";
import { FormattedTime } from "react-player-controls";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import SliderInputWrapper from "../../../branding/componentWrapper/SliderInputWrapper";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import { SpinnerDefault } from "../Spinner/Spinner";
import { isAuthenticated } from "../../utils/getUserAuthMeta";
import WaveSurferImage from "../../../AISearchScreen/Components/GetWaveForm/WaveSurferImage";
import getMediaBucketPath from "../../utils/getMediaBucketPath";

const MusicPlayer = ({ timeJump }) => {
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLooped, setIsLooped] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const { userAuthorization } = useSelector((state) => state.authentication);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);

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
    resetMusicPlayer,
  } = useContext(FooterMusicPlayerContext);
  //console.log("MusicPlayer - playList", playList);
  const [newProgressValue, setNewProgressValue] = useState(0);
  // const [waveImage, setWaveImage] = useState(null);

  const progressBar = useRef();
  const progressBarDiv = useRef();
  const animationRef = useRef();

  const dispatch = useDispatch();

  // console.log("Music-Player -getMediaBucketPath",playingAudio?.waveImage,playingAudio?.media_provider_id);

  //const waveFormJSImage = getMediaBucketPath(`${playingAudio?.waveImage}`, playingAudio?.media_provider_id, 'waveform') + `?id=${playingAudio.id}`
  const waveFormJSImage = getMediaBucketPath(
    `${playingAudio?.waveImage}`,
    playingAudio?.source_id,
    "waveform"
  );
  //console.log("playPause?.source_id", playingAudio);
  useEffect(() => {
    if (timeJump) {
      timeTravel(timeJump);
      play();
    } else {
      timeTravel(0);
    }
  }, [timeJump]);

  useEffect(() => {
    // changePlayerCurrentTime();
    if (isMuted === false) {
      changeVolume();
    }
    let progressValue = (currentTime / duration) * 100;
    if (!isNaN(progressValue) && isFinite(progressValue)) {
      setNewProgressValue((currentTime / duration) * 100);
    }
  }, [currentTime]);

  const syncAudioAndVideo = (video) => {
    const audioCurrentTime = audioCommonRef.current?.currentTime;
    if (typeof audioCurrentTime === "number" && !isNaN(audioCurrentTime)) {
      video.currentTime = audioCurrentTime;
    }
  };

  const play = () => {
    const playPromise = audioCommonRef.current.play();
    const video = document.querySelector("#ai_search_video video");

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (video) {
            syncAudioAndVideo(video);
            video?.play();
          }
          console.log("playing audio.");
        })
        .catch(() => {
          if (video) {
            syncAudioAndVideo(video);
            video?.pause();
          }
          console.log("Error playing audio.");
        });
    }
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const togglePlayPause = () => {
    console.log("This is the footer toggle play, pause");
    const prevValue = playingAudio?.isPlaying;
    if (!prevValue) {
      play();
      dispatch(setIsFooterMusicPlayerPlaying(true));
    } else {
      audioCommonRef.current.pause();
      const video = document.querySelector("#ai_search_video video");
      if (video) {
        syncAudioAndVideo(video);
        video?.pause();
      }
      dispatch(setIsFooterMusicPlayerPlaying(false));
      cancelAnimationFrame(animationRef?.current);
    }
  };

  const toggleVolume = () => {
    const prevValue = isMuted;
    setIsMuted(!prevValue);
    if (!prevValue) {
      audioCommonRef.current.volume = 0;
    } else {
      changeVolume();
    }
  };

  const toggleShuffle = () => {
    const prevValue = isShuffled;
    setIsShuffled(!prevValue);
  };

  const toggleLoop = () => {
    const prevValue = isLooped;
    setIsLooped(!prevValue);
  };

  const whilePlaying = () => {
    if (audioCommonRef?.current?.currentTime) {
      progressBar.current.value = audioCommonRef?.current?.currentTime;
    }
    // changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    if (progressBar?.current?.value) {
      audioCommonRef.current.currentTime = progressBar?.current?.value;
    } else {
      audioCommonRef.current.currentTime = 0;
    }
    // changePlayerCurrentTime();
  };

  // const changePlayerCurrentTime = () => {
  //   setCurrentTime(progressBar?.current?.value);
  // };

  const timeTravel = (newTime) => {
    if (!progressBar.current) return;

    progressBar.current.value = newTime;
    changeRange();
  };

  const changeVolume = () => {
    audioCommonRef.current.volume = volume / 100;
    setIsMuted(false);
  };

  const randomNumber = (prev, min, max) => {
    var randInt = Math.floor(Math.random() * (max - min) + min);
    if (prev === randInt) {
      if (randInt === playList.length - 1) {
        randInt = randInt - 1;
      } else {
        randInt = randInt + 1;
      }
    }
    return randInt;
  };

  // useEffect(() => {
  //   if (playList.length > 0 && playingAudio?.mp3) {
  //     MediaService.getWaveform(playingAudio?.mp3)
  //       .then((waveImageBlob) => {
  //         // console.log('waveImageBlob', waveImageBlob)
  //         setWaveImage(waveImageBlob);
  //         setPlayingAudio((prev) => ({
  //           ...prev,
  //           waveImage: waveImageBlob,
  //         }));
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching waveform image:", error);
  //       });
  //   }
  // }, [playingAudio?.mp3]);

  const loadTrack = async (playIndex) => {
    setPlayingAudio((prev) => ({
      ...prev,
      isLoading: true,
    }));
    let trackToBePlayed = playList?.[playIndex];
    const mCode =
      location?.hash?.split("/")?.[location?.hash?.split("/")?.length - 1];
    let trackmp3Blob = await MediaService.getMp3(
      trackToBePlayed?.mp3
      // mCode
    );
    let trackImageBlob = ""; //await MediaService.getImage(
    //   trackToBePlayed?.img
    //   // mCode
    // );
    let trackWaveImageBlob = await MediaService.getWaveform(
      trackToBePlayed?.mp3
      // mCode
    );
    setPlayingAudio((prev) => ({
      ...prev,
      isLoading: false,
    }));

    playPause({
      mp3: trackmp3Blob,
      title: trackToBePlayed?.title,
      waveImage: trackWaveImageBlob,
      trackImage: trackImageBlob,
      id: +trackToBePlayed?.id,
    });
    if (playListType === "queue") {
      setPlayingIndex(0);
    } else {
      setPlayingIndex(playIndex);
    }
  };

  const previousTrack = () => {
    if (isLooped === true) {
      if (Math.sign(playingIndex) === 1) {
        if (isShuffled === true) {
          loadTrack(randomNumber(playingIndex, 0, playList?.length));
        } else {
          loadTrack(playingIndex - 1);
        }
      } else {
        if (isShuffled === true) {
          loadTrack(randomNumber(playingIndex, 0, playList?.length));
        } else {
          loadTrack(playList?.length - 1);
        }
      }
    } else {
      if (Math.sign(playingIndex) === 1) {
        if (isShuffled === true) {
          loadTrack(randomNumber(playingIndex, 0, playList.length));
        } else {
          loadTrack(playingIndex - 1);
        }
      }
    }
  };

  const nextTrack = () => {
    if (playListType === "queue") {
      if (playList?.length > 1) {
        let playlistTracks = [...(playList || [])];
        let newPlaylist = playlistTracks.splice(playingIndex + 1);
        setPlayList(newPlaylist);
      }

      if (isLooped === true) {
        if (playingIndex + 1 <= playList.length - 1) {
          if (isShuffled === true) {
            loadTrack(randomNumber(playingIndex + 1, 0, playList.length));
          } else {
            loadTrack(playingIndex + 1);
          }
        } else {
          if (isShuffled === true) {
            loadTrack(randomNumber(playingIndex + 1, 0, playList.length));
          } else {
            loadTrack(0);
          }
        }
      } else {
        if (playingIndex + 1 <= playList.length - 1) {
          if (isShuffled === true) {
            loadTrack(randomNumber(playingIndex + 1, 0, playList.length));
          } else {
            loadTrack(playingIndex + 1);
          }
        } else {
          if (isShuffled === true) {
            loadTrack(randomNumber(playingIndex + 1, 0, playList.length));
          }
        }
      }
    } else {
      if (isLooped === true) {
        if (playingIndex + 1 <= playList.length - 1) {
          if (isShuffled === true) {
            var shuffledIndex = randomNumber(playingIndex, 0, playList.length);
            loadTrack(shuffledIndex);
          } else {
            loadTrack(playingIndex + 1);
          }
        } else {
          if (isShuffled === true) {
            shuffledIndex = randomNumber(playingIndex, 0, playList.length);
            loadTrack(shuffledIndex);
          } else {
            loadTrack(0);
          }
        }
      } else {
        if (playingIndex + 1 <= playList.length - 1) {
          if (isShuffled === true) {
            shuffledIndex = randomNumber(playingIndex, 0, playList.length);
            loadTrack(shuffledIndex);
          } else {
            loadTrack(playingIndex + 1);
          }
        } else {
          if (isShuffled === true) {
            shuffledIndex = randomNumber(playingIndex, 0, playList.length);
            loadTrack(shuffledIndex);
          }
        }
      }
    }
  };

  const HideShowPlaylist = () => {
    // document.getElementById("playlistContainer").classList.toggle("playlist");
    setIsPlaylistVisible((prev) => !prev);
  };

  const HideMusicPlayer = () => {
    audioCommonRef.current && audioCommonRef.current.pause();
    // setPlayingAudio({});
    // setPlayingIndex(0);
    // setPlayList([]);
    // setPlayListType("");
    dispatch(setIsFooterMusicPlayerPlaying(false));
    setIsPlaylistVisible(false);
    resetMusicPlayer();
    const video = document.querySelector("#ai_search_video video");
    if (video) {
      video?.pause();
      video.currentTime = 0;
    }
  };

  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (isEnded) {
      setPlayingAudio((prev) => ({
        ...prev,
        isPlaying: false,
      }));
      if (playListType === "queue") {
        if (playingIndex + 1 <= playList?.length - 1) {
          loadTrack(playingIndex + 1);
        } else {
          loadTrack(0);
        }
        if (playList?.length > 1) {
          let newPlaylist = playList.splice(playingIndex + 1);
          setPlayList(newPlaylist);
        }
        setIsEnded(false);
        return;
      }
      if (currentTime !== 0) {
        togglePlayPause();
        audioCommonRef.current.pause();
        if (
          (playList?.length <= 1 || playingIndex + 1 === playList?.length) &&
          isLooped === false
        ) {
          timeTravel(0);
          dispatch(setIsFooterMusicPlayerPlaying(false));
        }

        if (isLooped === true) {
          if (playingIndex + 1 <= playList?.length - 1) {
            loadTrack(playingIndex + 1);
          } else {
            loadTrack(0);
          }
        } else if (playingIndex + 1 < playList?.length) {
          loadTrack(playingIndex + 1);
        }
      }
      setIsEnded(false);
    }
  }, [isEnded]);

  return (
    <div
      className={`musicPlayerContainer ${
        playingAudio?.isLoading ? "loading" : ""
      } ${playingAudio?.mp3 ? "trackAvailable" : "trackNotAvailable"}`}
      key={playingAudio?.id}
    >
      {playingAudio?.isLoading && (
        <div className="audioPlayer_loader">
          <SpinnerDefault />
        </div>
      )}
      <div className="audioPlayer">
        <div className="musicPlayerContainer_audio_container">
          <audio
            id="music-player-track"
            onError={() => {
              setPlayingAudio((prev) => ({
                ...prev,
                isLoading: false,
              }));
            }}
            controlsList="nodownload noplaybackrate"
            ref={audioCommonRef}
            controls
            onTimeUpdate={(e) => {
              setCurrentTime(e.target?.currentTime);
            }}
            onLoadedMetadata={(e) => {
              setPlayingAudio((prev) => ({
                ...prev,
                isLoading: false,
              }));
              if (isNaN(e.target?.duration)) return;
              const seconds = Math.floor(e.target?.duration);
              setDuration(seconds);
              progressBar.current.max = seconds;
            }}
            onEnded={() => {
              setIsEnded(true);
            }}
            onPlay={() => {
              setPlayingAudio((prev) => ({
                ...prev,
                isPlaying: true,
              }));
            }}
            onPause={() => {
              setPlayingAudio((prev) => ({
                ...prev,
                isPlaying: false,
              }));
            }}
          />
        </div>
        <div className="trackInfo">
          <img
            id="music-player-image"
            className="trackImage"
            alt="trackImage"
            src={playingAudio?.trackImage}
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = `${document.location.origin}/brandassets/common/images/default_cover.png`;
            }}
          />
          {/* <ToolTipWrapper title={playingAudio?.title}> */}
          <p className="trackTitle" id="music-player-title">
            {playingAudio?.title}
          </p>
          {/* </ToolTipWrapper> */}
        </div>
        <div className="musicControls">
          <div style={{ position: "relative" }}>
            {/* <ToolTipWrapper title={"Shuffle"}> */}
            <IconButtonWrapper
              className={isShuffled ? "shuffleActive" : "shuffleDeactive"}
              icon={isShuffled ? "ShuffleOn" : "ShuffleOff"}
              onClick={toggleShuffle}
              disabled={playList?.length === 1 || playListType === "queue"}
            />
            {/* </ToolTipWrapper> */}
          </div>
          {/* <ToolTipWrapper title={"Previous"}> */}
          <IconButtonWrapper
            disabled={playingIndex === 0 && !isLooped}
            icon={"Previous"}
            onClick={previousTrack}
          />
          {/* </ToolTipWrapper> */}
          {/* <ToolTipWrapper
            title={!audioCommonRef?.current?.paused ? "Pause" : "Play"}
          > */}
          <IconButtonWrapper
            icon={!audioCommonRef?.current?.paused ? "Pause" : "Play"}
            onClick={togglePlayPause}
          />
          {/* </ToolTipWrapper> */}
          {/* <ToolTipWrapper title={"Next"}> */}
          <IconButtonWrapper
            disabled={playingIndex === playList?.length - 1 && !isLooped}
            icon={"Next"}
            onClick={nextTrack}
          />
          {/* </ToolTipWrapper> */}
          {/* <ToolTipWrapper title={"Loop"}> */}
          <IconButtonWrapper
            icon={isLooped ? "RepeatOn" : "RepeatOff"}
            className={isLooped ? "loopActive" : "loopDeactive"}
            onClick={toggleLoop}
            disabled={playList?.length === 1 || playListType === "queue"}
          />
          {/* </ToolTipWrapper> */}
        </div>
        <div className="progressBarContainer">
          <div className="currentTime">
            <FormattedTime
              numSeconds={!Number(currentTime) ? 0 : Number(currentTime)}
            />
            &emsp;
          </div>
          {/* progress bar */}
          <div className="progressBarWrapper" id="waveImageProgressBar">
            <input
              type="range"
              className="progressBarHide"
              defaultValue="0"
              ref={progressBar}
              onChange={changeRange}
            />

            <div
              className="progress_div"
              id="progress_div"
              ref={progressBarDiv}
            >
              <input
                type="range"
                className="progressBarNew"
                step="any"
                value={newProgressValue}
                onChange={(e) => {
                  let clickPercent = e.target.value;
                  let seekTimeMove = (clickPercent * duration) / 100;
                  setNewProgressValue(clickPercent);
                  audioCommonRef.current.currentTime =
                    +seekTimeMove?.toFixed(3);
                  progressBar.current.value = +seekTimeMove?.toFixed(3);
                  setCurrentTime(seekTimeMove);
                  const video = document.querySelector(
                    "#ai_search_video video"
                  );
                  if (video) {
                    video.currentTime = seekTimeMove;

                    // Resume video only if within video duration and audio is playing
                    if (
                      seekTimeMove < video.duration &&
                      video.paused &&
                      !audioCommonRef?.current?.paused
                    ) {
                      video
                        .play()
                        .catch((err) => console.warn("Video play error", err));
                    }
                  }
                }}
              />
              {/* <img
                id="music-player-wave-image"
                className="waveImage"
                alt="waveImage"
                src={playingAudio?.waveImage || waveImage}
              /> */}
              {/* {alert(playingAudio?.waveImage)} */}
              {
                //playingAudio?.isPlaying && (
                <WaveSurferImage
                  key={playingAudio.id}
                  waveformScriptUrl={waveFormJSImage}
                  //waveformScriptUrl={`${process.env.REACT_APP_STORAGE_BASEPATH}strotswar-images-storage/${playingAudio?.waveImage}?id=${playingAudio.id}`}
                  fallbackScriptUrl={`${document.location.origin}/brandassets/common/js/57508207-2.js?id=${playingAudio.id}`}
                  duration={20}
                  uuid={playingAudio.id}
                  flag={"later called"}
                />
                // )
              }
              {/* {console.log("playPause", playPause)} */}
              <div className="trackSeekIndicator" id="trackSeekIndicator"></div>
            </div>
          </div>
          {/* wave progress bar */}
          <div className="duration" id="duration">
            &emsp;
            {duration && !isNaN(duration) ? (
              <FormattedTime
                numSeconds={!Number(duration) ? 0 : Number(duration)}
              />
            ) : (
              <div>&emsp;&emsp;&emsp;&nbsp;</div>
            )}
          </div>
        </div>
        {/* {playList && playList?.length !== 0 && ((!!userAuthorization?.result?.token &&
        !userAuthorization?.result?.isExpired?.()) || (!!userAuthorization?.token &&
        !userAuthorization?.isExpired?.()))  ? (
          <div className="addToPlaylist" id="music-player-addToPlaylist">
            <AddItemToPlaylistMenu
              stClass="addToPlaylist_footerMusicPlayer"
              trackCardIdProp={playList[playingIndex]?.id} //change_20_12_21
              trackCardNameProp={playList[playingIndex]?.title}
            />
          </div>
        ) : null} */}

        {/* volume container */}
        <div className="volumeSlider">
          {/* <ToolTipWrapper title={"Mute"}> */}
          <IconButtonWrapper
            icon={
              isMuted || audioCommonRef?.current?.volume === 0
                ? "VolumeOff"
                : "VolumeOn"
            }
            onClick={toggleVolume}
          />
          {/* </ToolTipWrapper> */}
          &emsp;
          <div className="volume_slider_input_container">
            {/* <ToolTipWrapper title={"Volume"}> */}
            <SliderInputWrapper
              min={0}
              max={100}
              value={volume}
              onChange={(vol) => setVolume(vol)}
            />
            {/* </ToolTipWrapper> */}
          </div>
        </div>
        <div>
          <div className="buttonContainer" id="buttonContainer">
            {isAuthenticated() ? (
              <div className="addToPlaylist" id="music-player-addToPlaylist">
                <AddItemToPlaylistMenu
                  stClass="addToPlaylist_footerMusicPlayer"
                  trackCardIdProp={playList[playingIndex]?.id} //change_20_12_21
                  trackdetails_objectID={
                    playList[playingIndex]?.trackdetails_objectID
                  }
                  trackCardNameProp={playList[playingIndex]?.title}
                />
              </div>
            ) : null}
            {/* <ToolTipWrapper title={"Playlist"}> */}
            <IconButtonWrapper
              icon={"PlaylistPlay"}
              onClick={HideShowPlaylist}
            />
            {/* </ToolTipWrapper> */}
            {/* <ToolTipWrapper title={"Close"}> */}
            <IconButtonWrapper
              icon={"Close"}
              onClick={HideMusicPlayer}
              id="closeFooterMusicPlayer"
            />
            {/* </ToolTipWrapper> */}
          </div>
        </div>
      </div>

      {isPlaylistVisible && (
        <div id="playlistContainer" className="playlist">
          {playList == null
            ? null
            : playList.map((track, index) => (
                <div
                  className="tracks"
                  key={index}
                  onClick={() => {
                    if (+index === +playingIndex) {
                      return;
                    }
                    if (playListType === "queue") {
                      if (playList?.length > 1) {
                        let playlistTracks = [...(playList || [])];
                        let newPlaylist = playlistTracks.splice(index);
                        setPlayList(newPlaylist);
                      }
                    }
                    loadTrack(index);
                  }}
                >
                  <div
                    style={{
                      color:
                        +track.id !== +playingAudio?.id
                          ? "var(--color-white)"
                          : "var(--color-primary)",
                    }}
                    id={"playlistPanelTitle_" + index}
                    className="playlistPanelTracks"
                    title={track.title}
                  >
                    {+track.id !== +playingAudio?.id ||
                    !playingAudio?.isPlaying ? (
                      <IconButtonWrapper
                        className="playlistPanelPlayPauseIcon"
                        icon="Play"
                      />
                    ) : (
                      <IconButtonWrapper icon="Pause" />
                    )}
                    <p className="playlistPanelTrackTitle">{track.title}</p>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
