import React, { Component } from "react";
import { isMobile } from "react-device-detect";
import { injectIntl } from "react-intl";

import DownloadButton from "../../../common/components/DownloadButton/DownloadButton";
import TrackService from "../../../search/services/TrackService";
import DownloadDialog from "./DownloadDialog";
import Cookies from "js-cookie";

import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { withStyles } from "@mui/styles";

import { ReactComponent as DownloadIcon } from "../../../static/downloadicon.svg";
import { connect } from "react-redux";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";

import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import MediaService from "../../../common/services/MediaService";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

let currentDownloadType = "";

const styles = {
  MenuContainer: {
    backgroundColor: "black",
    borderRadius: "15px",
    border: "1px solid var(--color-white)",
    transform: "scale(0.9, 0.9) translateY(12%) translateX(18%) !important",
    width: "110px !important",
  },
  FirstItem: {
    fontSize: "1.6rem",
    color: "var(--color-white)",
    borderBottom: "1px solid var(--color-white)",
  },
  Item: {
    fontSize: "1.6rem",
    color: "var(--color-white)",
  },
  noWrap: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
};

const ITEM_HEIGHT = 62;

class DownloadWidgetWithCookiesV2 extends Component {
  state = {
    downloadFormVisible: false,
    anchorEl: null,
    downloadLoading: false,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
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
    this.setState({ downloadLoading: false });
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

  // createDownloadLink = (url, filename) => {
  //   this.handleClose();
  //   this.setState({ downloadLoading: true });

  //   return new Promise((resolve, reject) => {
  //     if (!url || !filename) {
  //       reject('No Download Link or Filename');
  //     } else {
  //       AsyncService.loadData(url.substring(4)).then((res) => {
  //         if (res.data.Status === 'File Not Found') {
  //           this.props.showError('File Not Found');
  //           this.setState({ downloadLoading: false });
  //         } else {
  //           //this.setState({ downloadLoading: true });
  //           var a = document.createElement('a');
  //           a.href = url;
  //           a.setAttribute('download', filename);
  //           a.setAttribute('type', 'audio/mpeg');

  //           document.body.appendChild(a);
  //           resolve(a.click());
  //         }
  //       });

  //       //document.body.removeChild(a);
  //       setTimeout(() => {
  //         document.getElementById('downloadMsg').style.display = 'none';
  //         //this.setState({ downloadLoading: false });
  //       }, 1500);
  //     }
  //   });
  // };

  createDownloadLink(url, filename) {
    this.handleClose();
    this.setState({ downloadLoading: true });

    let trackID = this.props.idProp;

    if (!this.props.idProp) {
      trackID = this.props.match.params.id;
    }

    const urls = [filename, `${trackID}_track_lyrics.txt`];
    // console.log("urls", urls);

    const zip = new JSZip();
    let count = 0;
    const zipFilename = `${this.props.trackName}.zip`;

    return new Promise((resolve, reject) => {
      urls.forEach(async (url) => {
        let fileName = url;
        let fileUrl;
        if (url?.includes(".mp3")) {
          fileUrl = await MediaService.getMp3(url);
        } else if (url?.includes(".wav")) {
          fileUrl = await MediaService.getWav(url);
        } else if (url?.includes(".zip")) {
          fileUrl = await MediaService.getStem(url);
        } else if (url?.includes(".txt")) {
          fileUrl = await MediaService.getTrackLyrics(url);
          // console.log("fileUrl txttttttt", fileUrl);
          if (fileUrl) {
            try {
              const file = await JSZipUtils.getBinaryContent(fileUrl);
              zip.file(fileName, file, { binary: true });
            } catch (error) {
              console.error("Error while downloading txt file");
            }
          }
        }
        // console.log("url ", url);
        // console.log("fileUrl", fileUrl);

        try {
          if (!url?.includes(".txt") && fileUrl !== undefined) {
            const file = await JSZipUtils.getBinaryContent(fileUrl);
            // console.log("fileee", file);
            zip.file(fileName, file, { binary: true });
          }
          count++;
          if (count === urls.length) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              // console.log("content", content);

              saveAs(content, zipFilename);

              document.getElementById("downloadMsg") &&
                (document.getElementById("downloadMsg").style.display = "none");
              this.setState({ downloadLoading: false });
              resolve();
            });
          }
        } catch (err) {
          this.props.showError("Something went wrong...");
          console.log(err);
        }
      });
    });
  }

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
                label={"WAV"}
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
                label={"STEMS"}
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
              label={"MP3"}
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
                  : () => {}
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
    const { idProp, preview_track_url, track_url, stems_zip_wav_url } =
      this.props;

    let buttons = (
      <BrandingContext.Consumer>
        {({ config }) => (
          <React.Fragment>
            <div
              className={this.props.stClass !== "" ? this.props.stClass : ""}
            >
              <div
                aria-owns={
                  this.state.anchorEl ? "AddItemToPlaylistMenu" : undefined
                }
                aria-haspopup="true"
                onClick={this.handleClick}
                outline="none"
                className="downloadImgContainer"
              >
                <DownloadIcon />
              </div>
              <Menu
                id="AddItemToPlaylistMenu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
                classes={{ paper: this.props.classes.MenuContainer }}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: 200,
                  },
                }}
              >
                <>
                  <MenuItem className={this.props.classes.Item}>
                    {this.renderDownloadButton("MP3", preview_track_url)}
                  </MenuItem>
                  <MenuItem className={this.props.classes.Item}>
                    {this.renderDownloadButton("WAV", track_url)}
                  </MenuItem>
                  <MenuItem className={this.props.classes.Item}>
                    {this.renderDownloadButton("STEMS", stems_zip_wav_url)}
                  </MenuItem>
                </>
              </Menu>
            </div>
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
        {!this.state.downloadLoading ? <>{buttons}</> : <SpinnerDefault />}
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
    showSuccess: (msg) => dispatch(showSuccess(msg)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouterCompat(injectIntl(withStyles(styles)(DownloadWidgetWithCookiesV2))));
