import { useEffect, useRef, useState } from "react";

const useTTSSampleVoicePlayPause = () => {
  const audioCommonRef = useRef({});
  const [playingAudio, setPlayingAudio] = useState({
    mp3: "",
    id: "",
    isPlaying: false,
    isLoading: false,
  });

  useEffect(() => {
    setPlayingAudio({});
    return () => {
      setPlayingAudio({});
    };
  }, []);

  useEffect(() => {
    if (!playingAudio?.mp3) {
      audioCommonRef.current.pause();
      audioCommonRef.current.currentTime = 0;
      return;
    }
    playTrack(playingAudio?.mp3);
  }, [playingAudio?.id]);

  async function playTrack(mp3) {
    audioCommonRef.current.pause();
    audioCommonRef.current.currentTime = 0;
    audioCommonRef.current.src = mp3;
    setTimeout(() => {
      audioCommonRef.current.play().catch((err) => {
        console.log(err, "Audio play was prvented");
      });
    }, 120);
  }

  useEffect(() => {
    setPlayingAudio((prev) => ({
      ...prev,
      isPlaying: !audioCommonRef.current?.paused,
    }));
  }, [audioCommonRef.current?.paused]);

  const playPause = (trackMeta) => {
    const { title, trackImage, waveImage, mp3, id } = trackMeta;
    // console.log("mp3", mp3, playingAudio?.mp3);
    // console.log("id", id, playingAudio?.id);
    if (mp3 === playingAudio?.mp3 && id === playingAudio?.id) {
      if (audioCommonRef.current?.paused) {
        audioCommonRef.current.play();
        setPlayingAudio((prev) => ({
          ...prev,
          isPlaying: true,
        }));
      } else {
        audioCommonRef.current.pause();
        setPlayingAudio((prev) => ({
          ...prev,
          isPlaying: false,
        }));
      }
    } else {
      audioCommonRef.current.pause();
      setPlayingAudio({
        title,
        trackImage,
        waveImage,
        mp3,
        id,
        isPlaying: false,
        isLoading: true,
      });
    }
  };
  return { playingAudio, setPlayingAudio, audioCommonRef, playPause };
};
export default useTTSSampleVoicePlayPause;
