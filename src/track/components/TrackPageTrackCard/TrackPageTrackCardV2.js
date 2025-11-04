import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { withStyles } from "@mui/styles";
import React, { Component } from "react";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import AudioPlayer from "../../../common/components/Audiplayer/AudioPlayer";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import MediaService from "../../../common/services/MediaService";
import AddItemToPlaylistMenuV2 from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenuV2";
import "../../../_styles/TpTc.css";
import "./TrackPageTrackCardV2.css";
import DownloadWidgetWithCookiesV2 from "./DownloadWidgetWithCookiesV2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EditSection from "../../pages/EditSection";
import PlayListCoverPictue from "../../../playlist/components/MyMusicContent/PlayListCoverPicture/PlayListCoverPictue";
import backButton from "../../../static/slick-prev-svg.svg";
import SpotifySearch3 from "../../../cyanite/components/SpotifySearch3";
import { Typography } from "@mui/material";
import DownloadWidgetWithCookiesV2Dialog from "./DownloadWidgetWithCookiesV2Dialog";
import { Link } from "react-router-dom";
import UsedInVideo from "../UsedInVideo/UsedInVideo";
import getConfigJson from "../../../common/utils/getConfigJson";
import getEnabledAmpMainMoodTagsByTrackId from "../../../cyanite/services/getEnabledAmpMainMoodTagsByTrackId";
import getEnabledSonicLogoMainMoodTagsByTrackId from "../../../cyanite/services/getEnabledSonicLogoMainMoodTagsByTrackId";
import { connect } from "react-redux";
import AsyncService from "../../../networking/services/AsyncService";
import getSortedLabelledTagsArray from "../../../common/utils/getSortedLabelledTagsArray";
import SimilaritySearchMenu from "../../../playlist/components/SimilaritySearchMenu/SimilaritySearchMenu";
import ChipWrapper from "../../../branding/componentWrapper/ChipWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { FooterMusicPlayerContext } from "../../../hooks/FooterMusicPlayerContext";
import appendCSUrlParams from "../../../common/utils/appendCSUrlParams";
import { getUserId } from "../../../common/utils/getUserAuthMeta";

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

class TrackPageTrackCardV2 extends Component {
  state = {
    loading: true,
    preview_image_data: null,
    waveformData: null,
    propsLoaded: false,
    trackUsedInPlaylist: null,
    trackUsedInCuratedPlaylist: null,
    coverImage: null,
    usedInVideoData: null,
    trackTags: [],
  };

