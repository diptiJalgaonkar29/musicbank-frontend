import { withStyles } from "@mui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import {
  getAllPlaylists,
  openCreateNewPlaylistDialog,
  setTrackIdToNewPlaylist,
} from "../../../redux/actions/playListActions/index";
import PlaylistService from "../../services/PlaylistService";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import MenuWrapper from "../../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import "./AddItemToPlaylistMenuV2.css";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";

const styles = {
  addToPlaylistButton: {
    cursor: "pointer",
    color: "var(--color-white)",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    display: "grid",
    placeItems: "center",
    width: "25px !important",
    height: "25px !important",
    padding: 0,
  },
  MenuContainer: {
    backgroundColor: "black",
    borderRadius: "15px",
    border: "1px solid var(--color-white)",
    transform: "scale(0.9, 0.9) translateY(5%) translateX(18%) !important",
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

class AddItemToPlaylistMenuV2 extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.getPlaylistsData();
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  openCreateNewPlaylistModal = (trackId, trackdetails_objectID) => {
    const trackData = [{ trackId: trackId, algoliaId: trackdetails_objectID }];
    this.props.setTrackIdToNewPlaylist(trackData);
    this.props.openCreateNewPlaylistModal();
    this.setState({ anchorEl: null });
  };

  getPlaylistsData = () => {
    this.props.getAllPlaylists();
  };

  addTrackToPlaylistHandler(playlistId, trackId, playlistName, trackName) {
    PlaylistService.addTrack(playlistId, trackId)
      .then(() => {
        this.handleClose();
        this.props.showSuccess(`Added ${trackName} to ${playlistName}`);
      })
      .catch(() => {
        this.handleClose();
        this.props.showError("Something went wrong adding Song to Playlist");
      });
  }

  render() {
    const { anchorEl } = this.state;
    const {
      classes,
      playlistData,
      trackCardIdProp,
      trackdetails_objectID,
      trackCardNameProp,
      stClass,
      buttonText,
    } = this.props;
    return (
      <div className={stClass !== "" ? stClass : ""}>
        {!!buttonText ? (
          <div
            className="AddItemToPlaylistMenuV2_buttonText_container boldFamily"
            onClick={this.handleClick}
          >
            <p className="AddItemToPlaylistMenuV2_buttonText">{buttonText}</p>
            <IconButtonWrapper icon="AddToPlaylist" />
          </div>
        ) : (
          <ToolTipWrapper title={"Add to playlist"}>
            <IconButtonWrapper
              icon="AddToPlaylist"
              onClick={this.handleClick}
            />
          </ToolTipWrapper>
        )}

        <MenuWrapper
          id="AddItemToPlaylistMenu"
          className={`${stClass}_menulist`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          // classes={{ paper: classes.MenuContainer }}
          onEntering={this.getPlaylistsData}
        >
          <MenuItemWrapper
            onClick={this.openCreateNewPlaylistModal.bind(
              this,
              trackCardIdProp,
              trackdetails_objectID
            )}
            className={classes.FirstItem}
          >
            <FormattedMessage id="playlist.page.createNew" />
          </MenuItemWrapper>
          {playlistData
            ? playlistData.map((item) => {
                return (
                  <MenuItemWrapper
                    key={item.id}
                    onClick={this.addTrackToPlaylistHandler.bind(
                      this,
                      item.id,
                      [
                        {
                          trackId: trackCardIdProp,
                          algoliaId: trackdetails_objectID,
                        },
                      ],

                      unescape(item.name),
                      trackCardNameProp
                    )}
                    className={classes.Item}
                  >
                    {" "}
                    <span className={classes.noWrap}>
                      {unescape(item.name)}
                    </span>
                  </MenuItemWrapper>
                );
              })
            : null}
        </MenuWrapper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openCreateNewPlaylistModal: () => dispatch(openCreateNewPlaylistDialog()),
    setTrackIdToNewPlaylist: (id) => dispatch(setTrackIdToNewPlaylist(id)),
    getAllPlaylists: () => dispatch(getAllPlaylists()),
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    showError: (msg) => dispatch(showError(msg)),
  };
};

const mapStateToProps = (state) => {
  return {
    playlistData: state.playlist.PlaylistMetaData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddItemToPlaylistMenuV2));
