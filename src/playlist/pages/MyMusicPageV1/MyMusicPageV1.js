import PlayListCoverPictue from "../../components/MyMusicContent/PlayListCoverPicture/PlayListCoverPictue";
import PlaylistService from "../../services/PlaylistService";
import "./MyMusicPageV1.css";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import SearchInputWrapper from "../../../branding/componentWrapper/SearchInputWrapper";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ReactComponent as More } from "../../../projectcommon/More.svg";
import CreatePlaylistModal from "../../components/CreatePlaylistModal/CreatePlaylistModal";
import { useDispatch, useSelector } from "react-redux";
import {
  closeShareTabsPlaylistDialog,
  openCreateNewPlaylistDialog,
  openShareTabsPlaylistDialog,
  setTrackIdToNewPlaylist,
} from "../../../redux/actions/playListActions";
import MenuWrapper from "../../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import ShareTabsPlaylistModal from "../../components/DeletePlaylistMenu/SharePlaylistModal/ShareTabsPlaylistModal";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import algoliasearch from "algoliasearch";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";
import CustomLoaderSpinner from "../../../common/components/customLoaderSpinner/CustomLoaderSpinner";
import getTrackDetails from "../../../common/utils/getTrackDetails";
import { setAllFavTrackIds } from "../../../redux/actions/searchActions/searchActions";
import AsyncService from "../../../networking/services/AsyncService";
import getTrackDetailsByAlgoliaId from "../../../common/utils/getTrackDetailsByAlgoliaId";

