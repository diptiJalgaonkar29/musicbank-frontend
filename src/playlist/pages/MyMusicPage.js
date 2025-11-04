import React, { Component, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import {
  closeDeletePlaylistDialog,
  closeShareTabsPlaylistDialog,
  getAllPlaylists,
  getPlaylistById,
} from "../../redux/actions/playListActions";
import { getAllCommentsByPlaylistID } from "../../redux/actions/playListCommentActions";
import CreatePlaylistModal from "../components/CreatePlaylistModal/CreatePlaylistModal";
import DeletePlaylistModal from "../components/DeletePlaylistMenu/DeletePlaylistModal/DeletePlaylistModal";
import MyMusicContent from "../components/MyMusicContent/MyMusicContent";
import ShareTabsPlaylistModal from "../components/DeletePlaylistMenu/SharePlaylistModal/ShareTabsPlaylistModal";

import MemberOverviewModal from "../components/PlaylistMembers/MemberOverviewModal/MemberOverviewModal";
import MemberOverviewModalGuest from "../components/PlaylistMembers/MemberOverviewModal/MemberOverviewModalGuest";
import MyMusicPageHoc from "../layout/MyMusicPageHoc";
import PlaylistService from "../services/PlaylistService";
import MyMusicSideBar from "../components/MyMusicSideBar/MyMusicSideBar";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import { withRouterCompat } from "../../common/utils/withRouterCompat";
import algoliasearch from 'algoliasearch';

//addition by Trupti-Wits

let chkPlaylistID = null;

const MyMusicPage = (props) => {
  const [updateMemberOverView, setUpdateMemberOverView] = useState(false);
  const [combinedDataSet, setCombinedDataSet] = useState([]);
  const { config } = useContext(BrandingContext);

  const {
    getAllPlaylists,
    getPlaylistById,
    getComments,
    PlaylistMetaData,
    PlaylistByIdDataLoading,
    PlaylistByIdData,
    playlistDoesntExist,
    openMemberOverviewState,
    openMemberOverviewGuestState,
    openDeletePlaylistState,
    closeDeletePlaylistHandler,
    openShareTabsPlaylistState,
    closeShareTabsPlaylistHandler,
    createNewPlaylistDialogOpen,
    navigate,
    match,
  } = props;

  // runs like UNSAFE_componentWillMount
  useEffect(() => {
    getAllPlaylists();
  }, [getAllPlaylists]);

  // runs like componentDidMount
  useEffect(() => {
    const isUrlFromUser = match.params;

    if (
      isUrlFromUser.constructor === Object &&
      Object.entries(isUrlFromUser).length !== 0
    ) {
      const id = match.params.id;
      chkPlaylistID = id;
      getPlaylistById(id);
      getComments(id);
    }

    if (
      isUrlFromUser.constructor === Object &&
      Object.entries(isUrlFromUser).length === 0
    ) {
      PlaylistService.getAll().then((res) => {
        if (res.length === 0) {
          return;
        } else {
          let id = res[0].id;
          chkPlaylistID = id;
          getPlaylistById(id);
          getComments(id);
          navigate(`/mymusic/${id}`);
        }
      });
    }
  }, [match.params, getPlaylistById, getComments, navigate]);

  // runs like componentDidUpdate
  useEffect(() => {
    if (chkPlaylistID !== match.params.id) {
      chkPlaylistID = match.params.id;
    }
  }, [match.params.id]);

  const updateOverView = useCallback(() => {
    setUpdateMemberOverView(true);
  }, []);

  const renderContent = useCallback(
    (config) => {
      let content = (
        <MyMusicContent
          loadingProp={PlaylistByIdDataLoading}
          dataProp={PlaylistByIdData}
          playlistDoesntExistProp={playlistDoesntExist}
          isUnRegistered={false}
          chkPlaylistID={chkPlaylistID}
          config={config}
        />
      );

      if (Array.isArray(PlaylistMetaData)) {
        if (PlaylistMetaData.length === 0) {
          content = (
            <div className="MyMusic__Content--noPlaylist">
              <h2 style={{ textAlign: "center" }}>
                <FormattedMessage id="playlist.page.noPlaylist" />
              </h2>
              <div className="MyMusic__SideBar">
                <MyMusicSideBar noplaylist={true} />
              </div>
            </div>
          );
        } else {
          content = (
            <MyMusicContent
              loadingProp={PlaylistByIdDataLoading}
              dataProp={PlaylistByIdData || []}
              playlistDoesntExistProp={playlistDoesntExist}
              isUnRegistered={false}
              chkPlaylistID={chkPlaylistID}
              config={config}
            />
          );
        }
      }

      return content;
    },
    [PlaylistMetaData, PlaylistByIdDataLoading, PlaylistByIdData, playlistDoesntExist]
  );

  return (
    <>
      <MemberOverviewModal isUnRegistered={false} openProp={openMemberOverviewState} />
      <MemberOverviewModalGuest
        isUnRegistered={false}
        openProp={openMemberOverviewGuestState}
      />
      <DeletePlaylistModal
        openProp={openDeletePlaylistState}
        closeHandlerProp={() => closeDeletePlaylistHandler()}
      />
      <ShareTabsPlaylistModal
        openProp={openShareTabsPlaylistState}
        closeHandlerProp={() => closeShareTabsPlaylistHandler()}
        PlaylistByIdData={PlaylistByIdData}
      />
      <CreatePlaylistModal openProp={createNewPlaylistDialogOpen} />
      <MyMusicPageHoc isUnRegistered={false}>{renderContent(config)}</MyMusicPageHoc>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllPlaylists: () => dispatch(getAllPlaylists()),
    getPlaylistById: (id) => dispatch(getPlaylistById(id)),
    getComments: (playlistID) => dispatch(getAllCommentsByPlaylistID(playlistID)),
    closeDeletePlaylistHandler: () => dispatch(closeDeletePlaylistDialog()),
    closeShareTabsPlaylistHandler: () => dispatch(closeShareTabsPlaylistDialog()),
  };
};

const mapStateToProps = (state) => {
  return {
    createNewPlaylistDialogOpen: state.playlist.createNewPlaylistDialog,
    PlaylistMetaData: state.playlist.PlaylistMetaData,
    PlaylistByIdDataLoading: state.playlist.PlaylistByIdDataLoading,
    PlaylistByIdData: state.playlist.PlaylistByIdData,
    openDeletePlaylistState: state.playlist.deletePlaylistDialogOpen,
    openShareTabsPlaylistState: state.playlist.shareTabsPlaylistDialogOpen,
    playlistDoesntExist: state.playlist.playlistDoesntExist,
    openMemberOverviewState: state.playlistMember.memberOverviewDialogOpen,
    openMemberOverviewGuestState: state.playlistMember.memberOverviewDialogGuestOpen,
    playlistToDelete: state.playlist.playlistToDelete,
    playlistToShare: state.playlist.playlistToShare,
  };
};

export default withRouterCompat(
  connect(mapStateToProps, mapDispatchToProps)(MyMusicPage)
);
