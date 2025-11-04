import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  getAllPlaylists,
  openCreateNewPlaylistDialog,
  setTrackIdToNewPlaylist,
} from "../../../redux/actions/playListActions";
import PlaylistService from "../../../playlist/services/PlaylistService";
import {
  showSuccess,
  showError,
} from "../../../redux/actions/notificationActions";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import "./DownloadWidgetWithCookiesV2Dialog.css";

export default function AddToPlaylistDialog({
  selectedTrackIds = [],
  onClose,
  open: externalOpen,
}) {
  console.log("selectedTrackIds", selectedTrackIds);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const isControlledExternally = typeof externalOpen !== "undefined";
  const isOpen = isControlledExternally ? externalOpen : open;

  const handleClose = () => {
    if (isControlledExternally && onClose) {
      onClose();
    } else {
      setOpen(false);
    }
  };

  const playlistData = useSelector((state) => state.playlist.PlaylistMetaData);

  const getPlaylistsData = useCallback(() => {
    dispatch(getAllPlaylists());
  }, [dispatch]);

  const openCreateNewPlaylistModal = () => {
    dispatch(setTrackIdToNewPlaylist(selectedTrackIds));
    dispatch(openCreateNewPlaylistDialog());
    handleClose();
  };

  const addTrackToPlaylistHandler = (playlistId, playlistName) => {
    PlaylistService.addTrack(playlistId, selectedTrackIds)
      .then(() => {
        handleClose();
        dispatch(
          showSuccess(
            `Added ${selectedTrackIds.length} tracks to ${playlistName}`
          )
        );
      })
      .catch(() => {
        handleClose();
        dispatch(showError("Something went wrong adding tracks to Playlist"));
      });
  };

  useEffect(() => {
    if (isOpen) getPlaylistsData();
  }, [isOpen, getPlaylistsData]);

  return (
    <div className="wpp-addToPlaylistDialog">
      <ModalWrapper
        isOpen={isOpen}
        setIsOpen={setOpen}
        onClose={handleClose}
        className="download-option-dialog"
        title="Add to Playlist"
      >
        <div className="download-option-dialog-subtitle">
          Select a playlist to add {selectedTrackIds.length} track(s):
        </div>
        <div className="playlist-options">
          <ButtonWrapper
            onClick={openCreateNewPlaylistModal}
            variant="filledSecondary"
            style={{ marginBottom: "10px" }}
          >
            <FormattedMessage
              id="playlist.page.createNew"
              defaultMessage="Create New Playlist"
            />
          </ButtonWrapper>

          {playlistData && playlistData.length > 0 ? (
            <div className="wpp-add-plalist">
              {playlistData.map((item) => (
                <ButtonWrapper
                  key={item.id}
                  onClick={() =>
                    addTrackToPlaylistHandler(item.id, unescape(item.name))
                  }
                  variant="outlined"
                  style={{ marginBottom: "6px", width: "100%" }}
                >
                  {unescape(item.name)}
                </ButtonWrapper>
              ))}
            </div>
          ) : (
            <p style={{ color: "#fff", marginTop: "10px" }}>
              No playlists available
            </p>
          )}
        </div>
      </ModalWrapper>
    </div>
  );
}