export default function MyMusicPageV1() {
  let Navigate = useNavigate();
  let dispatch = useDispatch();
  const [playListData, setPlaylistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shareTabData, setShareTabData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const openToggle = Boolean(anchorEl);
  const {
    createNewPlaylistDialog,
    shareTabsPlaylistDialogOpen,
    playlistToShare,
  } = useSelector((state) => state.playlist);

  const getAllPlaylistData = async () => {
    setIsLoading(true);
    try {
      const res = await PlaylistService.getAll();

      // --- Step 1: Extract track IDs and algolia IDs ---
      const memoizedIds =
        res
          ?.flatMap((item) => item?.tracks || [])
          ?.filter((track) => !track?.algoliaId && track?.objectID)
          ?.map((track) => track.objectID) || [];

      const memoizedAlgoliaIds =
        res
          ?.flatMap((item) => item?.tracks || [])
          ?.filter((track) => !!track?.algoliaId)
          ?.map((track) => track.algoliaId) || [];

      // --- Step 2: Fetch Algolia details conditionally ---
      const [algoliaResponseByTrackId, algoliaResponseByAlgoliaId] =
        await Promise.all([
          memoizedIds.length > 0 ? getTrackDetails(memoizedIds) : [],
          memoizedAlgoliaIds.length > 0
            ? getTrackDetailsByAlgoliaId(memoizedAlgoliaIds)
            : [],
        ]);

      const algoliaResponse = [
        ...(algoliaResponseByTrackId || []),
        ...(algoliaResponseByAlgoliaId || []),
      ];

      // --- Step 3: Attach Algolia response, don't directly merge ---
      const mergedPlaylists = res.map((playlist) => {
        // We’ll only pass Algolia response; merging will happen elsewhere
        const enrichedTracks = (playlist?.tracks || []).map((track) => {
          let match = null;

          if (track?.algoliaId) {
            // Match using Algolia objectID
            match = algoliaResponse.find(
              (alg) => String(alg?.objectID) === String(track?.algoliaId)
            );
          } else {
            // Match using SonicHub track ID
            match = algoliaResponse.find(
              (alg) =>
                String(alg?.sonichub_track_id) === String(track?.objectID)
            );
          }

          return { ...track, ...(match || {}) };
        });

        return {
          ...playlist,
          algoliaResponse: enrichedTracks, // ✅ attach enriched data separately
        };
      });

      console.log("mergedPlaylists ✅", mergedPlaylists);
      setPlaylistData(mergedPlaylists);
    } catch (err) {
      console.error("❌ Error fetching playlists:", err);
    } finally {
      setIsLoading(false);
      console.log("✅ Finished attempting to fetch playlists.");
    }
  };

  const renderCaption = (title) => (
    <>
      <span className="track-slide-show-item-title-playListData">
        {unescape(title)}
      </span>
    </>
  );

  const createNewPlaylistModal = () => {
    dispatch(setTrackIdToNewPlaylist([]));
    dispatch(openCreateNewPlaylistDialog());
  };

  const sharePlaylistModal = (id) => {
    setShareTabData(id);
    dispatch(openShareTabsPlaylistDialog(id));
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, playlist) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlaylist(playlist); // store only this one
  };

  const trackMenuItems = [
    {
      menuTitle: "Delete Playlist",
      onClick: (data) => deletePlaylistHanlder(data?.id),
      icon: "Trash",
    },
    {
      menuTitle: "Share",
      onClick: (id) => {
        sharePlaylistModal(id);
      },
      icon: "Share",
    },
  ]?.filter(Boolean);

  const deletePlaylistHanlder = async (playlistToDelete) => {
    if (!playlistToDelete) {
      return;
    }
    try {
      await PlaylistService.remove(playlistToDelete);
      getAllPlaylistData();
      setAnchorEl(null);
      showSuccess("Deleted Playlist");
    } catch (error) {
      console.error(error);
      showError("Something went wrong deleting the Playlist");
    }
  };

  useEffect(() => {
    getAllPlaylistData();
  }, [createNewPlaylistDialog]);

  const filterPlaylistData = useMemo(() => {
    return playListData.filter((playList) => {
      const title = unescape(playList.name).toLowerCase();
      const search = searchQuery.toLowerCase();
      return title.includes(search);
    });
  }, [playListData, searchQuery]);

  useEffect(() => {
    AsyncService.loadData(`/favourites/1`)
      .then((res) => {
        const favs = res.data.map((data) => String(data.fav_data));
        dispatch(setAllFavTrackIds(favs));
      })
      .catch((err) => console.error("Error fetching favourites:", err));
  }, [dispatch]);

  const renderContent = () => {
    return (
      <MainLayout>
        <div className="PlaylistPageContainer" key={playListData.id}>
          <div className="playlist-header">
            <h1>Your Playlists</h1>
            <ButtonWrapper onClick={createNewPlaylistModal}>
              <p>
                <IconWrapper icon="AddIcon" /> New Playlist
              </p>
            </ButtonWrapper>
          </div>

          <div className="search-container">
            <SearchInputWrapper
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              setValue={setSearchQuery}
            />
          </div>
          <div className="playlistV1_wrapper">
            {isLoading ? (
              <div className="playlist-loader">
                <CustomLoaderSpinner />
              </div>
            ) : playListData?.length > 0 ? (
              <div className="playlist-grid">
                {filterPlaylistData?.map((innerData) => {
                  let ImagesArray = innerData?.algoliaResponse
                    ?.map((item) =>
                      getMediaBucketPath(
                        item?.preview_image,
                        item?.source_id,
                        "image"
                      )
                    )
                    ?.splice(0, 4);
                  return (
                    <div className="playlist-card" key={innerData.id}>
                      <>
                        <div className="more_playlist_icon">
                          <More onClick={(e) => handleClick(e, innerData)} />
                          {anchorEl &&
                            selectedPlaylist?.id === innerData.id && (
                              <MenuWrapper
                                key={innerData.id}
                                id="playlist_menu_dropdown"
                                anchorEl={anchorEl}
                                open={openToggle}
                                onClose={handleClose}
                                MenuListProps={{
                                  "aria-labelledby": "basic-button",
                                }}
                              >
                                {trackMenuItems.map((data) => (
                                  <MenuItemWrapper
                                    className="playlist_menu_item"
                                    onClick={() =>
                                      data.onClick(selectedPlaylist)
                                    }
                                    key={data.menuTitle}
                                  >
                                    <IconWrapper icon={data.icon} />
                                    {data.menuTitle}
                                  </MenuItemWrapper>
                                ))}
                              </MenuWrapper>
                            )}
                        </div>
                        <div
                          className="track-slide-show-item-content-playlistV1"
                          onClick={() => Navigate("/mymusic/" + innerData.id)}
                        >
                          <PlayListCoverPictue
                            key={innerData.name}
                            imagesData={ImagesArray}
                            isUnRegistered={false}
                            coverImage={
                              ImagesArray?.length > 0 ? ImagesArray : ""
                            }
                            curatorCover={false}
                          />
                          <br />
                          {renderCaption(innerData.name)}
                          <br />
                          <span className="playlist-count">
                            {innerData?.tracks?.length > 0
                              ? innerData?.tracks?.length
                              : 0}{" "}
                            tracks
                          </span>
                        </div>
                      </>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-playlist-message">No Playlists Found</div>
            )}
            <CreatePlaylistModal
              openProp={createNewPlaylistDialog}
              setPlaylistData={setPlaylistData}
            />
            <ShareTabsPlaylistModal
              openProp={shareTabsPlaylistDialogOpen}
              closeHandlerProp={() => dispatch(closeShareTabsPlaylistDialog())}
              PlaylistByIdData={shareTabData}
              dontCall={true}
            />
          </div>
        </div>
      </MainLayout>
    );
  };

  return renderContent();
}
