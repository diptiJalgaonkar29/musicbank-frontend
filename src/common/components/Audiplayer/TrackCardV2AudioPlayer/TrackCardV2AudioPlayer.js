import React, { Component } from "react";
import { connect } from "react-redux";
import { setIsPlayingIndex } from "../../../../redux/actions/playerActions/playerActions";
import "./TrackCardV2AudioPlayer.css";
import MediaService from "../../../services/MediaService";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import { ResponsiveTabletViewCondition768 } from "../../../utils/ResponsiveTabletViewCondition";
import { PseudoParentV2, TimeLineComponentV2 } from "../TimeLineComponentV2";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import { SpinnerDefault } from "../../../../common/components/Spinner/Spinner";
import getMediaBucketPath from "../../../utils/getMediaBucketPath";
import WaveSurferForm from "../../../../AISearchScreen/Components/GetWaveForm/WaveSurferForm";
// import WaveSurferForm from "../../../../AISearchScreen/Components/GetWaveForm/WaveSurferForm";
function getPosition(el) {
  return el.getBoundingClientRect().left;
}

class TrackCardV2AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.waveformScriptUrl =
      getMediaBucketPath(`${props.wavefile}`, props.source_id, "waveform") +
      `?id=${props.id}`;
    this.music = React.createRef();
    this.timeline = React.createRef();
    this.pButton = React.createRef();
    this.playhead = React.createRef();
    this.pseudoParent = React.createRef();
    this.PlayPauseButton = React.createRef();
    this.playCustomFooterMusicPlayer =
      this.playCustomFooterMusicPlayer.bind(this);
    this.state = {
      playing: false,
      playPercent: null,
      timelineWidth: null,
      loading: false,
      loadedTrackData: false,
      currentTime: 0,
      seekingTime: 0,
      duration: null,
      finished: false,
      seeking: false,
      playFromPicture: false,
      preview_track_data: null,
      isCyaniteActive: false,
      trackName: null,
      imgSrc: null,
      musicURL: null,
      playClicked: false,
    };
  }

  handleClick() {
    this.setState({
      playClicked: true,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.track_length !== prevState.track_length) {
      return { duration: nextProps.track_length };
    } else return null;
  }

  UNSAFE_componentWillMount() {
    this.setState({
      playing: false,
      playPercent: null,
      timelineWidth: null,
      loading: false,
      loadedTrackData: false,
      currentTime: 0,
      seekingTime: 0,
      duration: null,
      finished: false,
      seeking: false,
      playFromPicture: false,
      previewTrackData: null,
      trackImage: null,
    });
  }

  playCustomFooterMusicPlayer = () => {
    MediaService.getImage(this.props.srcUrl).then((imgData) => {
      this.setState({ trackImage: imgData });
      this.props.playPause({
        mp3: this.state.previewTrackData,
        title: this.props.trackCardNameProp,
        waveImage: this.props.waveformDataProp,
        trackImage: imgData,
        id: this.props.index,
      });
    });
    this.props.setPlayList([
      {
        id: this.props.index,
        title: this.props.trackCardNameProp,
        img: this.props.srcUrl,
        mp3: this.props.songUrl,
      },
    ]);
    this.props.setPlayingIndex(0);
    this.props.setPlayListType("singleTrack");
  };

  loadData = (index, config) => {
    if (config.modules.showFooterMusicPlayer) {
      if (this.state.playing || this.state.loadedTrackData) {
        this.props.playPause({
          mp3: this.state.previewTrackData,
          title: this.props.trackCardNameProp,
          waveImage: this.props.waveformDataProp,
          trackImage: this.state.trackImage,
          id: this.props.index,
        });
        this.music.current.pause();
        return;
      }
    } else {
      this.props.setPlayingAudio({});
      if (this.state.playing || this.state.loadedTrackData) {
        this.play(index);
        return;
      }
    }

    this.setState({
      loading: true,
    });
    this.props.setPlayingAudio((prev) => ({ ...prev, isLoading: true }));

    if (this.props.isUnRegistered) {
      MediaService.getMp3Unregistered(this.props.songUrl, this.props.mCode)
        .then((data) => {
          this.setState({
            previewTrackData: data,
          });
        })
        .then(() => {
          this.startEventListener();
        })
        .then(() => {
          if (
            config.modules.showFooterMusicPlayer &&
            this.props.playingFooterMusicPlayer !== false
          ) {
            this.playCustomFooterMusicPlayer(index);
          } else {
            this.play(index);
          }
          this.props.setPlayingAudio((prev) => ({
            ...prev,
            isLoading: false,
          }));
          this.setState({
            loading: false,
            loadedTrackData: true,
          });
        })
        .catch((err) =>
          console.error(err, "something went wrong fetching the Music Data")
        );
    } else {
      //alert(this.props.strotswar_track_id);
      MediaService.getMp3FromStroswar(
        this.props.strotswar_track_id,
        this.props.track_mediatypes,
        this.props.track_type_id
      )
        .then((data) => {
          this.setState({ previewTrackData: data });
        })
        .then(() => {
          this.startEventListener();
        })
        .then(() => {
          if (
            config.modules.showFooterMusicPlayer &&
            this.props.playingFooterMusicPlayer !== false
          ) {
            this.playCustomFooterMusicPlayer(index);
          } else {
            this.play(index);
          }
          this.props.setPlayingAudio((prev) => ({
            ...prev,
            isLoading: false,
          }));
          this.setState({
            loading: false,
            loadedTrackData: true,
          });
        })
        .catch((err) =>
          console.error(err, "something went wrong fetching the Music Data")
        );
    }
  };

  loadDataOnMobile = (index) => {
    var elementId = "audioElement" + new Date().valueOf().toString();
    var audioElement = document.createElement("audio");
    audioElement.setAttribute("id", elementId);
    document.body.appendChild(audioElement);

    if (this.state.playing || this.state.loadedTrackData) {
      this.play(index);

      return;
    }

    this.setState({
      loading: true,
    });

    MediaService.getMp3(this.props.songUrl)
      .then((data) => {
        audioElement.src = data;
        // rewrite ref to programmatically generated audio tag
        this.music.current = audioElement;
        this.setState({
          previewTrackData: data,
        });
      })
      .then(() => {
        this.startEventListener();
      })
      .then(() => {
        this.play(index);
        this.setState({
          loading: false,
          loadedTrackData: true,
        });
      })

      .catch((err) =>
        console.error(err, "something went wrong fetching the Music Data")
      );
  };

  startEventListener = () => {
    this.getTimelineWith();
    this.getDuration();
    this.music.current.addEventListener("timeupdate", this.timeUpdate, false);
    this.music.current.addEventListener(
      "canplaythrough",
      this?.getDuration,
      false
    );
    this.music.current.addEventListener("ended", this.handelEnd, false);
  };

  componentDidMount() {
    const durationArray = this.props.track_length;
    this.setState({
      duration: durationArray,
    });
  }

  componentWillUnmount() {
    const music = this.music.current;
    music.pause();
    music.src = " ";

    this.music.current.removeEventListener(
      "timeupdate",
      this.timeUpdate,
      false
    );
    this.music.current.removeEventListener(
      "canplaythrough",
      this?.getDuration,
      this.getTimelineWith,
      false
    );
    this.music.current.removeEventListener("ended", this.handelEnd, false);
    music.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props?.playingAudio?.id && this.state.playing) {
      const music = this.music.current;
      this.setState({ playing: false });
      music.pause();
    }
    // CLICK ON IMAGE HANLDER

    if (this.props.active || !prevState.playing) {
      return;
    }
    if (!this.props.active && this.state.playing) {
      const music = this.music.current;
      this.setState({ playing: false });
      music.pause();
    }
  }

  getDuration = () => {
    // MAKE THE GETTER AS A PROMISE
    let music = this.music.current;
    if (!music) {
      return;
    }
    if (music) {
      let dur = music.duration;
      this.setState({ duration: dur });
    }
  };
  handelEnd = () => {
    this.playhead.current.style.marginLeft = "0px";
    this.setState({ finished: true, playing: false });
  };

  getTimelineWith = () => {
    if (!this.timeline.current) return;
    const timelineWidth = this.timeline.current.offsetWidth;
    this.setState({ timelineWidth });
  };

  timeUpdate = () => {
    if (this.state.seeking || this.music === null || this.music === undefined) {
      return;
    }
    const ActualCurrentTime =
      Math.round(this.music.current.currentTime * 100) / 100;

    const { duration, timelineWidth } = this.state;
    var playPercent = timelineWidth * (ActualCurrentTime / duration);

    this.playhead.current.style.marginLeft = playPercent + "px";
    this.pseudoParent.current.style.width = playPercent + "px";
    this.setState({ currentTime: ActualCurrentTime });
    if (
      this.props.isCyaniteActive &&
      typeof this.props.updateGraphOnTimeChange === "function"
    ) {
      this.props.updateGraphOnTimeChange(ActualCurrentTime);
    }
  };

  play = (index) => {
    const music = this.music.current;
    this.props.setPlayingIndex(index);
    // console.log("music**", music.paused, index);

    if (music.paused) {
      this.setState({ playing: true });
      music.play();
    } else if (!music.paused) {
      this.setState({ playing: false });
      music.pause();
    }
  };

  mouseDown = () => {
    this.setState({ seeking: true });
  };

  mouseUp = (event) => {
    if (!this.state.seeking) {
      return;
    }
    if (this.state.seeking) {
      this.timeUpdate(event);
    }

    this.setState({ seeking: false });
  };

  seek = (event) => {
    if (!this.state.seeking) {
      return;
    }
    if (this.state.seeking) {
      this.moveplayhead(event);
    }
  };

  moveplayhead = (event) => {
    let { timelineWidth, seeking } = this.state;

    let newMargLeft = event.clientX - getPosition(this.timeline.current);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
      this.playhead.current.style.marginLeft = newMargLeft - 3 + "px";
    }
    if (newMargLeft < 0) {
      this.playhead.current.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
      this.playhead.current.style.marginLeft = timelineWidth + "px";
    }
    const newPosition =
      this.state.duration *
      this.clickPercent(event, this.timeline.current, timelineWidth);

    if (!seeking && Math.floor(newPosition)) {
      this.music.current.currentTime = Math.floor(newPosition);
    }
    if (seeking) {
      this.setState({ seekingTime: newPosition });
    }
    if (this.props.isCyaniteActive) {
      // console.log('currentTime ' + this.state.currentTime);
    }
  };

  clickPercent = (event, timeline, timelineWidth) => {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
  };

  clickPlayButton = (index, config) => {
    this.loadData(index, config);
  };
  isValidURL(url) {
    try {
      new URL(url); // will throw if invalid
      return true;
    } catch (_) {
      return false;
    }
  }
  render() {
    const { playing, currentTime, seekingTime, seeking, duration } = this.state;
    const { index, type, songUrl } = this.props;

    const seekingTimeToDisplay = `${seekingTime}`;
    const currentTimeToDisplay = `${currentTime}`;

    let audioLabel = null;

    if (this.state.loading) {
      audioLabel = <div className="TrackcardV2__timeline__loadingAnimation" />;
    }

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
              ref={this.music}
              src={
                this.state.previewTrackData ? this.state.previewTrackData : null
              }
            />

            {this.state.loading ? (
              <div className="audioSpinnerContainer">
                <SpinnerDefault />
              </div>
            ) : !this.props.showMusicController ? (
              <div
                // key={songUrl}
                className={
                  type === "Tc"
                    ? "playButton__container"
                    : "playButton__container_tctp"
                }
              >
                <IconButtonWrapper
                  type="button"
                  id="pButton"
                  ref={this.pButton}
                  icon={
                    +this.props.index !== +this.props.playingAudio?.id ||
                    !this.props.playingAudio?.isPlaying
                      ? "Play"
                      : "Pause"
                  }
                  // className={`${playing ? "pause" : "play"} ${
                  //   (config.modules.showFooterMusicPlayer &&
                  //     this.props?.playingAudio?.isLoading &&
                  //     index == this.props?.playingAudio?.id) ||
                  //     this.state.loading
                  //     ? "loading"
                  //     : ""
                  // }`}
                  onClick={
                    ResponsiveTabletViewCondition768()
                      ? () => this.loadDataOnMobile(index)
                      : () => this.clickPlayButton(index, config)
                  }
                />
              </div>
            ) : null}
            {/* <TimeLineComponentV2
              id="TimeLineComponentV2"
              className={`${
                config.modules.showFooterMusicPlayer
                  ? "enabled_footer_music_player"
                  : ""
              }`}
              typeTcTP={type === "Tc" ? false : true}
              loadedTrackDataProp={!this.state.loadedTrackData ? true : false}
              img={this.props.waveformDataProp}
              playPercentProp={this.state.playPercent}
              ref={this.timeline}
              onClick={this.moveplayhead}
              onMouseMove={this.seek}
              onMouseUp={this.mouseUp}
            > 
              <PseudoParentV2
                ref={this.pseudoParent}
                className="pseudo-parent-V2"
                showMusicController={this.props.showMusicController}
              />
              {audioLabel}
              <div
                id={
                  type === "Tc"
                    ? "playhead"
                    : this.props.showMusicController
                    ? "time_picker"
                    : "playhead_tctp"
                }
                ref={this.playhead}
                onMouseDown={this.mouseDown}
              ></div>
            </TimeLineComponentV2>*/}
            {/* <WaveSurferForm
              waveformScriptUrl="https://sourceaudio.s3.amazonaws.com/5/7/5/0/8/2/0/7/57508207-2.js"
              duration={20}
            /> */}
            <WaveSurferForm
              key={this.props.id}
              waveformScriptUrl={
                this.isValidURL(this.waveformScriptUrl)
                  ? this.waveformScriptUrl
                  : `${document.location.origin}/brandassets/common/js/57508207-2.js?id=${this.props.id}`
              }
              wavformjsurl={this.waveformScriptUrl}
              //waveformScriptUrl={!!props.wavefile ? waveformScriptUrl : null}
              fallbackScriptUrl={`${document.location.origin}/brandassets/common/js/57508207-2.js?id=${this.props.id}`}
              duration={20}
              uuid={this.props.id}
            />
          </>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPlayingIndex: (index) => dispatch(setIsPlayingIndex(index)),
  };
};

export default connect(null, mapDispatchToProps)(TrackCardV2AudioPlayer);
