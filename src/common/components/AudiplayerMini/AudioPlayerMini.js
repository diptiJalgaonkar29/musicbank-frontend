// import React, { Component } from "react";
// import { isMobile } from "react-device-detect";
// import { connect } from "react-redux";
// import { setIsPlayingIndex } from "../../../redux/actions/playerActions/playerActions";
// import "./AudioPlayerMini.css";
// import MediaService from "../../services/MediaService";
// import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

// function getPosition(el) {
//   return el.getBoundingClientRect().left;
// }

// class AudioTagMini extends Component {
//   constructor(props) {
//     super(props);
//     this.music = React.createRef();

//     this.pButton = React.createRef();

//     this.state = {
//       playing: false,
//       playPercent: null,

//       loading: false,
//       loadedTrackData: false,
//       currentTime: 0,
//       seekingTime: 0,
//       duration: null,
//       finished: false,
//       seeking: false,
//       playFromPicture: false,
//       preview_track_data: null,
//     };
//   }

//   static getDerivedStateFromProps(nextProps, prevState) {
//     if (nextProps.track_length !== prevState.track_length) {
//       return { duration: nextProps.track_length };
//     } else return null;
//   }

//   UNSAFE_componentWillMount() {
//     this.setState({
//       playing: false,
//       playPercent: null,
//       timelineWidth: null,
//       loading: false,
//       loadedTrackData: false,
//       currentTime: 0,
//       seekingTime: 0,
//       duration: null,
//       finished: false,
//       seeking: false,
//       playFromPicture: false,
//       previewTrackData: null,
//     });
//   }

//   loadData = (index) => {
//     if (this.state.playing || this.state.loadedTrackData) {
//       this.play(index);
//       return;
//     }

//     this.setState({
//       loading: true,
//     });

//     if (this.props.isUnRegistered) {
//       // console.log('getMp3Unregistered ' + this.props.songUrl, this.props.mCode);
//       MediaService.getMp3Unregistered(this.props.songUrl, this.props.mCode)
//         .then((data) => {
//           this.setState({
//             previewTrackData: data,
//           });
//         })
//         .then(() => {
//           this.startEventListener();
//         })
//         .then(() => {
//           this.play(index);
//           this.setState({
//             loading: false,
//             loadedTrackData: true,
//           });
//         })
//         .catch((err) =>
//           console.error(err, "something went wrong fetching the Music Data")
//         );
//     } else {
//       MediaService.getMp3(this.props.songUrl)
//         .then((data) => {
//           this.setState({
//             previewTrackData: data,
//           });
//         })
//         .then(() => {
//           this.startEventListener();
//         })
//         .then(() => {
//           this.play(index);
//           this.setState({
//             loading: false,
//             loadedTrackData: true,
//           });
//         })
//         .catch((err) =>
//           console.error(err, "something went wrong fetching the Music Data")
//         );
//     }
//   };

//   loadDataOnMobile = (index) => {
//     var elementId = "audioElement" + new Date().valueOf().toString();
//     var audioElement = document.createElement("audio");
//     audioElement.setAttribute("id", elementId);
//     document.body.appendChild(audioElement);

//     if (this.state.playing || this.state.loadedTrackData) {
//       this.play(index);
//       return;
//     }

//     this.setState({
//       loading: true,
//     });

//     MediaService.getMp3(this.props.songUrl)
//       .then((data) => {
//         audioElement.src = data;
//         // rewrite ref to programmatically generated audio tag
//         this.music.current = audioElement;
//         this.setState({
//           previewTrackData: data,
//         });
//       })
//       .then(() => {
//         this.startEventListener();
//       })
//       .then(() => {
//         this.play(index);
//         this.setState({
//           loading: false,
//           loadedTrackData: true,
//         });
//       })

//       .catch((err) =>
//         console.error(err, "something went wrong fetching the Music Data")
//       );
//   };

