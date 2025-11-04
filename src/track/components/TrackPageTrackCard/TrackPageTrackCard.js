import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { withStyles } from "@mui/styles";
import React, { Component } from "react";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import AudioPlayer from "../../../common/components/Audiplayer/AudioPlayer";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import MediaService from "../../../common/services/MediaService";
import AddItemToPlaylistMenu from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenu";
import "../../../_styles/TpTc.css";
import DownloadWidgetWithCookies from "./DownloadWidgetWithCookies";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";

const classNamesWeb = {
  wrapper: "TpTc__wrapper",
  container: "TpTc__container",
  img: "TpTc__img",
  title: "TpTc__title",
  titleButton: "TpTc__title--btn",
  tags: "TpTc__tags",
  description: "TpTc__description",
  player: "TpTc__player",
  downloads: "TpTc__downloads",
};

const classNamesMobile = {
  wrapper: "TpTc__Mobile__wrapper",
  container: "TpTc__Mobile__container",
  img: "TpTc__Mobile__img",
  title: "TpTc__Mobile__title",
  titleButton: "TpTc__Mobile__title--btn",
  tags: "TpTc__Mobile__tags",
  description: "TpTc__Mobile__description",
  player: "TpTc__Mobile__player",
  downloads: "TpTc__Mobile__downloads",
};

const styles = {
  paper: {
    background: "transparent",
    color: "var(--color-white)",
    boxShadow: "none",
  },
  root: {
    fontSize: "1.6rem",
    color: "var(--color-white)",
  },
  icon: {
    fontSize: "large",
    color: "var(--color-white)",
  },
};

