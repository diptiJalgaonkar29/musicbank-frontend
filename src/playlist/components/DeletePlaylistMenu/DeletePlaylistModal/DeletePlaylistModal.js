import { withStyles } from "@mui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import PlaylistService from "../../../services/PlaylistService";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import { getPlaylistById } from "../../../../redux/actions/playListActions";
import { getAllCommentsByPlaylistID } from "../../../../redux/actions/playListCommentActions";
import {
  playlistDoesntExist,
  savePlaylistMetaData,
  startFetchingsavePlaylistMetaData,
} from "../../../../redux/actions/playListActions/playListActions";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat";

const styles = {
  dialogPaper: {
    minHeight: "0px",
    backgroundColor: "var(--color-card)",
    boxShadow: "none",
    color: "var(--color-white)",
    borderRadius: "0px",
  },
  dialogContent: {
    paddingTop: "3rem",
    paddingBottom: "0px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "flex-start",
  },
  DialogHeading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px dotted grey",
    "& h2": {
      color: "var(--color-white)",
      fontSize: "1.8rem",
    },
  },
  DialogActions: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "flex-end",
    boxSizing: "border-box",
    padding: "2.4rem 2.4rem",
  },
};

class DeletePlaylistModal extends React.Component {
  // DELETE PLAYLIST AND REFESH PAGE
  deletePlaylistHanlder() {
    if (!this.props.playlistToDelete) {
      return;
    }
    PlaylistService.remove(this.props.playlistToDelete)
      .then(() => {
        this.props.showSuccess("Deleted Playlist");
        this.props.closeHandlerProp();
        // Refetch playlist latest data
        this.props.startFetchingsavePlaylistMetaData();
        PlaylistService.getAll().then((res) => {
          console.log("res", res);

          if (res.length === 0) {
            this.props.savePlaylistMetaData([]);
            this.props.playlistDoesntExist();
            this.props.navigate("/playlist/");
          } else {
            res.forEach((item) => {
              delete item.tracks;
            });
            this.props.savePlaylistMetaData(res);
            let id = res[0].id;
            this.props.getPlaylistById(id);
            this.props.getComments(id);
            this.props.navigate(`/playlist/`);
          }
        });
      })
      .catch(() => {
        this.props.showError("Something went wrong deleting the Playlist");
      });
  }

  render() {
    const { classes, openProp } = this.props;
    return (
      <div>
        <ModalWrapper
          isOpen={openProp}
          onClose={this.props.closeHandlerProp}
          title="Are you sure to delete this Playlist Are you sure you want to delete this playlist? This action can't be reversed.?"
        >
          <div className={classes.DialogActions}>
            <ButtonWrapper onClick={this.props.closeHandlerProp} variant="outlined">
              <FormattedMessage id="playlist.remove.decline" />
            </ButtonWrapper>
            <ButtonWrapper onClick={this.deletePlaylistHanlder.bind(this)}>
              <FormattedMessage id="playlist.remove.accept" />
            </ButtonWrapper>
          </div>
        </ModalWrapper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlistToDelete: state.playlist.playlistToDelete,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    showError: (msg) => dispatch(showError(msg)),
    startFetchingsavePlaylistMetaData: () =>
      dispatch(startFetchingsavePlaylistMetaData()),
    savePlaylistMetaData: (data) => dispatch(savePlaylistMetaData(data)),
    getPlaylistById: (id) => dispatch(getPlaylistById(id)),
    playlistDoesntExist: () => dispatch(playlistDoesntExist()),
    getComments: (playlistID) =>
      dispatch(getAllCommentsByPlaylistID(playlistID)),
  };
};

export default withRouterCompat(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(DeletePlaylistModal))
);