//   startEventListener = () => {
//     //this.getTimelineWith();
//     this.getDuration();
//     this.music.current.addEventListener("timeupdate", this.timeUpdate, false);
//     this.music.current.addEventListener(
//       "canplaythrough",
//       this?.getDuration,
//       false
//     );
//     this.music.current.addEventListener("ended", this.handelEnd, false);
//   };

//   componentDidMount() {
//     const durationArray = this.props.track_length;
//     this.setState({
//       duration: durationArray,
//     });
//   }

//   componentWillUnmount() {
//     const music = this.music.current;
//     music.pause();
//     music.src = " ";

//     this.music.current.removeEventListener(
//       "timeupdate",
//       this.timeUpdate,
//       false
//     );
//     this.music.current.removeEventListener(
//       "canplaythrough",
//       this?.getDuration,
//       this.getTimelineWith,
//       false
//     );
//     this.music.current.removeEventListener("ended", this.handelEnd, false);
//     music.remove();
//   }

//   componentDidUpdate(prevProps, prevState) {
//     // CLICK ON IMAGE HANLDER

//     if (this.props.active || !prevState.playing) {
//       return;
//     }
//     if (!this.props.active && this.state.playing) {
//       const music = this.music.current;

//       this.setState({ playing: false });
//       music.pause();
//     }
//   }

//   getDuration = () => {
//     // MAKE THE GETTER AS A PROMISE
//     let music = this.music.current;
//     if (!music) {
//       return;
//     }
//     if (music) {
//       let dur = music.duration;
//       this.setState({ duration: dur });
//     }
//   };
//   handelEnd = () => {
//     this.setState({ finished: true, playing: false });
//   };

//   getTimelineWith = () => {
//     const timelineWidth = this.timeline.current.offsetWidth;

//     this.setState({ timelineWidth });
//   };

//   timeUpdate = () => {
//     if (this.state.seeking || this.music === null || this.music === undefined) {
//       return;
//     }
//     const ActualCurrentTime =
//       Math.round(this.music.current.currentTime * 100) / 100;

//     this.setState({ currentTime: ActualCurrentTime });
//   };

//   play = (index) => {
//     const music = this.music.current;
//     this.props.setPlayingIndex(index);

//     if (music.paused) {
//       this.setState({ playing: true });
//       music.play();
//     } else if (!music.paused) {
//       this.setState({ playing: false });
//       music.pause();
//     }
//   };

//   mouseDown = () => {
//     this.setState({ seeking: true });
//   };

//   mouseUp = (event) => {
//     if (!this.state.seeking) {
//       return;
//     }
//     if (this.state.seeking) {
//       this.timeUpdate(event);
//     }

//     this.setState({ seeking: false });
//   };

//   seek = (event) => {
//     if (!this.state.seeking) {
//       return;
//     }
//     if (this.state.seeking) {
//       this.moveplayhead(event);
//     }
//   };

//   moveplayhead = (event) => {
//     let { timelineWidth, seeking } = this.state;

//     let newMargLeft = event.clientX - getPosition(this.timeline.current);

//     if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
//       this.playhead.current.style.marginLeft = newMargLeft - 3 + "px";
//     }
//     if (newMargLeft < 0) {
//       this.playhead.current.style.marginLeft = "0px";
//     }
//     if (newMargLeft > timelineWidth) {
//       this.playhead.current.style.marginLeft = timelineWidth + "px";
//     }
//     const newPosition =
//       this.state.duration *
//       this.clickPercent(event, this.timeline.current, timelineWidth);

//     if (!seeking && Math.floor(newPosition)) {
//       this.music.current.currentTime = Math.floor(newPosition);
//     }
//     if (seeking) {
//       this.setState({ seekingTime: newPosition });
//     }
//     if (this.props.isCyaniteActive) {
//       // console.log('currentTime ' + this.state.currentTime);
//     }
//   };

//   clickPercent = (event, timeline, timelineWidth) => {
//     return (event.clientX - getPosition(timeline)) / timelineWidth;
//   };

//   render() {
//     const { playing } = this.state;
//     const { index, type, songUrl } = this.props;

//     // let audioLabel = null;