  getUsedInVideoData = (trackId) => {
    AsyncService.loadData(`/newVideo/getByTrackId/${trackId}`)
      .then((res) => {
        this.setState({
          usedInVideoData: res.data,
        });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  getPlaylistData = (trackId) => {
    const USER_ID = getUserId();
    AsyncService.loadData(`/playlists/playlistTrackName/${trackId}`)
      .then((res) => {
        let response = res.data;
        if (!Array.isArray(response)) {
          response = [];
        }
        this.trackInPlaylist = response.filter((eachVal) => {
          let opt = eachVal.members.some(({ id }) => +id === +USER_ID);
          return opt;
        });

        this.trackInCuratedPlaylist = response.filter((eachVal) => {
          let opt = eachVal.members.some(
            ({ id }) =>
              +id === Number(localStorage.getItem("playlistCuratorId"))
          );

          return opt;
        });

        try {
          if (response.coverImage !== null) {
            this.coverImage = response.coverImage;
          }
        } catch (error) {
          console.log("trackpagetrackcardV2 - catch cover image");
        }

        this.setState({
          trackUsedInPlaylist: this.trackInPlaylist || [],
          trackUsedInCuratedPlaylist: this.trackInCuratedPlaylist || [],
          coverImage: this.coverImage,
        });
      })
      .catch(() => {
        console.log("error while catching used in playlist data");
        this.setState({
          trackUsedInPlaylist: [],
          trackUsedInCuratedPlaylist: [],
        });
      });
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

  getAmpMainMoodTags = (trackId) => {
    getEnabledAmpMainMoodTagsByTrackId({
      trackId,
      onSuccess: (responseTags) => {
        this.setState({
          trackTags: responseTags?.data,
        });
      },
    });
  };

  getSonicLogoMainMoodTags = (trackId) => {
    getEnabledSonicLogoMainMoodTagsByTrackId({
      trackId,
      onSuccess: (responseTags) => {
        this.setState({
          trackTags: responseTags?.data,
        });
      },
    });
  };

  componentDidMount() {
    // console.log("trackId", this.props.indexProp);
    setTimeout(() => {
      if (this.props.indexProp) {
        this.getUsedInVideoData(this.props.indexProp);
        // this.getPlaylistData(this.props.indexProp);
        if (this.props.isSonicLogo) {
          this.getSonicLogoMainMoodTags(this.props.indexProp);
        } else {
          this.getAmpMainMoodTags(this.props.indexProp);
        }
      }
    }, 500);
    this.setState({
      propsLoaded: false,
    });
  }

  // renderListUsedInPlaylist() {
  //   const content = (
  //     <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
  //       {this.state.trackUsedInPlaylist?.length !== 0 && (
  //         <div className="usedInPlaylistContainer">
  //           <h4 className="usedInPlaylistHeading">My Playlists</h4>
  //           <ul className="usedInPlaylistItemsContainer">
  //             {this.state.trackUsedInPlaylist?.map((data, index) => {
  //               return (
  //                 <li
  //                   className="usedInPlaylistItems"
  //                   key={`usedInPlaylistItems-${index}`}
  //                 >
  //                   <PlayListCoverPictue
  //                     // className="trackslider_image-playlist"
  //                     // style={{
  //                     //   width: "100%",
  //                     //   height: "100%",
  //                     //   objectFit: "cover",
  //                     // }}
  //                     imagesData={this.state.trackUsedInPlaylist?.[index].tracks
  //                       .map((item) => item.preview_image_url)
  //                       .splice(0, 4)}
  //                     isUnRegistered={false}
  //                     coverImage={
  //                       this.state.trackUsedInPlaylist?.[index]?.cover_image !==
  //                       null
  //                         ? [
  //                             this.state.trackUsedInPlaylist?.[index]
  //                               .cover_image,
  //                           ]
  //                         : ""
  //                     }
  //                     curatorCover={
  //                       this.state.trackUsedInPlaylist?.[index].cover_image !==
  //                       null
  //                         ? true
  //                         : false
  //                     }
  //                   />
  //                   <Link
  //                     to={`/mymusic/${data?.id}`}
  //                     style={{
  //                       textDecoration: "none",
  //                       color: "var(--color-white)",
  //                     }}
  //                     className="playlist_name"
  //                   >
  //                     <p title={data.name.replace(/%20/g, " ").toString()}>
  //                       {data.name.replace(/%20/g, " ").toString()}
  //                     </p>
  //                   </Link>
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //         </div>
  //       )}
  //       {this.state.trackUsedInCuratedPlaylist?.length !== 0 && (
  //         <div className="usedInPlaylistContainer">
  //           <h4 className="usedInPlaylistHeading">Curated Playlist</h4>
  //           <ul className="usedInPlaylistItemsContainer">
  //             {this.state.trackUsedInCuratedPlaylist?.map((data, index) => {
  //               return (
  //                 <li
  //                   className="usedInPlaylistItems"
  //                   key={`usedInPlaylistItems-${index}`}
  //                 >
  //                   <PlayListCoverPictue
  //                     // className="trackslider_image-playlist"
  //                     imagesData={this.state.trackUsedInCuratedPlaylist?.[
  //                       index
  //                     ].tracks
  //                       .map((item) => item.preview_image_url)
  //                       .splice(0, 4)}
  //                     isUnRegistered={false}
  //                     coverImage={
  //                       this.state.trackUsedInCuratedPlaylist?.[index]
  //                         .cover_image !== null
  //                         ? [
  //                             this.state.trackUsedInCuratedPlaylist?.[index]
  //                               .cover_image,
  //                           ]
  //                         : ""
  //                     }
  //                     curatorCover={
  //                       this.state.trackUsedInCuratedPlaylist?.[index]
  //                         .cover_image !== null
  //                         ? true
  //                         : false
  //                     }
  //                   />

  //                   <span title={unescape(data.name)}>
  //                     {unescape(data.name)}
  //                   </span>
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //   );
  //   return content;
  // }

  renderTags(type) {
    const content = (
      <div className="TrackCard__item__tags Track__details__tag__container">
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
          {this.props?.instrumentTags &&
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

  renderTaxonomyTopMainTags(type, tags) {
    if (!tags || tags?.length === 0) return;
    let tagsToDisplay = [...tags];
    let tagsTop10 = tagsToDisplay
      ?.sort((a, b) => b.value - a.value)
      .slice(0, 10)
      ?.map((data) => data.label);
    const content = (
      <div className="TrackCard__item__tags Track__details__tag__container taxonomy__tag__container">
        {tagsTop10?.map((item) => {
          // return <span key={item.toString()}>{item}</span>;
          return <ChipWrapper key={item.toString()} label={item} />;
        })}
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

  renderTaxonomyTopTags(type, tags) {
    if (!tags || tags?.length === 0) return;

    let tagsType = this.props.isSonicLogo
      ? "SONIC_LOGO_MOOD_TAGS"
      : "AMP_MOOD_TAGS";
    let labeledTags = getSortedLabelledTagsArray(tags, tagsType) || [];

    const content = (
      <div className="TrackCard__item__tags Track__details__tag__container taxonomy__tag__container">
        {labeledTags?.map((item) => {
          // return <span key={item.toString()}>{item}</span>;
          return <ChipWrapper key={item.toString()} label={item} />;
        })}
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
      track_lyrics,
      track_cs_status,
      track_flaxid,
      csToSsStatus,
    } = this.props;
    let content = (
      <FooterMusicPlayerContext.Consumer>
        {({
          playingAudio,
          setPlayingAudio,
          playPause,
          setPlayList,
          setPlayingIndex,
          setPlayListType,
        }) => (
          <>
            <BrandingContext.Consumer>
              {({ config, jsonConfig }) => (
                <div>
                  <div className="TpTc__container__trackDetails">
                    <div className="TpTc__container_siderbar">
                      <div
                        className="detailsPage__BackButton"
                        style={{ visibility: "hidden" }}
                      >
                        <div className="backButton">
                          <img src={backButton} alt={backButton} />
                        </div>
                      </div>

                      <div
                        className={
                          isMobileProp
                            ? classNamesMobile.img
                            : classNamesWeb.img
                        }
                      >
                        {!this.props.loading ? (
                          <div>
                            <div className="TpTc__img--holder">
                              <img src={this.props.imgSrc} alt="Preview" />
                            </div>
                          </div>
                        ) : (
                          <div className="TpTc__img--holderSpinner">
                            <SpinnerDefault />
                          </div>
                        )}
                      </div>

                      <div className="trackButtonAction">
                        <div className="downloadButton">
                          <div
                            className={
                              isMobileProp
                                ? classNamesMobile.downloads
                                : classNamesWeb.downloads
                            }
                          >
                            {config.modules.showBasketDownload ? (
                              <DownloadWidgetWithCookiesV2Dialog
                                config={config}
                                idProp={queryID}
                                trackName={trackName}
                                track_type_id={this.props.track_type_id}
                                preview_track_url={this.props.preview_track_url}
                                track_url={this.props.track_url}
                                edit_track_url={this.props.edit_track_url}
                                stems_zip_wav_url={this.props.stems_zip_wav_url}
                                isUserInternal={this.props.isInternalUser}
                                cyanite_id={this.props.cyanite_id}
                                cyanite_status={this.props.cyanite_status}
                              />
                            ) : (
                              <DownloadWidgetWithCookiesV2
                                config={config}
                                idProp={queryID}
                                preview_track_url={this.props.preview_track_url}
                                track_url={this.props.track_url}
                                edit_track_url={this.props.edit_track_url}
                                stems_zip_wav_url={this.props.stems_zip_wav_url}
                                isUserInternal={this.props.isInternalUser}
                                cyanite_id={this.props.cyanite_id}
                                cyanite_status={this.props.cyanite_status}
                                trackName={this.props.trackName}
                              />
                            )}
                          </div>
                        </div>
                        <div className="addToPlaylistButton">
                          <AddItemToPlaylistMenuV2
                            trackCardNameProp={trackName}
                            trackCardIdProp={queryID}
                          />
                        </div>

                        {this.props.cyanite_id !== null &&
                          config.modules.SimilaritySearchBtn && (
                            <div className="similarTracksButton">
                              <SimilaritySearchMenu
                                cyaniteId={this.props.cyanite_id}
                                trackId={queryID}
                              />
                            </div>
                          )}
                      </div>

                      {track_cs_status && this.props?.userMeta?.isCSUser && (
                        <div className="trackButtonAction">
                          <ButtonWrapper
                            size="s"
                            data-flaxid={track_flaxid}
                            onClick={() => {
                              const urlToNavigate = `${
                                process.env.NODE_ENV === "development"
                                  ? "http://localhost:3098"
                                  : jsonConfig?.CS_BASE_URL
                              }/work-space/project-settings/${encodeURIComponent(
                                track_flaxid
                              )}?${appendCSUrlParams()}&is-cs-track=${
                                !!csToSsStatus ? "1" : "0"
                              }`;
                              try {
                                localStorage.setItem("CSLoggingOut", "false");
                                window.open(urlToNavigate, "_self");
                              } catch (error) {}
                            }}
                          >
                            Edit Track
                          </ButtonWrapper>
                        </div>
                      )}

                      <div className="accordian">
                        {(!!descriptionTag || !!descriptionTag2) && (
                          <Accordion>
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon
                                  className={this.props.classes.icon}
                                />
                              }
                              aria-controls="panel2a-content"
                              id="panel2a-header"
                            >
                              Details
                            </AccordionSummary>
                            <AccordionDetails>
                              {" "}
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
                                      <h4 className="TpTc__description--h4">
                                        Description:
                                      </h4>
                                      {config.modules.HTMLDescription ===
                                      true ? (
                                        descriptionTag !== "" && (
                                          <div className="TpTc__descriptionHolder">
                                            <span
                                              id="TpTc__description--quotes"
                                              className="TpTc__ckDescription"
                                              dangerouslySetInnerHTML={{
                                                __html: descriptionTag,
                                              }}
                                            />
                                          </div>
                                        )
                                      ) : (
                                        <span>
                                          <q
                                            id="TpTc__description--quotes"
                                            className="TpTc__ckDescription"
                                            dangerouslySetInnerHTML={{
                                              __html: descriptionTag,
                                            }}
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
                                      {config.modules.HTMLDescription2 ? (
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
                                            dangerouslySetInnerHTML={{
                                              __html: descriptionTag2,
                                            }}
                                          />
                                        </span>
                                      )}
                                    </div>
                                  </React.Fragment>
                                ) : (
                                  " "
                                )}
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        )}
                        {process.env
                          .REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER ? (
                          <>
                            {/* {this.state.trackTags?.length !== 0 && ( */}
                            {this.props.topTags &&
                              this.props.topTags?.length !== 0 && (
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={
                                      <ExpandMoreIcon
                                        className={this.props.classes.icon}
                                      />
                                    }
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                  >
                                    {`Top ${this.props.topTags?.length} Tags`}
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <div
                                      className={
                                        this.props.isMobileProp
                                          ? classNamesMobile.tags
                                          : classNamesWeb.tags
                                      }
                                    >
                                      {isMobileProp
                                        ? // ? this.renderTaxonomyTopMainTags(
                                          this.renderTaxonomyTopTags(
                                            "mobile",
                                            // this.state.trackTags
                                            this.props.topTags
                                          )
                                        : // : this.renderTaxonomyTopMainTags(
                                          this.renderTaxonomyTopTags(
                                            "web",
                                            // this.state.trackTags
                                            this.props.topTags
                                          )}
                                    </div>
                                  </AccordionDetails>
                                </Accordion>
                              )}
                          </>
                        ) : (
                          <Accordion>
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon
                                  className={this.props.classes.icon}
                                />
                              }
                              aria-controls="panel2a-content"
                              id="panel2a-header"
                            >
                              Tags
                            </AccordionSummary>
                            <AccordionDetails>
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
                            </AccordionDetails>
                          </Accordion>
                        )}

                        {/* {config.modules.showUsedInPlaylist && (
                          <>
                            {(this.state.trackUsedInPlaylist?.length !== 0 ||
                              this.state.trackUsedInCuratedPlaylist?.length !==
                                0) &&
                            this.state.trackUsedInPlaylist !== null ? (
                              <Accordion>
                                <AccordionSummary
                                  expandIcon={
                                    <ExpandMoreIcon
                                      className={this.props.classes.icon}
                                    />
                                  }
                                  aria-controls="panel2a-content"
                                  id="panel2a-header"
                                >
                                  Used In Playlists
                                </AccordionSummary>
                                <AccordionDetails>
                                  {this.renderListUsedInPlaylist()}
                                </AccordionDetails>
                              </Accordion>
                            ) : null}
                          </>
                        )} */}
                      </div>
                    </div>
                    <div className="TpTc__container__main">
                      <div className="custTrackDetails_TitleHolder">
                        {config.modules.SpotifySearchBox && (
                          <div className="searchHolder">
                            <SpotifySearch3 fromSS={true} />
                          </div>
                        )}
                        <div className="TrackTitle" title={trackName}>
                          {trackName}
                        </div>
                        <div style={{ clear: "both" }}></div>
                      </div>

                      <div
                        className={
                          isMobileProp
                            ? classNamesMobile.player
                            : classNamesWeb.player
                        }
                      >
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
                            playingAudio={playingAudio}
                            setPlayingAudio={setPlayingAudio}
                            playPause={playPause}
                            setPlayList={setPlayList}
                            setPlayingIndex={setPlayingIndex}
                            setPlayListType={setPlayListType}
                          />
                        </div>
                      </div>

                      {config.modules.CyaniteProfile && (
                        <div className="CyaniteProfileSection">
                          {this.props.renderCyaniteProfileSection(
                            this.state.trackTags,
                            this.props.isSonicLogo
                          )}
                        </div>
                      )}
                      {config.modules.showTrackLyrics && track_lyrics && (
                        <Accordion className="lyricsAccordion">
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography
                              variant="body1"
                              className="lyricsHeader"
                            >
                              Lyrics
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="TpTc__descBlocks">
                              {config.modules.HTMLDescription2 === true ? (
                                track_lyrics !== "" && (
                                  <div className="TpTc__descriptionHolder">
                                    <span
                                      id="TpTc__description--quotes"
                                      className="TpTc__ckDescription"
                                      dangerouslySetInnerHTML={{
                                        __html: track_lyrics,
                                      }}
                                    />
                                  </div>
                                )
                              ) : (
                                <span>
                                  <q
                                    id="TpTc__description--quotes"
                                    className="TpTc__ckDescription"
                                    dangerouslySetInnerHTML={{
                                      __html: track_lyrics,
                                    }}
                                  />
                                </span>
                              )}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      )}
                      <div className="UserInAndMasterContainer">
                        {config.modules.showUsedInVideos && (
                          <div className={`UsedInOuterContainer`}>
                            {/* {this.props.videos?.length !== 0 ? (
                        <div className="UsedInInnerContainer">
                          {this.props.renderUsedInSection(this.props.videos)}
                        </div>
                      ) : ( */}
                            {this.state.usedInVideoData?.length !== 0 ? (
                              <div className="UsedInInnerContainer">
                                <h3
                                  className="usedInTitle"
                                  style={{ margin: "0px 0px 25px" }}
                                >
                                  USED IN :
                                </h3>
                                {this.state.usedInVideoData?.map(
                                  (usedInData, index) => (
                                    <UsedInVideo
                                      data={usedInData}
                                      key={`UsedInVideo_item_${index}`}
                                    />
                                  )
                                )}
                              </div>
                            ) : (
                              <div>
                                <div className="usedInMessageContainer">
                                  <h3 className="usedInTitle">USED IN :</h3>
                                  <span className="usedInMessage">
                                    Not Used Yet
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {this.props.hasMaster || this.props.hasEdits ? (
                          <div className="masterOuterContainer">
                            <div className="masterInnerContainer">
                              <EditSection
                                hasEdits={this.props.hasEdits}
                                hasMaster={this.props.hasMaster}
                                editResults={this.props.editResults}
                                masterResults={this.props.masterResults}
                                playingIndex={this.props.playingIndex}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="masterOuterContainer">
                            <h3 className="usedInTitle">MASTER :</h3>
                            <span className="usedInMessage">
                              No tracks found
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </BrandingContext.Consumer>
          </>
        )}
      </FooterMusicPlayerContext.Consumer>
    );

    return (
      <>
        <div
          className={
            isMobileProp ? classNamesMobile.wrapper : classNamesWeb.wrapper
          }
        >
          {content}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    downloadBasket: state.downloadBasket,
    userMeta: state.userMeta,
  };
};

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(TrackPageTrackCardV2));
