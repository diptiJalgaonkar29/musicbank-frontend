import { useEffect, useRef, useState } from "react";

const useMusicPlayPause = () => {
  const audioCommonRef = useRef({});
  const [playingAudio, setPlayingAudio] = useState({
    mp3: "",
    id: "",
    isPlaying: false,
    isLoading: false,
  });
  const [playList, setPlayList] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [playListType, setPlayListType] = useState("");

  useEffect(() => {
    resetMusicPlayer();
    return () => {
      resetMusicPlayer();
    };
  }, []);

  const handleEnded = () => {
    console.log("Audio has ended");
    const video = document.querySelector("#ai_search_video video");
    if (video) {
      video?.pause();
      video.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!playingAudio?.id || !audioCommonRef.current) return;
    if (!playingAudio?.mp3) {
      audioCommonRef.current.pause();
      audioCommonRef.current.currentTime = 0;
      return;
    }
    playTrack(playingAudio?.mp3);

    audioCommonRef.current.addEventListener("ended", handleEnded);

    // Cleanup on unmount
    return () => {
      audioCommonRef?.current?.removeEventListener("ended", handleEnded);
    };
  }, [playingAudio?.id]);

  const resetMusicPlayer = () => {
    setPlayingAudio({});
    setPlayList([]);
    setPlayingIndex(0);
    setPlayListType("");
  };

  async function playTrack(mp3) {
    audioCommonRef.current.pause();
    audioCommonRef.current.currentTime = 0;
    audioCommonRef.current.src = mp3;
    setTimeout(() => {
      audioCommonRef.current
        .play()
        .then(() => {
          console.log("audio is playing");
          const video = document.querySelector("#ai_search_video video");
          if (video) {
            video?.pause();
            video.currentTime = 0;
            video?.play();
          }
        })
        .catch((err) => {
          console.log(err, "Audio play was prvented");
        });
    }, 120);
  }

  // useEffect(() => {
  //   setPlayingAudio((prev) => ({
  //     ...prev,
  //     isPlaying: !audioCommonRef.current?.paused,
  //   }));
  // }, [audioCommonRef.current?.paused]);

  const syncAudioAndVideo = (video) => {
    const audioCurrentTime = audioCommonRef.current?.currentTime;
    if (typeof audioCurrentTime === "number" && !isNaN(audioCurrentTime)) {
      video.currentTime = audioCurrentTime;
    }
  };

  const playPause = (trackMeta) => {
     console.log("trackMeta", trackMeta);
    const video = document.querySelector("#ai_search_video video");

    const { title, trackImage, waveImage, mp3, id, source_id } = trackMeta;
    if (mp3 === playingAudio?.mp3 && id === playingAudio?.id) {
      if (audioCommonRef.current?.paused) {
        audioCommonRef.current.play();
        if (video) {
          syncAudioAndVideo(video);
          video?.play();
        }
        setPlayingAudio((prev) => ({
          ...prev,
          isPlaying: true,
        }));
      } else {
        audioCommonRef.current.pause();
        if (video) {
          syncAudioAndVideo(video);
          video?.pause();
        }
        setPlayingAudio((prev) => ({
          ...prev,
          isPlaying: false,
        }));
      }
    } else {
      if (video) {
        video?.pause();
      }
      audioCommonRef.current.pause();
      setPlayingAudio((prev) => ({
        ...prev,
        title,
        trackImage,
        waveImage,
        mp3,
        id,
        isPlaying: false,
        source_id
      }));
    }
  };
  return {
    playingAudio,
    setPlayingAudio,
    audioCommonRef,
    playPause,
    playList,
    setPlayList,
    playingIndex,
    setPlayingIndex,
    playListType,
    setPlayListType,
    resetMusicPlayer,
  };
};
export default useMusicPlayPause;
