import { withStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import React, { Component, useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { FormattedMessage } from "react-intl";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import "../../../_styles/MemberCard.css";
import CommentSection from "../CommentSection/CommentSection";
import PlayListMembers from "../PlaylistMembers";
import PlayListMembersGuest from "../PlaylistMembers/Unregistered";
import PlayListCoverPictue from "./PlayListCoverPicture/PlayListCoverPictue";
import PlayListMeta from "./PlayListMeta/PlayListMeta";
import PlaylistTitleList from "./PlaylistTitleList/PlaylistTitleList";
import MyMusicSideBar from "../MyMusicSideBar/MyMusicSideBar";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { ResponsiveTabletViewCondition768 } from "../../../common/utils/ResponsiveTabletViewCondition";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import { connect } from "react-redux";

import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";
import PlaylistService from "../../services/PlaylistService";
import { addPlaylistToDownloadBasket } from "../../../redux/actions/trackDownloads/tracksDownload";
import MediaService from "../../../common/services/MediaService";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";
import AddToBucket from "../../../addtobucket/AddToProject";
import { getUserId } from "../../../common/utils/getUserAuthMeta";
import { SwipeableDrawer } from "@mui/material";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import { useNavigate } from "react-router-dom";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";

//addition by Trupti-Wits

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const styles = {
  paper: {
    background: "#060606",
    color: "var(--color-white)",
  },
};

let BREAKPOINT;

const MyMusicContent = (props) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [project, setProject] = useState(false);
  let navigate = useNavigate();

  const { config } = React.useContext(BrandingContext);

  const {
    loadingProp,
    dataProp,
    playlistDoesntExistProp,
    classes,
    isUnRegistered,
    mCode,
    chkPlaylistID,
    showError,
    addPlaylistToDownloadBasket,
    downloadBasket,
  } = props;
  console.log("dataProp", dataProp);
  const updatePredicate = useCallback(() => {
    setIsDesktop(window.innerWidth > BREAKPOINT);
  }, []);

  // componentDidMount + componentWillUnmount
  useEffect(() => {
    if (!props.config.modules.UpdateUItoV2) {
      BREAKPOINT = 1915;
    } else {
      BREAKPOINT = 767;
    }
    updatePredicate();

    window.addEventListener("resize", updatePredicate);
    return () => {
      window.removeEventListener("resize", updatePredicate);
    };
  }, [props.config.modules.UpdateUItoV2, updatePredicate]);

  const triggerPlaylistDownloadCount = useCallback((id) => {
    if (!id) {
      return console.error(
        "something went wrong triggering the Download Counter"
      );
    } else {
      PlaylistService.triggerPlaylistDownloadCount(id).catch((e) =>
        console.error(e, "something went wrong triggering the Download Counter")
      );
    }
  }, []);

  const toggleDrawer = useCallback(() => {
    setSideDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setSideDrawerOpen(false);
  }, []);

  const downloadZip = useCallback(
    async (_name, _tracksArray, playlistId) => {
      const urls = _tracksArray;
      const zip = new JSZip();
      let count = 0;
      const zipFilename = _name + "_tracks.zip";

      for (const url of urls) {
        let fileUrl = await MediaService.getMp3(url);

        try {
          const file = await JSZipUtils.getBinaryContent(fileUrl);
          zip.file(url, file, { binary: true });
          count++;
          if (count === urls?.length) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              saveAs(content, zipFilename);
              setDownloadLoading(false);
              triggerPlaylistDownloadCount(playlistId);
            });
          }
        } catch (err) {
          showError("Something went wrong...");
          console.log(err);
        }
      }
    },
    [showError, triggerPlaylistDownloadCount]
  );

  const addPlaylistToBasket = useCallback(
    (TracksToAddInBasket) => {
      if (TracksToAddInBasket && TracksToAddInBasket.length > 0) {
        setProject(true);

        let newTracksInDownloadBasket =
          downloadBasket?.tracksInDownloadBasket?.filter(
            (data) => !data?.isDownloadInProgress
          );
        const tracksInplaylistAndCookie = newTracksInDownloadBasket?.filter(
          (object1) => {
            return TracksToAddInBasket.some(
              (object2) =>
                object1.id === object2.id &&
                object1.audio_type === object2.audio_type
            );
          }
        );

        if (tracksInplaylistAndCookie?.length === TracksToAddInBasket?.length) {
          showError("Playlist already in project.");
        }

        addPlaylistToDownloadBasket(TracksToAddInBasket);
      } else {
        showError("Playlist is Empty");
        setProject(false);
      }
    },
    [downloadBasket, addPlaylistToDownloadBasket, showError]
  );

  const renderMobileMembers = () => (
    <>
      <PlayListMembers dataProp={props.dataProp} isMobileProp={true} />
      <PlayListMembersGuest dataProp={props.dataProp} isMobileProp={true} />
    </>
  );

  const renderWebMembers = () => (
    <>
      <PlayListMembers dataProp={props.dataProp} isMobileProp={false} />
      <PlayListMembersGuest dataProp={props.dataProp} isMobileProp={false} />
    </>
  );

  const addPredictToBasket = (Ids) => {
    setProject(true);
    const shareSelectedPredictIdsToProject = Ids?.map((e) => ({
      id: e?.trackId?.toString(),
      audio_type: "MP3",
      checked: 0,
      algoliaId: e?.algoliaId || "",
    }));

    addPlaylistToDownloadBasket(shareSelectedPredictIdsToProject);
  };

  // ================= RENDER =================
  let playlistDetails = "";
  if (dataProp !== null)
    playlistDetails =
      dataProp.details !== null ? dataProp.details : dataProp.details1;

  let content = (
    <div className="MyMusic__Loading">
      <SpinnerDefault />
    </div>
  );

  let isUnregistered = props.isUnRegistered;

  if (
    loadingProp === true &&
    dataProp === null &&
    playlistDoesntExistProp === true
  ) {
    content = (
      <div className="MyMusic__Loading">
        <h1 style={{ textAlign: "center", marginTop: "50px" }}>
          <FormattedMessage id="playlist.page.notExists" />
        </h1>
      </div>
    );
  }

  if (
    loadingProp === false &&
    dataProp !== null &&
    playlistDoesntExistProp === false
  ) {
    let amountOfTracks = 0;
    let ImagesArray = null;
    let coverImage = dataProp?.cover_image;
    let TracksArray = null;
    let TracksToAddInBasket = null;

    if (
      !(
        Object.entries(dataProp)?.length === 0 &&
        dataProp.constructor === Object
      )
    ) {
      amountOfTracks = dataProp.tracks?.length;
      ImagesArray = dataProp.tracks
        ?.map((item) =>
          getMediaBucketPath(item?.preview_image, item?.source_id, "image")
        )
        .splice(0, 4);
      TracksArray = dataProp.tracks?.map((item) => item.preview_track_url);
      TracksToAddInBasket = dataProp.tracks?.map((item) => {
        const getSonicTrackId = (hit) => {
          let serverName = "";
          //console.log("Using Algolia index:", indexName, brandId);
          if (getSuperBrandName() === brandConstants.WPP) {
            const { config } = React.useContext(BrandingContext);
            serverName = config.modules.ServerName;
          } else {
            serverName = window.globalConfig?.SERVER_NAME;
          }
          if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
            if (Array.isArray(hit?.facet_sonic_track_id)) {
              const match = hit.facet_sonic_track_id.find((id) =>
                id.startsWith(serverName + ":")
              );
              return match ? Number(match.split(":")[1]) || null : null;
            }
            return null;
          }
          return Number(hit?.sonichub_track_id) || null;
        };
        return {
          id: getSonicTrackId(item).toString(),
          audio_type: "MP3",
          checked: 0,
          algoliaId: item?.objectID || "",
        };
      });
    }

    content = (
      <>
        {!mCode && (
          <div className="MyMusicContent_header-left">
            <span
              className="MyMusicContent_back-button"
              onClick={() => navigate("/playlist/")}
            >
              <span className="MyMusicContent_back-arrow">
                <IconWrapper icon={"Back"} />
              </span>
              Back to Playlists
            </span>
          </div>
        )}
        <AddToBucket
          open={project}
          setOpen={() => setProject(!project)}
          type="Download"
          playList={isUnRegistered ? playlistDetails?.name : dataProp?.name}
        />
        <PlaylistTitleList
          trackList={dataProp?.tracks}
          playlistId={chkPlaylistID}
          isMobileProp={isMobile}
          isUnRegistered={isUnregistered}
          mCode={mCode}
          openProject={(data) => {
            !!data
              ? addPredictToBasket(data)
              : (setProject(true), addPlaylistToBasket(TracksToAddInBasket));
          }}
          closeProject={() => setProject(false)}
        />

        {ResponsiveTabletViewCondition768() ? (
          <>
            <PlayListCoverPictue
              imagesData={ImagesArray}
              isMobileProp={isMobile}
              isUnRegistered={isUnregistered}
              mCode={mCode}
              coverImage={coverImage !== null ? [coverImage] : ""}
              curatorCover={coverImage !== null}
            />
            {!isUnRegistered &&
              config.modules.DownloadPlaylistTracks &&
              TracksArray?.length !== 0 &&
              TracksToAddInBasket?.length > 0 && (
                <div
                  className={"download_zip_button_wrapper"}
                  style={{ marginBottom: "20px" }}
                >
                  <ButtonWrapper
                    size="s"
                    onClick={() => {
                      addPlaylistToDownloadBasket();
                    }}
                  >
                    Add to project
                  </ButtonWrapper>
                </div>
              )}
            <PlayListMeta
              playListName={
                isUnRegistered ? playlistDetails.name : dataProp.name
              }
              playListDescription={
                isUnRegistered
                  ? playlistDetails.description
                  : dataProp.description
              }
              amountOfTracksProps={amountOfTracks}
              amountOfMembersProp={dataProp.members}
              playlistId={dataProp.id}
              isMobileProp={isMobile}
              isUnRegistered={isUnregistered}
            />
          </>
        ) : (
          <div
            id="stickyContainer"
            style={{ borderRight: "0.5px solid var(--color-white)" }}
          >
            <PlayListMeta
              imagesData={ImagesArray}
              isUnRegistered={isUnregistered}
              mCode={mCode}
              isOwner={
                (playlistDetails?.ownerId || dataProp?.ownerId) ===
                Number(getUserId())
              }
              coverImage={!!coverImage ? [coverImage] : ""}
              curatorCover={!!coverImage}
              playListName={playlistDetails?.name || dataProp?.name}
              playListDescription={
                playlistDetails?.description || dataProp?.description
              }
              playListCoverImage={
                playlistDetails?.cover_image || dataProp?.cover_image
              }
              amountOfTracksProps={amountOfTracks}
              amountOfMembersProp={dataProp?.members}
              playlistId={chkPlaylistID}
              PlaylistByIdData={dataProp?.PlaylistByIdData}
            />

            {/* {!isUnRegistered &&
              config.modules.DownloadPlaylistTracks &&
              TracksArray?.length !== 0 &&
              TracksToAddInBasket?.length > 0 && (
                <div className={"download_zip_button_wrapper"} style={{ marginBottom: "20px" }}>
                  <ButtonWrapper size="s" onClick={() => addPlaylistToBasket(TracksToAddInBasket)}>
                    Add to project
                  </ButtonWrapper>
                </div>
              )} */}
            {!isUnRegistered && renderWebMembers()}
            {config.modules.UpdateUItoV2
              ? !isUnregistered && (
                  <div className="MyMusic__SideBar">
                    {/* <MyMusicSideBar /> */}
                  </div>
                )
              : null}
          </div>
        )}

        {isDesktop ? (
          <CommentSection
            playlistID={chkPlaylistID}
            isUnRegistered={isUnregistered}
            mCode={mCode}
          />
        ) : (
          <>
            <SwipeableDrawer
              open={sideDrawerOpen}
              onClose={toggleDrawer}
              anchor="right"
              classes={{ paper: classes.paper }}
              disableBackdropTransition={!iOS}
              disableDiscovery={iOS}
            >
              {ResponsiveTabletViewCondition768()
                ? renderMobileMembers()
                : null}
              <CloseIcon id="Close_Comment_Section" onClick={closeDrawer} />
              <CommentSection
                playlistID={chkPlaylistID}
                isUnRegistered={isUnregistered}
                mCode={mCode}
              />
            </SwipeableDrawer>
            <div onClick={toggleDrawer} id="Open_Comment_Section">
              {ResponsiveTabletViewCondition768()
                ? "Open Social Section"
                : "Open Comment Section"}
            </div>
          </>
        )}
      </>
    );
  }

  return <>{content}</>;
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    showError: (msg) => dispatch(showError(msg)),
    addPlaylistToDownloadBasket: (trackArray) =>
      dispatch(addPlaylistToDownloadBasket(trackArray)),
  };
};

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
    downloadBasket: state.downloadBasket,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MyMusicContent));
