import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { withStyles } from "@mui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

//addition by Trupti-Wits
const styles = {
  MenuContainer: {
    backgroundColor: "grey",
    borderRadius: "0",
    transform: "scale(0.85, 0.85) translateY(50%)  translateX(20%)!important",
  },

  Item: {
    fontSize: "1.6rem",
    color: "var(--color-white)",
  },
};

class DeletePlaylistMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSharePlaylist = () => {
    this.setState({ anchorEl: null }, () => {
      this.props.shareHandlerProp();
    });
  };

  handleSharePlaylistExternal = () => {
    this.setState({ anchorEl: null }, () => {
      this.props.shareExternalHandlerProp();
    });
  };

  handleOpenDeletePlaylistModal = () => {
    // CLOSE MENU BEFORE OPEN THE DELETE PLAYLIST MODAL
    this.setState({ anchorEl: null }, () => {
      this.props.openDeleteModalProp();
    });
  };

  handleOpenShareTabsPlaylistModal = () => {
    // CLOSE MENU BEFORE OPEN THE DELETE PLAYLIST MODAL
    this.setState({ anchorEl: null }, () => {
      this.props.openShareTabsModalProp();
    });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <div className="PlaylistDescription__Extra--delete">
        {/* <div
          className="PlaylistDescription__tabMenuSet"
          aria-owns={anchorEl ? "share-playlist-menu" : undefined}
          aria-haspopup="false"
          onClick={this.handleOpenShareTabsPlaylistModal}
        >
          <ShareOutlinedIcon />
        </div> */}
        <IconButtonWrapper
          icon="Share"
          onClick={this.handleOpenShareTabsPlaylistModal}
        />
        <IconButtonWrapper
          icon="Trash"
          onClick={this.handleOpenDeletePlaylistModal}
        />

        {/* <div
          className="PlaylistDescription__tabMenuSet"
          aria-owns={anchorEl ? "delete-playlist-menu" : undefined}
          aria-haspopup="false"
          onClick={this.handleOpenDeletePlaylistModal}
        >
          <DeleteOutlinedIcon />
        </div> */}

        <Menu
          id="delete-playlist-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          classes={{ paper: classes.MenuContainer }}
        >
          <MenuItem
            onClick={this.handleOpenDeletePlaylistModal}
            className={classes.Item}
          >
            <FormattedMessage id="playlist.extra.deletePlaylist" />
          </MenuItem>
          <MenuItem onClick={this.handleSharePlaylist} className={classes.Item}>
            <FormattedMessage id="playlist.extra.sharePlaylist" />
          </MenuItem>
          <MenuItem
            onClick={this.handleSharePlaylistExternal}
            className={classes.Item}
          >
            <FormattedMessage id="playlist.extra.sharePlaylistExternal" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(DeletePlaylistMenu);
