import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { withStyles } from "@mui/styles";
import PlaylistAdd from "@mui/icons-material/PlaylistAdd";
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

const styles = {
  MenuContainer: {
    backgroundColor: "grey",
    borderRadius: "0",

    transform: "scale(0.9, 0.9) translateY(12%) translateX(18%) !important",
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

class AddItemToPlaylistMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  openCreateNewPlaylistModal = (trackId) => {
    this.props.setTrackIdToNewPlaylist(trackId);
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
      trackCardNameProp,
      stClass,
    } = this.props;
    return (
      <div className={stClass !== "" ? stClass : ""}>
        <div
          aria-owns={anchorEl ? "AddItemToPlaylistMenu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          outline="none"
          style={{
            color: "var(--color-white)",
            cursor: "pointer",
            transform: "scale(1.7)",
          }}
        >
          <PlaylistAdd style={{ fontSize: "2.5rem" }} />
        </div>
        <Menu
          id="AddItemToPlaylistMenu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          classes={{ paper: classes.MenuContainer }}
          onEntering={this.getPlaylistsData}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          <MenuItem
            onClick={this.openCreateNewPlaylistModal.bind(
              this,
              trackCardIdProp
            )}
            className={classes.FirstItem}
          >
            <FormattedMessage id="playlist.page.createNew" />
          </MenuItem>
          {playlistData
            ? playlistData.map((item) => {
                return (
                  <MenuItem
                    key={item.id}
                    onClick={this.addTrackToPlaylistHandler.bind(
                      this,
                      item.id, //PLAYLIST ID
                      trackCardIdProp,
                      //item.name.replace(/\\/g, ""),
                      unescape(item.name),
                      trackCardNameProp
                    )}
                    className={classes.Item}
                  >
                    {" "}
                    <span className={classes.noWrap}>
                      {unescape(item.name)}
                    </span>
                  </MenuItem>
                );
              })
            : null}
        </Menu>
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
)(withStyles(styles)(AddItemToPlaylistMenu));
