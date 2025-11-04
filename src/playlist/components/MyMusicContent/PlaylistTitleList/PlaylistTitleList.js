import { Accordion } from "@mui/material";
import { AccordionDetails } from "@mui/material";
import { AccordionSummary } from "@mui/material";
import { withStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { Component, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AudioPlayer from "../../../../common/components/Audiplayer/AudioPlayer.js";
import { getPlaylistById } from "../../../../redux/actions/playListActions/index";
import "../../../../_styles/PlaylistTitleList.css";
import DeleteTrackFromPlaylistMenu from "../../DeleteTrackFromPlaylistMenu/DeleteTrackFromPlaylistMenu";
import PlaylistService from "../../../services/PlaylistService";
import MediaService from "../../../../common/services/MediaService";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import Picture from "../../../../search1/components/AnimatedPicture/AnimatedPicture.js";

import SpotifySearch3 from "../../../../cyanite/components/SpotifySearch3";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper.js";
import ChipWrapper from "../../../../branding/componentWrapper/ChipWrapper.js";
import { FooterMusicPlayerContext } from "../../../../hooks/FooterMusicPlayerContext.js";
import getSortedLabelledTagsArray from "../../../../common/utils/getSortedLabelledTagsArray.js";
import AudioPlayerSH2 from "../../../../common/components/Audiplayer/AudioPlayerSH2.js";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat.js";
import { generateWaveformImage } from "../../../../common/utils/genrateImageFromJsFile.js";
import SimilaritySearchMenu from "../../SimilaritySearchMenu/SimilaritySearchMenu.js";
import TrackTypeBadge from "../../../../search1/components/TrackTypeBadge/TrackTypeBadge.js";
import { formatDuration } from "../../../../common/utils/formatDuration.js";
import TrackCardV3AudioPlayer from "../../../../common/components/Audiplayer/TrackCardV3AudioPlayer/TrackCardV3AudioPlayer.js";
import IconWrapper from "../../../../branding/componentWrapper/IconWrapper.js";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper.js";
import PlayListAccordion from "./PlayListAccordion.js";
import CheckboxWrapper from "../../../../branding/componentWrapper/CheckboxWrapper.js";
import AddToBucket from "../../../../addtobucket/AddToProject.js";
import getMediaBucketPath from "../../../../common/utils/getMediaBucketPath.js";
import AsyncService from "../../../../networking/services/AsyncService.js";
import { showError } from "../../../../redux/actions/notificationActions/notificationActions.js";
import { setPredict } from "../../../../redux/actions/PredictAction/predictAction.js";

//addition by Trupti-Wits

const styles = () => ({
  root: {
    width: "100%",

    color: "var(--color-white)",
    marginBottom: "1rem !important",
    borderRadius: "25px",
    cursor: "default !important",
    "&:hover": {
      cursor: "default !important",
    },
  },
  paper: {
    backgroundColor: "var(--color-bg)",
    color: "var(--color-white)",
    borderRadius: "25px",
    transition: "background-color .2s linear",
    border: "1px solid #404040",
    cursor: "default !important",
    "&:hover": {
      /*     backgroundColor: "#151515", */
      cursor: "default !important",
    },
  },
  // summary: {
  //   cursor: "default !important",
  //   "&:hover": {
  //     cursor: "default !important",
  //   },
  // },
  // link: {
  //   textDecoration: "none",
  //   color: "var(--color-white)",
  //   "&:hover": {
  //     cursor: "pointer",

  //     textDecoration: "underline",
  //   },
  // },
});

class PlaylistTitleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null,
      waveformData: null,
      preview_image_data: null,
      preview_track_data: null,
      showChatIcon: false,
      selectedTrackIds: [],
      project: false,
      isLoading: false,
      creditRequest: null,
      brandType: null,
    };
  }
  // state = {
  //   expanded: null,
  //   waveformData: null,
  //   preview_image_data: null,
  //   preview_track_data: null,
  // };

  handleChange = (panel) => () => {
    this.setState({
      expanded: panel === this.state.expanded ? false : panel,
    });
  };

  deleteTrackFromPlaylistHandler = (playlistId, trackId, algoliaId) => {
    PlaylistService.removeTrack(playlistId, trackId, algoliaId).then(() => {
      this.props?.getPlaylistById(playlistId);
    });
  };

  getWaveFormUrlFromTrack(track) {
    const { waveformData } = this.state;
    let result = waveformData
      ? waveformData.find((wave) => wave?.id === track?.objectID)
      : null;
    return result ? result.url : null;
  }

  getImageUrlFromTrack(trackImg) {
    const { preview_image_data } = this.state;
    let result = preview_image_data
      ? preview_image_data?.find((img) => img?.id === trackImg?.objectID)
      : null;

    return result ? result.url : null;
  }

  redirect = (id) => {
    this.item?.navigate(`/track_page/${id}`);
  };

  handleSelectAll = (e) => {
    const { trackList } = this.props;

    if (e.target.checked) {
      // Select all
      // this.setState({
      //   selectedTrackIds: trackList.map((track) => track.sonichub_track_id),
      // });
      this.setState({
        selectedTrackIds: trackList.map((track) => ({
          trackId: track.sonichub_track_id,
          algoliaId: track.objectID,
        })),
      });
    } else {
      // Deselect all
      this.setState({ selectedTrackIds: [] });
    }
  };

  handleSelectTrack = (trackId, algoliaId, checked) => {
    this.setState((prevState) => {
      if (checked) {
        // prevent duplicates
        const alreadyExists = prevState.selectedTrackIds.some(
          (item) => item.trackId === trackId
        );
        if (alreadyExists) return prevState;

        return {
          selectedTrackIds: [
            ...prevState.selectedTrackIds,
            { trackId, algoliaId },
          ],
        };
      } else {
        // remove the deselected track
        return {
          selectedTrackIds: prevState.selectedTrackIds.filter(
            (item) => item.trackId !== trackId
          ),
        };
      }
    });
  };

  getCreditInfoByCompanyOrBrand = () => {
    let userId = Number(localStorage?.getItem("brandId"));
    if (!userId) return;
    AsyncService.loadData("users/getUserInternalOrExternalUser")
      .then((response) => {
        this.setState({
          brandType: response?.data?.companyType,
        });
        // 1 = "internal" & 2 = "external"
        AsyncService?.loadData(
          `credit/getCreditOfBrand?${
            response?.data?.companyType === 1 ? "brandId" : "companyId"
          }=${response?.data?.companyType === 1 ? userId : response?.data?.id}`
        )
          .then((creditResponse) => {
            this.setState({
              creditRequest: creditResponse?.data?.creditremaining,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  componentDidMount() {
    this.getCreditInfoByCompanyOrBrand();
  }

  render() {
    const {
      trackList = [],
      playlistId,
      classes,
      playingIndex,
      isMobileProp,
      isUnRegistered,
      mCode,
    } = this.props;
    const { expanded } = this.state;
    const { selectedTrackIds } = this.state;
    // Sort Tracklist By Title Name
    if (trackList?.length > 0) {
      trackList.sort(function (a, b) {
        var textA = a?.track_name?.toUpperCase();
        var textB = b?.track_name?.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    }

    //trackList.sort((a, b) => 0.5 - Math.random());

    let tagTrackListArr = trackList?.map((data) => {
      return data?.tags?.reduce((group, tag) => {
        const { category } = tag;
        group[category] = group[category] ?? [];
        group[category].push(tag?.name);
        return group;
      }, {});
    });

    const isAllSelected =
      trackList?.length > 0 && selectedTrackIds.length === trackList.length;

    const selectedAssetTypes =
      trackList
        ?.filter((t) =>
          // this.state.selectedTrackIds.includes(t.sonichub_track_id)
          this.state.selectedTrackIds.some(
            (item) => item.trackId === t.sonichub_track_id
          )
        )
        ?.map((t) => t.asset_type_id) || [];

    // Condition: all selected tracks must share the same asset_type_id
    const allSelectedSameType =
      selectedAssetTypes.length > 0 &&
      selectedAssetTypes.every((id) => id === selectedAssetTypes[0]);

    const canSendToPredict =
      this.state.selectedTrackIds?.length > 0 &&
      this.state.selectedTrackIds?.length <= 10 &&
      this.state.creditRequest > 0 &&
      allSelectedSameType;

    const sendToPredict = () => {
      const trackIds = this.state.selectedTrackIds;
      if (trackIds.length > 0) {
        const dataArr = trackList
          //?.filter((track) => this.state.selectedTrackIds.includes(track.sonichub_track_id))
          ?.filter((track) =>
            this.state.selectedTrackIds.some(
              (item) => item.trackId === track.sonichub_track_id
            )
          )

          .map((track) => ({
            assetType: track?.asset_type_id,
            assetName: (track?.mp3_track || "")?.split("/")[1],
            assetSourceId: track?.strotswar_track_id,
            d_link: getMediaBucketPath(
              track?.mp3_track,
              track?.strotswar_track_id,
              "download"
            ),
            source: 1,
          }));

        if (dataArr?.length) {
          this.props.setPredictData(dataArr);
          this.props.openProject(this.state.selectedTrackIds);
        }
      }
    };

    let content = (
      <FooterMusicPlayerContext.Consumer>
        {({
          playingAudio,
          setPlayingAudio,
          playPause,
          setPlayingIndex,
          setPlayList,
          setPlayListType,
          playListType,
        }) => (
          <>
            <BrandingContext.Consumer>
              {({ config }) =>
                config.modules.UpdateUItoV2 ? (
                  <div
                    className={
                      isMobileProp && window.innerWidth < 768
                        ? "PlayListTitleList__Mobile__container"
                        : "PlayListTitleList__container"
                    }
                  >
                    <div
                      className="custCommentDialogBg"
                      id="custCommentDialogBg"
                    ></div>
                    {/* {!isUnRegistered && config.modules.SpotifySearchBox && (
                      <SpotifySearch3 fromSS={true} />
                    )} */}
                    <div
                      className="Comment_Icon"
                      onClick={() => {
                        Array.from(
                          document.getElementsByClassName(
                            "CommentSection__container"
                          )
                        ).forEach((x) => {
                          x.classList.toggle("chatToggle");
                        });
                        // document
                        //   .getElementsByClassName("CommentSection__container")
                        //   .forEach((x) => x.classList.toggle("chatToggle"));
                        Array.from(
                          document.getElementsByClassName("custCommentDialogBg")
                        ).forEach((x) => {
                          x.style.display = "block";
                          x.style.opacity = "0.8";
                        });
                        Array.from(
                          document.getElementsByClassName(
                            "PlayListTitleList__container"
                          )
                        ).forEach((x) => {
                          x.classList.toggle("tracksToggle");
                        });
                        this.setState({
                          showChatIcon: !this.state.showChatIcon,
                        });

                        if (
                          this.state.showChatIcon ||
                          window.innerWidth > 1024
                        ) {
                          Array.from(
                            document.getElementsByClassName(
                              "custCommentDialogBg"
                            )
                          ).forEach((x) => {
                            x.style.opacity = "0";
                            x.style.display = "none";
                          });
                        }
                      }}
                    >
                      {this.state.showChatIcon ? (
                        <IconButtonWrapper icon="Close" />
                      ) : (
                        <IconButtonWrapper icon="Chat" />
                      )}
                    </div>
                    <div
                      className={
                        isMobileProp && window.innerWidth < 768
                          ? "PlayListTitleList__Mobile__wrapper"
                          : "PlayListTitleList__wrapper"
                      }
                    >
                      {!mCode && trackList.length > 0 && (
                        <div className="playlist-action-bar">
                          <div className="track-checkbox">
                            <CheckboxWrapper
                              name="selectAll"
                              value="selectAll"
                              checked={isAllSelected}
                              onChange={this.handleSelectAll}
                              label="Select All"
                            />
                          </div>
                          <>
                            <ButtonWrapper
                              className="searchHeadBtn"
                              variant="filledSecondary"
                              onClick={sendToPredict}
                              disabled={!canSendToPredict}
                            >
                              Add to Prediction
                            </ButtonWrapper>
                            <ButtonWrapper
                              className="searchHeadBtn"
                              variant="filledSecondary"
                              onClick={() => this.props.openProject()}
                              disabled={selectedTrackIds.length === 0}
                            >
                              Add tracks to Project
                            </ButtonWrapper>
                          </>
                        </div>
                      )}
                      {trackList?.length > 0 ? (
                        trackList?.map((item, index) => (
                          <div
                            key={item.sonichub_track_id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              borderBottom: "0.5px solid var(--color-white)",
                            }}
                          >
                            {/* Track checkbox */}
                            {!mCode && (
                              <CheckboxWrapper
                                name="selectedTracks"
                                value={item.sonichub_track_id}
                                checked={this.state.selectedTrackIds.some(
                                  (t) => t.trackId === item.sonichub_track_id
                                )}
                                // checked={selectedTrackIds.includes(
                                //   item.sonichub_track_id
                                // )}
                                onChange={(e) =>
                                  this.handleSelectTrack(
                                    item.sonichub_track_id,
                                    item.objectID,
                                    e.target.checked
                                  )
                                }
                                label=""
                              />
                            )}

                            {/* Existing accordion */}
                            <PlayListAccordion
                              {...item}
                              isUnRegistered={isUnRegistered}
                              config={config}
                              open={this.state.project}
                              close={() => this.setState({ project: false })}
                              mCode={mCode}
                              playlistId={playlistId}
                              deleteTrackFromPlaylistHandler={
                                (trackid, algoliaId) => {
                                  console.log(
                                    "deleteTrackFromPlaylistHandler",
                                    playlistId,
                                    trackid,
                                    algoliaId
                                  );
                                  this.deleteTrackFromPlaylistHandler(
                                    playlistId,
                                    trackid,
                                    algoliaId
                                  );
                                }
                                // console.log("trackid", trackid)
                              }
                            />
                          </div>
                        ))
                      ) : (
                        <p className="PlayListTitleList__container--noTracks">
                          <FormattedMessage id="playlist.page.noTracks" />
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      isMobileProp && window.innerWidth < 768
                        ? "PlayListTitleList__Mobile__container"
                        : "PlayListTitleList__container"
                    }
                  >
                    <div
                      className={
                        isMobileProp && window.innerWidth < 768
                          ? "PlayListTitleList__Mobile__wrapper"
                          : "PlayListTitleList__wrapper" //added new class name instead of null
                      }
                    >
                      {trackList?.map((item, index) => (
                        <div
                          className={classes.root}
                          id="playlist_Item_Paper"
                          key={index}
                        >
                          <Accordion
                            key={item.objectID}
                            className={classes.paper}
                            expanded={expanded === `panel${item.objectID}`}
                          >
                            <AccordionSummary className={classes.summary}>
                              {/* <div className="PlayListTitleList__Item">
                                <AudioPlayerSH2
                                  // songUrl={item.preview_track_url}
                                  track_length={item.duration_in_sec}
                                  isUnRegistered={isUnRegistered}
                                  mCode={mCode}
                                  index={item.objectID}
                                  type="Tc"
                                  active={
                                    playingIndex !== null &&
                                    playingIndex === item.objectID
                                  }
                                  trackCardNameProp={item.track_name}
                                  srcUrl={item.detail_image_url}
                                  fromPlaylist={true}
                                  playIndex={index}
                                  trackList={trackList}
                                  playingAudio={playingAudio}
                                  setPlayingAudio={setPlayingAudio}
                                  playPause={playPause}
                                  setPlayList={setPlayList}
                                  setPlayingIndex={setPlayingIndex}
                                  setPlayListType={setPlayListType}
                                  playListType={playListType}
                                  imgSrc={item.detail_image_url}
                                  wavefile={item?.wave_form_js}
                                  waveformJSData={item?.waveformJSData}
                                  trackId={item?.trackId}
                                  key={item?.objectID}
                                  source_id={item?.asset_processed_id}
                                  strotswar_track_id={item?.strotswar_track_id}
                                />

                                <div className="PlayListTitleList__Extra">
                                  {!isUnRegistered ? (
                                    <Link
                                      to={`/track_page/${item.objectID}`}
                                      className={`${classes.link} activeColorHover`}
                                    >
                                      {item.track_name}
                                    </Link>
                                  ) : (
                                    <span className={`${classes.link}`}>
                                      {item.track_name}
                                    </span>
                                  )}

                                  <div
                                    className="PlayListTitleList__Extra--actions"
                                    style={{
                                      width: isUnRegistered ? "auto" : "10%",
                                    }}
                                  >
                                    {!isUnRegistered && (
                                      <DeleteTrackFromPlaylistMenu
                                        deleteTrackHandlerProp={() =>
                                          this.deleteTrackFromPlaylistHandler(
                                            playlistId,
                                            item.objectID
                                          )
                                        }
                                      />
                                    )}

                                    <ExpandMoreIcon
                                      onClick={this.handleChange(
                                        `panel${item.objectID}`
                                      )}
                                      className="PlayListTitleList__Extra--expansionIcon"
                                      style={{
                                        transform:
                                          expanded === `panel${item.objectID}`
                                            ? "rotate(180deg) scale(1.8)"
                                            : "rotate(0deg) scale(1.8)",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div> */}
                            </AccordionSummary>
                            <AccordionDetails className={classes.summary}>
                              <div className="TrackCard__item__tags">
                                {trackList?.[index]?.tags?.map((tag, index) => {
                                  return <span key={index}>{tag.name}</span>;
                                })}{" "}
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
            </BrandingContext.Consumer>
          </>
        )}
      </FooterMusicPlayerContext.Consumer>
    );

    if (trackList?.length === 0) {
      content = (
        <div className="PlayListTitleList__container">
          <p className="PlayListTitleList__container--noTracks">
            <FormattedMessage id="playlist.page.noTracks" />
          </p>
        </div>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPlaylistById: (id) => dispatch(getPlaylistById(id)),
    setPredictData: (data) => dispatch(setPredict(data)),
  };
};

const mapStateToProps = (state) => {
  return {
    playingIndex: state.player.playingIndex,
    predict: state.predict,
  };
};

export default withStyles(styles)(
  withRouterCompat(
    connect(mapStateToProps, mapDispatchToProps)(PlaylistTitleList)
  )
);