//     // if (this.state.loading) {
//     //   let audioLabel = <div className="timeline__loadingAnimation" />;
//     // }

//     return (
//       <div
//         key={songUrl}
//         className={
//           type === "Tc" ? "TrackCard__audioMini" : "TrackCard__audio_tctpMini"
//         }
//       >
//         <audio
//           key={songUrl}
//           preload="none"
//           autoPlay={false}
//           id="audioTagMini"
//           type="audio/mpeg"
//           ref={this.music}
//           src={this.state.previewTrackData ? this.state.previewTrackData : null}
//         />

//         <div id={type === "Tc" ? "audioplayerMini" : "audioplayer_tctpMini"}>
//           <div
//             key={songUrl}
//             className={
//               type === "Tc"
//                 ? "playButton__container"
//                 : "playButton__container_tctp"
//             }
//           >
//             <IconButtonWrapper
//               id="pButtonMini"
//               className={playing ? "pause" : "play"}
//               icon={playing ? "Pause" : "Play"}
//               ref={this.pButton}
//               onClick={
//                 isMobile
//                   ? () => this.loadDataOnMobile(index)
//                   : () => this.loadData(index)
//               }
//             />
//             <div
//               className={playing ? "now playing" : "now paused playing"}
//               id="music"
//             >
//               <span className="bar n1"></span>
//               <span className="bar n2"></span>
//               <span className="bar n3"></span>
//               <span className="bar n4"></span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setPlayingIndex: (index) => dispatch(setIsPlayingIndex(index)),
//   };
// };

// export default connect(null, mapDispatchToProps)(AudioTagMini);

import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import "./AudioPlayerMini.css";
import MediaService from "../../services/MediaService";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { SpinnerDefault } from "../Spinner/Spinner";
import { logEvent, TRACK_PLAY } from "../../utils/logEvent";

function getPosition(el) {
  return el.getBoundingClientRect().left;
}

class AudioTagMini extends Component {
  constructor(props) {
    super(props);
    this.music = React.createRef();
    this.pButton = React.createRef();
    this.timeline = React.createRef();
    this.playhead = React.createRef();

    this.state = {
      playing: false,
      playPercent: null,
      loading: false,
      loadedTrackData: false,
      currentTime: 0,
      seekingTime: 0,
      duration: null,
      finished: false,
      seeking: false,
      playFromPicture: false,
      previewTrackData: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.track_length !== prevState.track_length) {
      return { duration: nextProps.track_length };
    }
    return null;
  }

  loadData = (index) => {
    if (this.state.playing || this.state.loadedTrackData) {
      this.play(index);
      return;
    }

    this.setState({ loading: true });

    MediaService.getMp3FromStroswar(
      this.props.strotswar_track_id,
      this.props.track_mediatypes,
      this.props.track_type_id
    )
      .then((data) => {
        this.setState({ previewTrackData: data }, () => {
          if (this.music.current) {
            this.music.current.src = data; // set src
            this.music.current.load(); // force reload
          }
        });
      })
      .then(() => {
        this.startEventListener();

        if (this.music.current) {
          this.music.current.addEventListener(
            "canplaythrough",
            () => {
              this.setState({ loading: false, loadedTrackData: true });
              this.play(index); // autoplay after ready
            },
            { once: true }
          );
        }
      })
      .catch((err) =>
        console.error(err, "something went wrong fetching the Music Data")
      );
  };

  startEventListener = () => {
    this.getDuration();
    if (!this.music.current) return;

    this.music.current.addEventListener("timeupdate", this.timeUpdate, false);
    this.music.current.addEventListener(
      "canplaythrough",
      this.getDuration,
      false
    );
    this.music.current.addEventListener("ended", this.handelEnd, false);
  };

  componentDidMount() {
    if (this.props.track_length) {
      this.setState({ duration: this.props.track_length });
    }
  }

  componentWillUnmount() {
    const music = this.music.current;
    if (!music) return;

    music.pause();
    music.removeAttribute("src"); // safe cleanup

    music.removeEventListener("timeupdate", this.timeUpdate, false);
    music.removeEventListener("canplaythrough", this.getDuration, false);
    music.removeEventListener("ended", this.handelEnd, false);
  }