class TrackPageTrackCard extends Component {
  state = {
    loading: true,
    preview_image_data: null,
    waveformData: null,
    propsLoaded: false,
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.preview_track_url !== null &&
      this.props.preview_track_url !== prevProps.preview_track_url
    ) {
      return MediaService.getWaveform(this.props.preview_track_url)
        .then((res) => {
          return this.setState({
            propsLoaded: true,
            waveformData: res,
          });
        })
        .catch((err) => {
          console.error(err, "something went wrong fetching the Waveform Data");
        });
    }
  }

  componentDidMount() {
    this.setState({
      propsLoaded: false,
    });
  }

  renderTags(type) {
    const content = (
      <div className="TrackCard__item__tags">
        <div className="TrackCard__item__tags--divider">
          {(this.props.feelingsTags && this.props.feelingsTags.length >= 1) ||
          (this.props.impactTags && this.props.impactTags.length >= 1) ||
          (this.props.motionTags && this.props.motionTags.length >= 1) ||
          (this.props.tonalityTags && this.props.tonalityTags.length >= 1) ? (
            <>
              <h4 key={"MusicalFeel"}>Musical Feel:</h4>
              <div className="TrackPage__item__tags_container">
                {this.props.feelingsTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="feelingsTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_feelings"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.impactTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="impactTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_impact"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.motionTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="motionTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_motion"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.tonalityTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="tonalityTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_tonality"
                      label={item?.toString()}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
        <div className="TrackCard__item__tags--divider">
          {this.props.instrumentTags &&
          this.props.instrumentTags.length >= 1 ? (
            <>
              <h4 key={"Instruments"}>Instruments:</h4>
              <div className="TrackPage__item__tags_container">
                {this.props.instrumentTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="instrumentTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="instrument_ids"
                      label={item?.toString()}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
        <div className="TrackCard__item__tags--divider">
          {(this.props.genreTags && this.props.genreTags.length >= 1) ||
          (this.props.keyTags && this.props.keyTags.length >= 1) ||
          (this.props.tempoTags && this.props.tempoTags.length >= 1) ? (
            <>
              <h4 key={"Other"}>Other:</h4>
              <div className="TrackPage__item__tags_container">
                {this.props.genreTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="genreTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_genre"
                      label={item?.toString()}
                    />
                  );
                })}
                {this.props.keyTags?.map((item) => {
                  if (item !== "" && item.length > 0) {
                    return (
                      // <span key={item.toString()} id="keyTags">
                      //   {item}
                      // </span>
                      <ChipWrapper
                        key={item?.toString()}
                        className="tag_key"
                        label={item?.toString()}
                      />
                    );
                  }
                })}
                {this.props.tempoTags?.map((item) => {
                  return (
                    // <span key={item.toString()} id="tempoTags">
                    //   {item}
                    // </span>
                    <ChipWrapper
                      key={item?.toString()}
                      className="tag_tempo"
                      label={item?.toString()}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
    if (type === "web") {
      return content;
    }
    if (type === "mobile") {
      return (
        <Accordion className={this.props.classes.paper}>
          <AccordionSummary
            className={this.props.classes.root}
            expandIcon={<ExpandMoreIcon className={this.props.classes.icon} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            Show Tags
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      );
    }
  }

  render() {
    const {
      trackName,
      queryID,
      track_lengthProp,
      descriptionTag,
      descriptionTag2,
      isMobileProp,
      playingIndex,
    } = this.props;
    let content = (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div
            className={
              isMobileProp
                ? classNamesMobile.container
                : classNamesWeb.container
            }
          >
            <div
              className={
                isMobileProp ? classNamesMobile.img : classNamesWeb.img
              }
            >
              {!this.props.loading ? (
                <div className="TpTc__img--holder">
                  <img src={this.props.imgSrc} alt="Preview" />
                  <div className="TpTc__img--addToPlaylist">
                    <AddItemToPlaylistMenu
                      trackCardNameProp={trackName}
                      trackCardIdProp={queryID}
                    />
                  </div>
                </div>
              ) : (
                <div className="TpTc__img--holderSpinner">
                  <SpinnerDefault />
                </div>
              )}
            </div>
            <div
              className={
                isMobileProp ? classNamesMobile.title : classNamesWeb.title
              }
            >
              <button
                className={
                  isMobileProp
                    ? classNamesMobile.titleButton
                    : classNamesWeb.titleButton
                }
              >
                {trackName}{" "}
              </button>
            </div>
            <div
              className={
                this.props.isMobileProp
                  ? classNamesMobile.tags
                  : classNamesWeb.tags
              }
            >
              {isMobileProp
                ? this.renderTags("mobile")
                : this.renderTags("web")}
            </div>
            <div
              className={
                isMobileProp
                  ? classNamesMobile.description
                  : classNamesWeb.description
              }
            >
              {descriptionTag ? (
                <React.Fragment>
                  <div className="TpTc__descBlocks">
                    <h4 className="TpTc__description--h4">Description:</h4>
                    {config.modules.HTMLDescription === true ? (
                      descriptionTag !== "" && (
                        <div className="TpTc__descriptionHolder">
                          <span
                            id="TpTc__description--quotes"
                            className="TpTc__ckDescription"
                            dangerouslySetInnerHTML={{ __html: descriptionTag }}
                          />
                        </div>
                      )
                    ) : (
                      <span>
                        <q
                          id="TpTc__description--quotes"
                          className="TpTc__ckDescription"
                          dangerouslySetInnerHTML={{ __html: descriptionTag }}
                        />
                      </span>
                    )}
                  </div>
                </React.Fragment>
              ) : (
                " "
              )}

              {descriptionTag2 ? (
                <React.Fragment>
                  <div className="TpTc__descBlocks">
                    <h4 className="TpTc__description--h4">
                      Registration Details:
                    </h4>
                    {config.modules.HTMLDescription2 === true ? (
                      descriptionTag2 !== "" && (
                        <div className="TpTc__descriptionHolder">
                          <span
                            id="TpTc__description--quotes"
                            className="TpTc__ckDescription"
                            dangerouslySetInnerHTML={{
                              __html: descriptionTag2,
                            }}
                          />
                        </div>
                      )
                    ) : (
                      <span>
                        <q
                          id="TpTc__description--quotes"
                          className="TpTc__ckDescription"
                          dangerouslySetInnerHTML={{ __html: descriptionTag2 }}
                        />
                      </span>
                    )}
                  </div>
                </React.Fragment>
              ) : (
                " "
              )}
            </div>{" "}
            <div
              className={
                isMobileProp
                  ? classNamesMobile.downloads
                  : classNamesWeb.downloads
              }
            >
              <DownloadWidgetWithCookies
                config={config}
                idProp={queryID}
                preview_track_url={this.props.preview_track_url}
                track_url={this.props.track_url}
                edit_track_url={this.props.edit_track_url}
                stems_zip_wav_url={this.props.stems_zip_wav_url}
                isUserInternal={this.props.isInternalUser}
                cyanite_id={this.props.cyanite_id}
                cyanite_status={this.props.cyanite_status}
              />
            </div>
            <div
              className={
                isMobileProp ? classNamesMobile.player : classNamesWeb.player
              }
            >
              {!isMobileProp && <hr className="custom_hr" />}
              <div className="TrackCard__player">
                <AudioPlayer
                  songUrl={this.props.preview_track_url}
                  track_length={track_lengthProp}
                  index={this.props.indexProp}
                  waveformDataProp={this.state.waveformData}
                  playFromPicture={false}
                  key={this.props.queryID}
                  type={isMobileProp ? "Tc" : "TpTc"}
                  active={
                    playingIndex !== null &&
                    playingIndex === this.props.indexProp
                  }
                  isCyaniteActive={false}
                  trackCardNameProp={this.props.trackName}
                  srcUrl={this.props.preview_track_image_url}
                />
              </div>
            </div>
          </div>
        )}
      </BrandingContext.Consumer>
    );

    return (
      <div
        className={
          isMobileProp ? classNamesMobile.wrapper : classNamesWeb.wrapper
        }
      >
        {content}
      </div>
    );
  }
}

export default withStyles(styles)(TrackPageTrackCard);
