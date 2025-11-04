import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "./TrackCardV3AudioPlayer.css";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import { PseudoParentV2, TimeLineComponentV2 } from "../TimeLineComponentV2";
import MediaService from "../../../services/MediaService";
import { SpinnerDefault } from "../../Spinner/Spinner";
import WaveSurferForm from "../../../../AISearchScreen/Components/GetWaveForm/WaveSurferForm";
import getMediaBucketPath from "../../../utils/getMediaBucketPath";
import TrackWaveform from './TrackWavform';

export default function TrackCardV3AudioPlayer(props) {
  //console.log("TrackCardV3AudioPlayer -", props.wavefile, props.source_id, props.id, props.wave_form_js);
  let dispatch = useDispatch();
  const { index, type, songUrl } = props;
  const music = useRef(null);
  const timeline = useRef(null);
  const pButton = useRef(null);
  const playhead = useRef(null);
  const pseudoParent = useRef(null);
  const PlayPauseButton = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [playPercent, setPlayPercent] = useState(null);
  const [timelineWidth, setTimelineWidth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadedTrackData, setLoadedTrackData] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekingTime, setSeekingTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const [finished, setFinished] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [playFromPicture, setPlayFromPicture] = useState(false);
  const [previewTrackData, setPreviewTrackData] = useState(null);
  const [trackImage, setTrackImage] = useState(null);
  const [playClicked, setPlayClicked] = useState(false);
  const [waveformJS, setWaveformJS] = useState(null);
  const [trackWaveformData, setTrackWaveformData] = useState(null);
  // console.log("TrackCardV3AudioPlayer - Rendered", props.id);
  //const waveformScriptUrl = process.env.REACT_APP_STORAGE_BASEPATH+"strotswar-images-storage/" + `${props.wavefile}?id=${props.id}`;
  const waveformScriptUrl =
    getMediaBucketPath(`${props.wavefile}`, props.source_id, "waveform") +
    `?id=${props.id}`;
  //const waveformScriptUrl = props.wavefile;

  function isValidURL(url) {
    try {
      new URL(url); // will throw if invalid
      return true;
    } catch (_) {
      return false;
    }
  }

  useEffect(() => {
    setPlaying(false);
    setPlayPercent(null);
    setTimelineWidth(null);
    setLoading(false);
    setLoadedTrackData(false);
    setCurrentTime(0);
    setSeekingTime(0);
    setDuration(null);
    setFinished(false);
    setSeeking(false);
    setPlayFromPicture(false);
    setPreviewTrackData(null);
    setTrackImage(null);
    setWaveformJS(null);
  }, []); // Run once on mount

  useEffect(() => {
    if (props.track_length !== duration) {
      setDuration(props.track_length);
    }
  }, [props.track_length]);

  //get track waveform data -RnD
  /* useEffect(() => {
    if (!waveformScriptUrl) return;

    let script;
    const handleWaveformCallback = (id, data) => {
      // You can check ID if needed
      setTrackWaveformData(data);
    };

    // Attach global callback before script loads
    window.wfcb = handleWaveformCallback;

    // Create and append <script>
    script = document.createElement("script");
    script.src = waveformScriptUrl;
    script.async = true;
    script.onload = () => console.log(`Loaded waveform for ${props.source_id}`);
    script.onerror = () => console.log("Failed to load waveform script");
    document.body.appendChild(script);

    // Cleanup
    return () => {
      delete window.wfcb;
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [waveformScriptUrl]); */


  const handleClick = () => {
    setPlayClicked(true);
  };

  const playCustomFooterMusicPlayer = () => {
    //  MediaService.getImage(props.srcUrl).then((imgData) => {
    setTrackImage(props.srcUrl);
    setWaveformJS(
      getMediaBucketPath(props.wave_form_js, props.source_id, "waveform")
    );
    props.playPause({
      mp3: previewTrackData,
      title: props.trackCardNameProp,
      waveImage: props.waveformDataProp,
      trackImage: props.srcUrl,
      id: props.index,
    });
    // });

    props.setPlayList([
      {
        id: props.index,
        title: props.trackCardNameProp,
        img: props.srcUrl,
        mp3: props.songUrl,
      },
    ]);

    props.setPlayingIndex(0);
    props.setPlayListType("singleTrack");
  };

  const loadData = (index, config) => {
    if (config.modules.showFooterMusicPlayer) {
      if (playing || loadedTrackData) {
        props.playPause({
          mp3: previewTrackData,
          title: props.trackCardNameProp,
          waveImage: props.waveformDataProp,
          trackImage: trackImage,
          id: props.index,
        });
        music.current?.pause();
        return;
      }
    } else {
      props.setPlayingAudio({});
      if (playing || loadedTrackData) {
        play(index); // Make sure `play()` is defined
        return;
      }
    }

    setLoading(true);
    props.setPlayingAudio((prev) => ({ ...prev, isLoading: true }));

    const fetchAndPlay = (getMp3Fn) => {
      getMp3Fn()
        .then((data) => {
          setPreviewTrackData(data);
        })
        .then(() => {
          startEventListener(); // Make sure `startEventListener()` is defined
        })
        .then(() => {
          if (
            config.modules.showFooterMusicPlayer &&
            props.playingFooterMusicPlayer !== false
          ) {
            playCustomFooterMusicPlayer(index);
          } else {
            play(index); // Make sure `play()` is defined
          }
          props.setPlayingAudio((prev) => ({
            ...prev,
            isLoading: false,
          }));
          setLoading(false);
          setLoadedTrackData(true);
        })
        .catch((err) =>
          console.error(err, "something went wrong fetching the Music Data")
        );
    };

    if (props.isUnRegistered) {
      fetchAndPlay(() =>
        MediaService.getMp3Unregistered(props.songUrl, props.mCode)
      );
    } else {
      fetchAndPlay(() => MediaService.getMp3(props.songUrl));
    }
  };

  const loadDataOnMobile = (index) => {
    const elementId = `audioElement${Date.now()}`;
    const audioElement = document.createElement("audio");
    audioElement.setAttribute("id", elementId);
    document.body.appendChild(audioElement);

    if (playing || loadedTrackData) {
      play(index);
      return;
    }

    setLoading(true);
    MediaService.getMp3(props.songUrl)
      .then((data) => {
        audioElement.src = data;
        music.current = audioElement;
        setPreviewTrackData(data);
      })
      .then(() => {
        startEventListener();
        play(index);
        setLoading(false);
        setLoadedTrackData(true);
      })
      .catch((err) => console.error(err, "Error fetching music data"));
  };

  const play = (index) => {
    const audio = music.current;
    props.setPlayingIndex(index);
    if (!audio) return;

    if (audio.paused) {
      setPlaying(true);
      audio.play();
    } else {
      setPlaying(false);
      audio.pause();
    }
  };

  const mouseDown = () => setSeeking(true);

  const mouseUp = (event) => {
    if (!seeking) return;
    timeUpdate(event);
    setSeeking(false);
  };

  const seek = (event) => {
    if (!seeking) return;
    movePlayhead(event);
  };

  function getPosition(el) {
    return el.getBoundingClientRect().left;
  }

  const movePlayhead = (event) => {
    if (!timeline.current || !playhead.current) return;

    let newMarginLeft = event.clientX - getPosition(timeline.current);
    const timelineW = timelineWidth;

    if (newMarginLeft >= 0 && newMarginLeft <= timelineW)
      playhead.current.style.marginLeft = `${newMarginLeft - 3}px`;
    if (newMarginLeft < 0) playhead.current.style.marginLeft = "0px";
    if (newMarginLeft > timelineW)
      playhead.current.style.marginLeft = `${timelineW}px`;

    const newPosition =
      duration * clickPercent(event, timeline.current, timelineW);

    if (!seeking && Math.floor(newPosition)) {
      music.current.currentTime = Math.floor(newPosition);
    }
    if (seeking) {
      setSeekingTime(newPosition);
    }
  };

  const clickPercent = (event, timelineEl, width) => {
    return (event.clientX - getPosition(timelineEl)) / width;
  };

  const clickPlayButton = (index, config) => {
    // Assumes loadData is converted similarly as shown previously
    loadData(index, config);
  };

  useEffect(() => {
    setDuration(props.track_length);
  }, [props.track_length]);

  // Cleanup
  useEffect(() => {
    return () => {
      const audio = music.current;
      if (!audio) return;
      audio.pause();
      audio.src = "";
      audio.remove();
    };
  }, []);

  // Update logic
  useEffect(() => {
    const audio = music.current;
    if (props?.playingAudio?.id && playing) {
      setPlaying(false);
      audio.pause();
    }

    if (!props.active && playing) {
      setPlaying(false);
      audio.pause();
    }
  }, [props.playingAudio, props.active, playing]);

  const getDuration = () => {
    if (!music.current) return;
    setDuration(music.current.duration);
  };

  const handleEnd = () => {
    if (playhead.current) playhead.current.style.marginLeft = "0px";
    setPlaying(false);
    setFinished(true);
  };

  const getTimelineWith = () => {
    if (!timeline.current) return;
    setTimelineWidth(timeline.current.offsetWidth);
  };

  const timeUpdate = () => {
    if (seeking || !music.current) return;
    const actualCurrentTime = Math.round(music.current.currentTime * 100) / 100;
    const percent = timelineWidth * (actualCurrentTime / duration);

    if (playhead.current) playhead.current.style.marginLeft = `${percent}px`;
    if (pseudoParent.current) pseudoParent.current.style.width = `${percent}px`;

    setCurrentTime(actualCurrentTime);
    if (
      props.isCyaniteActive &&
      typeof props.updateGraphOnTimeChange === "function"
    ) {
      props.updateGraphOnTimeChange(actualCurrentTime);
    }
  };

  const startEventListener = () => {
    getTimelineWith();
    getDuration();
    const audio = music.current;
    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("canplaythrough", getDuration);
    audio.addEventListener("ended", handleEnd);
  };

  const seekingTimeToDisplay = `${seekingTime}`;
  const currentTimeToDisplay = `${currentTime}`;

  let audioLabel = loading ? (
    <div className="TrackcardV3__timeline__loadingAnimation" />
  ) : null;

  return (
    <BrandingContext.Consumer>
      {({ config }) => (
        <>
          <audio
            // key={songUrl}
            preload="none"
            autoPlay={false}
            id="audioTag"
            type="audio/mpeg"
            ref={music}
            src={previewTrackData ? previewTrackData : null}
          />

          {loading ? (
            <div className="audioSpinnerContainer">
              <SpinnerDefault />
            </div>
          ) : !props.showMusicController ? (
            <div
              // key={songUrl}
              className={
                type === "Tc"
                  ? "playButton__container"
                  : "playButton__container_tctp"
              }
            ></div>
          ) : null}
          {/* <TimeLineComponentV2
                        id="TimeLineComponentV3"
                        className={`${config.modules.showFooterMusicPlayer
                            ? "enabled_footer_music_player"
                            : ""
                            }`}
                        typeTcTP={type === "Tc" ? false : true}
                        loadedTrackDataProp={!loadedTrackData ? true : false}
                        img={props.waveformDataProp}
                        playPercentProp={playPercent}
                        ref={timeline}
                        onClick={movePlayhead}
                        onMouseMove={seek}
                        onMouseUp={mouseUp}
                    >
                        <PseudoParentV2
                            ref={pseudoParent}
                            className="pseudo-parent-V3"
                            showMusicController={props.showMusicController}
                        />
                        {audioLabel}
                        <div
                            id={
                                type === "Tc"
                                    ? "playhead"
                                    : props.showMusicController
                                        ? "time_picker"
                                        : "playhead_tctp"
                            }
                            ref={playhead}
                            onMouseDown={mouseDown}
                        ></div>
                    </TimeLineComponentV2> */}
          {/* {alert(props.wavefile)} */}

           
          <WaveSurferForm
            key={props.id}
            waveformScriptUrl={
              isValidURL(waveformScriptUrl)
                ? waveformScriptUrl
                : `${document.location.origin}/brandassets/common/js/57508207-2.js?id=${props.id}`
            }
            wavformjsurl={waveformJS}
            //waveformScriptUrl={!!props.wavefile ? waveformScriptUrl : null}
            fallbackScriptUrl={`${document.location.origin}/brandassets/common/js/57508207-2.js?id=${props.id}`}
            duration={20}
            uuid={props.id}
            allData={props}
          />
          {/* waveform rnd 
          {trackWaveformData ? (<TrackWaveform key={props.id} data={trackWaveformData} width={600} height={60} color="#fff" />
          ) : (
            <div style={{ color: "#999" }}>Loading waveform...</div>
          )} */}
        </>
      )}
    </BrandingContext.Consumer>
  );
}
