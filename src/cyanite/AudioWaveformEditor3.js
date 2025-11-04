import React from "react";
import axios from "axios";
import MediaService from "../common/services/MediaService";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import { connect } from "react-redux";
import { showError } from "../redux/actions/notificationActions";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import AsyncService from "../networking/services/AsyncService";

var wavesurfer;
var region1;
var selRegion = [];
var self = this;
var audLoadStatus = false;
var audData;

class AudioWaveformEditor extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { applyTrim: false };
  }
  state = {
    applyTrim: false,
    startTrim: true,
    cancelTrim: false,
    downloadTrim: false,
    downloadTrimMsg: false,
    audioTrimLoading: false,
    audData: "",
    trackWavURL: this.props.trackWavURL,
    trackMp3URL: this.props.trackMp3URL,
    trackID: this.props.trackID,
    trimmedFileName: "",
    trimmedFileURL: "",
    disableTrimBtn: false,
  };

  getRegionPosition = () => {
    // console.log("Region : ", wavesurfer.regions.list.selRegion1);
    selRegion.trackWavURL = this.state.trackWavURL;
    selRegion.trackMp3URL = this.state.trackMp3URL;
    selRegion.trackID = this.state.trackID;
    selRegion.start = wavesurfer.regions.list.selRegion1.start;
    selRegion.end = wavesurfer.regions.list.selRegion1.end;
    // console.log("selRegion", selRegion);
    this.getTrimmedAudio(selRegion);
    this.setState({ audioTrimLoading: true });
  };

  getTrimmedAudio = (selRegion) => {
    console.log("getTrimmedAudio ", selRegion);

    let data = JSON.stringify({
      fileName: selRegion.trackWavURL.replace(".wav", ""),
      startpointInSec: selRegion.start,
      endpointInSec: selRegion.end,
    });

    AsyncService.postData("/TrackUtils/trimWave", data)
      .then((response) => {
        console.log(
          "getTrimmedAudio - trimmed resp ",
          JSON.stringify(response.data)
        );
        var trimmedData = response.data;
        if (typeof trimmedData == "object") {
          trimmedData = trimmedData.trimmedfilename;
          trimmedData = trimmedData + ".mp3";
        } else if (trimmedData.indexOf("success:") >= 0) {
          trimmedData = trimmedData.replace("success:", "");
          trimmedData = trimmedData + ".mp3";
        }
        this.activateDownloadTrim(trimmedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  activateApplyTrim = () => {
    // console.log("apply trim " + this.state.applyTrim);
    self.setState({
      startTrim: false,
      applyTrim: true,
      cancelTrim: true,
      downloadTrim: false,
      audioTrimLoading: false,
    });
  };

  activateDownloadTrim = (trimmedData) => {
    // console.log("download trim " + this.state.applyTrim);
    self.setState({
      startTrim: false,
      applyTrim: false,
      downloadTrim: true,
      audioTrimLoading: false,
      trimmedFileName: trimmedData,
      trimmedFileURL: trimmedData,
    });
  };

  cancelAudioEditor = () => {
    // console.log("cancelAudioEditor ");
    self.setState({
      startTrim: true,
      applyTrim: false,
      downloadTrim: false,
      audioTrimLoading: false,
      cancelTrim: false,
      trimmedFileName: "",
      trimmedFileURL: "",
      disableTrimBtn: false,
    });
    document.getElementsByClassName("Cyanite_AudioPlayer")[0].style.display =
      "inline-block";
    wavesurfer.destroy();
    wavesurfer = null;
    selRegion = [];
  };

  downloadUsingFetch = async (url, fileName) => {
    const mp3 = await AsyncService.loadBlob(url);
    const mp3URL = URL.createObjectURL(mp3?.data);

    const anchor = document.createElement("a");
    anchor.href = mp3URL;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(mp3URL);
    setTimeout(function () {
      self.setState({
        downloadTrimMsg: false,
        downloadTrim: false,
        applyTrim: true,
        startTrim: false,
      });
    }, 3000);
  };

  createDownloadLinkTrim = () => {
    // console.log("createDownloadLink **" + this.state.trimmedFileName);
    this.setState({ downloadTrimMsg: true });
    var url = this.state.trimmedFileURL;
    var filename = this.state.trimmedFileName;
    const trimWavUrl = `/files/Tmp3s/${filename}`;
    url = trimWavUrl;
    if (!url || !filename) {
      console.log("No Download Link or Filename");
    } else {
      this.downloadUsingFetch(url, filename);
    }
  };

  renderAudioEditor = () => {
    // console.log("renderAudioEditor clicked");
    // console.log("audLoadStatus", audLoadStatus, audLoadStatus !== "loading");
    this.setState({ disableTrimBtn: true });
    if (audLoadStatus !== "loading") {
      // console.log(
      //   "renderAudioEditor " +
      //     this.props.trackURL +
      //     "|" +
      //     this.props.trackID +
      //     "|" +
      //     this.props.track_lengthProp +
      //     "|" +
      //     audLoadStatus
      // );
      audLoadStatus = "loading";
      wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "#999",
        progressColor: "purple",
        maxCanvasWidth: 200,
        hideScrollbar: false,
        minPxPerSec: 1,
        maxPxPerSec: 50,
        regionsMinLength: 10,
        interact: false,
        cursorWidth: 0,
        height: 60,
      });

      this.setState({ audioTrimLoading: true });
      // console.log("audData " + this.state.audData);

      if (this.state.audData !== "") {
        audLoadStatus = true;
        wavesurfer.load(this.state.audData);
      } else {
        MediaService.getWavForTrim(this.props.trackWavURL).then((data) => {
          if (data === null) {
            audLoadStatus = false;
            this.setState({
              startTrim: true,
              applyTrim: false,
              downloadTrim: false,
              audioTrimLoading: false,
              cancelTrim: false,
              trimmedFileName: "",
              trimmedFileURL: "",
              disableTrimBtn: false,
            });
            document.getElementsByClassName(
              "Cyanite_AudioPlayer"
            )[0].style.display = "inline-block";
            wavesurfer.destroy();
            wavesurfer = null;
            selRegion = [];
            this.props.showError("File not found");
            return;
          }
          audData = data;
          self = this;
          audLoadStatus = true;
          wavesurfer.load(data);
          this.setState({ audData: data });
        });
      }

      wavesurfer.on("ready", function () {
        // console.log("wavesurfer - ready");
        document.getElementsByClassName(
          "Cyanite_AudioPlayer"
        )[0].style.display = "none";
        document.getElementById("waveform").style.opacity = "1";
        wavesurfer.addPlugin(RegionsPlugin.create({}));

        // Add a couple of pre-defined regions
        region1 = wavesurfer.addRegion({
          start: 1, // time in seconds
          end: 10, // time in seconds
          color: getComputedStyle(document.body)?.getPropertyValue(
            "--color-radarchart-primary"
          ),
          minLength: 10,
          id: "selRegion1",
        });
        self.activateApplyTrim();
        audLoadStatus = true;
        self.setState({ disableTrimBtn: false });
      });
    }
  };

  render() {
    return (
      <>
        <div
          className={`audioEditorBlock ${
            this.state.disableTrimBtn ? "Loading" : ""
          }`}
        >
          <div id="waveform" className="audioeditor"></div>
          {/* <ButtonWrapper
            className="audTrim"
            style={{
              // backgroundImage: `url(${TrimIconSvg})`,
              display: this.state.startTrim ? "block" : "none",
            }}
            onClick={this.renderAudioEditor}
            disabled={this.state.disableTrimBtn}
          >
            Trim
          </ButtonWrapper> */}
          {!["", "-", null, undefined].includes(
            this.state.trackWavURL?.trim?.()
          ) ? (
            <ButtonWrapper
              className="audTrim"
              style={{
                display: this.state.startTrim ? "block" : "none",
              }}
              onClick={this.renderAudioEditor}
              disabled={this.state.disableTrimBtn}
            >
              Trim
            </ButtonWrapper>
          ) : null}
          <ButtonWrapper
            className="audTrimApply"
            style={{ display: this.state.applyTrim ? "block" : "none" }}
            onClick={this.getRegionPosition}
          >
            Apply
          </ButtonWrapper>
          <ButtonWrapper
            className="audTrimDownload"
            style={{ display: this.state.downloadTrim ? "block" : "none" }}
            onClick={this.createDownloadLinkTrim}
          >
            Download
          </ButtonWrapper>
          <div
            id="downloadTrimMsg"
            style={{ display: this.state.downloadTrimMsg ? "block" : "none" }}
          >
            {/* <ReactSVG svgstyle={{ transform: "scale(1)" }} className="custom-input-icon" src={`${Tickmark}`} style={{ float: "left" }} /> */}
            <span>Downloading your file...</span>
          </div>
          <div
            className="audioTrimLoading"
            style={{ display: this.state.audioTrimLoading ? "flex" : "none" }}
          >
            <SpinnerDefault />
          </div>
          <ButtonWrapper
            className="audTrimCancel"
            style={{ display: this.state.cancelTrim ? "block" : "none" }}
            onClick={this.cancelAudioEditor}
            variant="outlined"
          >
            Cancel
          </ButtonWrapper>
        </div>
      </>
    );
  }
}

// export default AudioWaveformEditor;
const mapDispatchToProps = (dispatch) => {
  return {
    showError: (msg) => dispatch(showError(msg)),
  };
};

export default connect(null, mapDispatchToProps)(AudioWaveformEditor);
