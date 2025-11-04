import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { withStyles } from "@mui/styles";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import { FormattedMessage } from "react-intl";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import { fill } from 'lodash';

const styles = {
  MenuContainer: {
    backgroundColor: "grey",
    borderRadius: "0",
    transform: "scale(0.85, 0.85) translateY(50%)  translateX(15%)!important",
  },
  MenuContainerV2: {
    backgroundColor: "var(--color-bg)",
    borderRadius: "25px",
    border: "1px solid var(--color-white)",
    transform: "scale(0.85, 0.85) translateY(50%)  translateX(15%)!important",
  },

  Item: {
    fontSize: "16px",
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

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <>
        <BrandingContext.Consumer>
          {({ config }) => (
            <div>
              {config.modules.UpdateUItoV2 ? (
                <div>
                  {/* <div
                    aria-owns={anchorEl ? "delete-track-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    className="PlayListTitleList__Extra--deletIcon"
                  >
                    <DeleteOutlinedIcon style={{ transform: "scale(1.3)" }} />
                  </div> */}
                  <IconWrapper
                    icon="Trash"
                    aria-owns={anchorEl ? "delete-track-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    style={{ fill: "var(--color-white)", Cursor: 'pointer' }}
                  />
                  <Menu
                    id="delete-track-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    classes={{ paper: classes.MenuContainerV2 }}
                  >
                    <MenuItem
                      onClick={this.props.deleteTrackHandlerProp}
                      className={classes.Item}
                    >
                      <FormattedMessage id="playlist.remove.deleteTrack" />
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <div>
                  <div
                    aria-owns={anchorEl ? "delete-track-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    className="PlayListTitleList__Extra--deletIcon"
                  >
                    <MoreIcon style={{ transform: "scale(1.8)" }} />
                  </div>
                  <Menu
                    id="delete-track-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    classes={{ paper: classes.MenuContainer }}
                  >
                    <MenuItem
                      onClick={this.props.deleteTrackHandlerProp}
                      className={classes.Item}
                    >
                      <DeleteOutlinedIcon style={{ transform: "scale(1.8)" }} />
                      &nbsp;
                      <FormattedMessage id="playlist.remove.deleteTrack" />
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          )}
        </BrandingContext.Consumer>
      </>
    );
  }
}

export default withStyles(styles)(DeletePlaylistMenu);