  componentDidUpdate(prevProps, prevState) {
    // 🔒 if active=false but still playing, pause it
    if (!this.props.active && this.state.playing) {
      const music = this.music.current;
      this.setState({ playing: false });
      music.pause();
    }
  }

  getDuration = () => {
    const music = this.music.current;
    if (music && music.duration) {
      this.setState({ duration: music.duration });
    }
  };

  handelEnd = () => {
    this.setState({ finished: true, playing: false });
    if (this.props.onPause) this.props.onPause(this.props.index);
  };

  getTimelineWith = () => {
    if (this.timeline.current) {
      const timelineWidth = this.timeline.current.offsetWidth;
      this.setState({ timelineWidth });
    }
  };

  timeUpdate = () => {
    if (this.state.seeking || !this.music.current) return;

    const ActualCurrentTime =
      Math.round(this.music.current.currentTime * 100) / 100;
    this.setState({ currentTime: ActualCurrentTime });
  };

  play = (index) => {
    const music = this.music.current;
    if (!music) return;

    if (music.paused) {
      if (true) {
        logEvent({
          objectIdList: [this.props.trackdetails_objectID],
          eventType: TRACK_PLAY,
          moodName: this.props.moodTags?.[0],
          moodValue: this.props.moodValues?.[0] || 0,
          genreName: this.props.genreTags?.[0] || "",
          genreValue: this.props.genreValues?.[0] || 0,
          pageName: window.location.hash.replace("#/", "") || "",
        });
      }
      music
        .play()
        .then(() => {
          this.setState({ playing: true });
          if (this.props.onPlay) this.props.onPlay(index); // ✅ notify parent
        })
        .catch((err) => console.error("Error playing audio:", err));
    } else {
      music.pause();
      this.setState({ playing: false });
      if (this.props.onPause) this.props.onPause(index); // ✅ notify parent
    }
  };

  mouseDown = () => {
    this.setState({ seeking: true });
  };

  mouseUp = (event) => {
    if (!this.state.seeking) return;

    this.timeUpdate(event);
    this.setState({ seeking: false });
  };

  seek = (event) => {
    if (this.state.seeking) {
      this.moveplayhead(event);
    }
  };

  moveplayhead = (event) => {
    let { timelineWidth, seeking } = this.state;
    if (!this.timeline.current || !this.playhead.current) return;

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
  };

  clickPercent = (event, timeline, timelineWidth) => {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
  };

  render() {
    const { playing, loading, previewTrackData } = this.state;
    const { index, type, songUrl } = this.props;

    return (
      <div
        key={songUrl}
        className={
          type === "Tc" ? "TrackCard__audioMini" : "TrackCard__audio_tctpMini"
        }
      >
        <audio
          key={songUrl}
          preload="none"
          autoPlay={false}
          id="audioTagMini"
          type="audio/mpeg"
          ref={this.music}
          src={previewTrackData || null}
        />

        <div id={type === "Tc" ? "audioplayerMini" : "audioplayer_tctpMini"}>
          <div
            key={songUrl}
            className={
              type === "Tc"
                ? "playButton__container"
                : "playButton__container_tctp"
            }
          >
            {loading ? (
              <div
                className="loader_audioMini"
                style={{ transform: "scale(0.6)" }}
              >
                <SpinnerDefault />
              </div>
            ) : (
              <IconButtonWrapper
                id="pButtonMini"
                className={playing ? "pause" : "play"}
                icon={playing ? "Pause" : "Play"}
                ref={this.pButton}
                onClick={() => this.loadData(index)}
              />
            )}
            {/* ✅ loader */}
            <div
              className={playing ? "now playing" : "now paused playing"}
              id="music"
            >
              <span className="bar n1"></span>
              <span className="bar n2"></span>
              <span className="bar n3"></span>
              <span className="bar n4"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AudioTagMini;
