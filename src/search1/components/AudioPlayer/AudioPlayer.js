import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { FormattedTime } from "react-player-controls";
import { connect } from "react-redux";
import { setIsPlayingIndex } from "../../../redux/actions/playerActions/playerActions";
import "./AudioPlayer.css";
import MediaService from "../../../common/services/MediaService";
import { PseudoParent, TimeLineComponent } from "./TimeLineComponent";
import localStorage from "redux-persist/es/storage";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

function getPosition(el) {
  return el.getBoundingClientRect().left;
}

const AudioTag = (props) => {
  const music = useRef(null);
  const timeline = useRef(null);
  const pButton = useRef(null);
  const playhead = useRef(null);
  const pseudoParent = useRef(null);

  const [state, setState] = useState({
    playing: false,
    playPercent: null,
    timelineWidth: null,
    loading: false,
    loadedTrackData: false,
    currentTime: 0,
    seekingTime: 0,
    duration: props.track_length || null,
    finished: false,
    seeking: false,
    playFromPicture: false,
    previewTrackData: null,
    isCyaniteActive: false,
    trackName: null,
    imgSrc: null,
    musicURL: null,
    playClicked: false,
  });

  const updateState = (newState) => setState((prev) => ({ ...prev, ...newState }));

  const getDuration = () => {
    if (music.current) {
      const dur = music.current.duration;
      updateState({ duration: dur });
    }
  };

  const timeUpdate = () => {
    if (state.seeking || !music.current) return;

    const ActualCurrentTime = Math.round(music.current.currentTime * 100) / 100;
    const playPercent = state.timelineWidth * (ActualCurrentTime / state.duration);

    if (playhead.current && pseudoParent.current) {
      playhead.current.style.marginLeft = playPercent + 'px';
      pseudoParent.current.style.width = playPercent + 'px';
    }

    updateState({ currentTime: ActualCurrentTime });

    if (props.isCyaniteActive && typeof props.updateGraphOnTimeChange === 'function') {
      props.updateGraphOnTimeChange(ActualCurrentTime);
    }
  };

  const handelEnd = () => {
    if (playhead.current) playhead.current.style.marginLeft = '0px';
    updateState({ finished: true, playing: false });
  };

  const getTimelineWith = () => {
    if (timeline.current) {
      updateState({ timelineWidth: timeline.current.offsetWidth });
    }
  };

  const clickPercent = (e, timelineRef, width) => {
    return (e.clientX - getPosition(timelineRef)) / width;
  };

  const moveplayhead = (e) => {
    const width = state.timelineWidth;
    let newMargLeft = e.clientX - getPosition(timeline.current);

    if (newMargLeft >= 0 && newMargLeft <= width) {
      playhead.current.style.marginLeft = newMargLeft - 3 + 'px';
    } else if (newMargLeft < 0) {
      playhead.current.style.marginLeft = '0px';
    } else {
      playhead.current.style.marginLeft = width + 'px';
    }

    const newPosition = state.duration * clickPercent(e, timeline.current, width);

    if (!state.seeking && Math.floor(newPosition)) {
      music.current.currentTime = Math.floor(newPosition);
    }
    if (state.seeking) {
      updateState({ seekingTime: newPosition });
    }
  };

  const seek = (e) => {
    if (!state.seeking) return;
    moveplayhead(e);
  };

  const mouseUp = (e) => {
    if (!state.seeking) return;
    timeUpdate(e);
    updateState({ seeking: false });
  };

  const mouseDown = () => {
    updateState({ seeking: true });
  };

  const play = (index) => {
    props.setPlayingIndex(index);
    if (music.current.paused) {
      updateState({ playing: true });
      music.current.play();
    } else {
      updateState({ playing: false });
      music.current.pause();
    }
  };

  useEffect(() => {
    const durationArray = props.track_length;
    updateState({ duration: durationArray });
  }, [props.track_length]);

  useEffect(() => {
    return () => {
      const musicEl = music.current;
      if (musicEl) {
        musicEl.pause();
        musicEl.src = '';
        musicEl.removeEventListener('timeupdate', timeUpdate);
        musicEl.removeEventListener('canplaythrough', getDuration);
        musicEl.removeEventListener('ended', handelEnd);
      }
    };
  }, []);

  const currentTimeDisplay = `${state.currentTime}`;
  const seekingTimeDisplay = `${state.seekingTime}`;

  const audioLabel = state.loading ? <div className="timeline__loadingAnimation" /> : null;

  return (
    <div
      key={props.songUrl}
      className={`$ {
        props.type === 'Tc' ? 'TrackCard__audio' : 'TrackCard__audio_tctp'
      } audioPlayerContainer`}
    >
      <audio
        key={props.songUrl}
        preload="none"
        autoPlay={false}
        id="audioTag"
        type="audio/mpeg"
        ref={music}
        src={state.previewTrackData || null}
      />

      <div id={props.type === 'Tc' ? 'audioplayer' : 'audioplayer_tctp'}>
        <div
          key={props.songUrl}
          className={props.type === 'Tc' ? 'playButton__container' : 'playButton__container_tctp'}
        >
          <IconButtonWrapper
            id="pButton"
            className={state.playing ? 'pause' : 'play'}
            icon={state.playing ? 'Pause' : 'Play'}
            ref={pButton}
            onClick={isMobile ? () => { } : () => { }}
          />
        </div>

        <TimeLineComponent
          id="TimeLineComponent"
          typeTcTP={props.type !== 'Tc'}
          loadedTrackDataProp={!state.loadedTrackData}
          img={props.waveformDataProp}
          playPercentProp={state.playPercent}
          ref={timeline}
          onClick={moveplayhead}
          onMouseMove={seek}
          onMouseUp={mouseUp}
        >
          <PseudoParent ref={pseudoParent} className="pseudo-parent" />
          {audioLabel}
          <div
            id={props.type === 'Tc' ? 'playhead' : 'playhead_tctp'}
            ref={playhead}
            onMouseDown={mouseDown}
          ></div>
        </TimeLineComponent>

        <div className={props.type === 'Tc' ? 'TrackCard__time' : 'tctp__time'}>
          {state.playing &&
            !state.loading &&
            state.duration &&
            state.loadedTrackData &&
            state.currentTime ? (
            <FormattedTime
              numSeconds={
                state.seeking
                  ? Number(state.duration - seekingTimeDisplay)
                  : Number(state.duration - currentTimeDisplay)
              }
            />
          ) : (
            <FormattedTime numSeconds={!Number(state.duration) ? 0 : Number(state.duration)} />
          )}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPlayingIndex: (index) => dispatch(setIsPlayingIndex(index)),
  };
};

export default connect(null, mapDispatchToProps)(AudioTag);
