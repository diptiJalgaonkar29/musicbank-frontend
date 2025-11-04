import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { injectIntl } from "react-intl";

import DownloadButton from "../../../common/components/DownloadButton/DownloadButton";
import TrackService from "../../../search/services/TrackService";
import DownloadDialog from "./DownloadDialog";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import AsyncService from "../../../networking/services/AsyncService";
import { connect } from "react-redux";
import { showError } from "../../../redux/actions/notificationActions";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

let currentDownloadType = "";

class DownloadWidgetWithCookies extends Component {
  state = {
    downloadFormVisible: false,
  };

  downloadMsgHandler = () => {
    this.closeDownloadForm();
    document.getElementById("downloadMsg").style.display = "block";
  };

  downloadHandler = (type) => {
    const { idProp, preview_track_url, track_url, stems_zip_wav_url } =
      this.props;

    let trackID = idProp;

    if (!idProp) {
      trackID = this.props.match.params.id;
    }

    const mp3Name = preview_track_url;
    const wavName = track_url;
    const stemsName = stems_zip_wav_url;

    const mp3Url = `api/files/mp3s/${preview_track_url}`;
    const wavUrl = `api/files/wavs/${track_url}`;
    const stemsUrl = `api/files/wav-stems/${stems_zip_wav_url}`;

    switch (type) {
      case "MP3":
        this.createDownloadLink(mp3Url, mp3Name)
          .then(() => this.triggerDownloadCount("MP3", trackID))
          .catch((err) => console.error(err));
        break;
      case "WAV":
        this.createDownloadLink(wavUrl, wavName)
          .then(() => this.triggerDownloadCount("WAV", trackID))
          .catch((err) => console.error(err));
        break;
      case "STEMS":
        this.createDownloadLink(stemsUrl, stemsName)
          .then(() => this.triggerDownloadCount("STEMS_ZIP_WAV", trackID))
          .catch((err) => console.error(err));
        break;
      default:
        break;
    }
  };

  triggerDownloadCount = (type, id) => {
    if (!type || !id) {
      return console.error(
        "something went wrong triggering the Download Counter"
      );
    } else {
      TrackService.triggerDownloadCount(type, id).catch((e) =>
        console.error(e, "something went wrong triggering the Download Counter")
      );
    }
  };

  openDownloadForm = (type) => {
    currentDownloadType = type;
    this.setState({
      downloadFormVisible: true,
    });
  };

  closeDownloadForm = () => {
    this.setState({ downloadFormVisible: false, wavMenu: null });
  };

  createDownloadLink = (url, filename) => {
    return new Promise((resolve, reject) => {
      if (!url || !filename) {
        reject("No Download Link or Filename");
      } else {
        AsyncService.loadData(url.substring(4)).then((res) => {
          if (res.data.Status === "File Not Found") {
            this.props.showError("File Not Found");
          } else {
            var a = document.createElement("a");
            a.href = url;
            a.setAttribute("download", filename);
            a.setAttribute("type", "audio/mpeg");

            document.body.appendChild(a);
            resolve(a.click());
          }
        });

        //document.body.removeChild(a);
        setTimeout(function () {
          document.getElementById("downloadMsg").style.display = "none";
        }, 1000);
      }
    });
  };

  renderDownloadButton = (type, active) => {
    const { intl, config } = this.props;
    const typeConverted = type.toString().toUpperCase(); // "MP3", "WAV", "STEMS";
    const isDownloadDialogMP3 = config.modules.RenderDownloadFormMP3;
    const isDownloadDialogWAV = config.modules.RenderDownloadFormWAV;

    switch (typeConverted) {
      case "WAV":
        return (
          !isMobile && (
            <div>
              <DownloadButton
                label={`${intl.messages["trackDetail.page.downloadWAV"]}`}
                onClickProp={
                  isDownloadDialogWAV
                    ? () => this.openDownloadForm("WAV")
                    : () => this.downloadHandler(typeConverted)
                }
                disabledProp={!active}
              />
            </div>
          )
        );
      case "STEMS":
        return (
          !isMobile && (
            <div>
              <DownloadButton
                label={`${
                  intl.messages[`trackDetail.page.download${typeConverted}`]
                }`}
                onClickProp={() => this.downloadHandler(typeConverted)}
                disabledProp={!active}
                disabledMessageProp={`${typeConverted} not available`}
              />
            </div>
          )
        );
      case "MP3":
        return (
          <div>
            <DownloadButton
              label={`${
                intl.messages[`trackDetail.page.download${typeConverted}`]
              }`}
              onClickProp={
                isDownloadDialogMP3
                  ? () => this.openDownloadForm("MP3")
                  : () => this.downloadHandler(typeConverted)
              }
              disabledProp={!active}
              disabledMessageProp={`${typeConverted} not available`}
            />
          </div>
        );
      case "TRACKS":
        return (
          <div>
            <DownloadButton
              label={`${
                intl.messages[`trackDetail.page.similar${typeConverted}`]
              }`}
              onClickProp={
                this.props.cyanite_id != null
                  ? () => {
                      const win = window.open(
                        "/#/similar_tracks/" +
                          this.props.cyanite_id +
                          "-" +
                          this.props.idProp
                      );
                      win.focus();
                    }
                  : //    () => this.props.navigate(`/similar_tracks/` + this.props.cyanite_id) :
                    () => {}
              }
              disabledProp={this.props.cyanite_id <= 0}
              disabledMessageProp={`${typeConverted} not available`}
            />
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    const { preview_track_url, track_url, stems_zip_wav_url } = this.props;

    // let internalUser = this.props.isUserInternal;

    let buttons = (
      <BrandingContext.Consumer>
        {({ config }) => (
          <React.Fragment>
            {this.renderDownloadButton("MP3", preview_track_url)}
            {this.renderDownloadButton("WAV", track_url)}
            {this.renderDownloadButton("STEMS", stems_zip_wav_url)}
            {config.modules.CyaniteProfile
              ? this.renderDownloadButton("TRACKS", stems_zip_wav_url)
              : null}
          </React.Fragment>
        )}
      </BrandingContext.Consumer>
    );

    return (
      <div className="TpTc__downloads__container">
        <DownloadDialog
          id={this.props.idProp}
          config={this.props.config}
          open={this.state.downloadFormVisible}
          downloadTriggerProp={() => this.downloadHandler(currentDownloadType)}
          downloadMsgHandlerProp={() => this.downloadMsgHandler()}
          onClose={this.closeDownloadForm}
          isUserInternal={this.props.isUserInternal}
          downloadType={currentDownloadType}
        />
        {buttons}
        <br />
        <div id="downloadMsg" className="TpTc__msg" style={{ display: "none" }}>
          <span>Your download will start in a few seconds...</span>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showError: (msg) => dispatch(showError(msg)),
  };
};

const mapStateToProps = () => {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouterCompat(injectIntl(DownloadWidgetWithCookies)));
