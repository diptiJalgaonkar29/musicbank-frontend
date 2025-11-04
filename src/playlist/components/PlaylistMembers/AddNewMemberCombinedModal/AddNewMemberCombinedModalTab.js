import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { withStyles } from "@mui/styles";
import { Formik } from "formik";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import {
  clearMemberIdsForm,
  closeAddMemberToPlaylistDialog,
} from "../../../../redux/actions/playListMemberActions";
import { fetchUserName } from "../../../../redux/actions/searchActions";
import PlaylistService from "../../../services/PlaylistService";
import CombinedUserTextBlock2 from "./CombinedUserTextBlock2";
import { SpinnerDefault } from "../../../../common/components/Spinner/Spinner";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import {
  getPlaylistById,
  playlistDoesntExist,
  savePlaylistMetaData,
  startFetchingsavePlaylistMetaData,
} from "../../../../redux/actions/playListActions/playListActions";
import { getAllCommentsByPlaylistID } from "../../../../redux/actions/playListCommentActions";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat";

const styles = {
  dialogPaper: {
    transform: "translateY(-10rem)",
    minHeight: "29rem",
    height: "auto",
    backgroundColor: "var(--color-card)",
    boxShadow: "none",
    color: "var(--color-white)",
    borderRadius: "0px",
    overflow: "hidden",
  },
  dialogContent: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    height: "auto",
    // minHeight: "20rem",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "flex-start",
    overflow: "visible",
    fontFamily: "var(--font-primary) !important",
  },
  DialogHeading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    borderBottom: "1px dotted grey",
    "& h2": {
      color: "var(--color-white)",
      fontSize: "2rem",
    },
  },
  DialogActions: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: "2.4rem 2.4rem",
  },
  DialogLoader: {
    display: "flex",
    justifyContent: "center",
  },
};

let userList;

class AddNewMemberCombinedModalTab extends React.Component {
  state = {
    memberAdded: false,
    userList: [],
    isSubmitting: false,
    isUpdated: false,
  };
  handleClose = () => {
    this.props.clearMemberIds();
    this.props.closeAddMemberModal();
  };

  handleReset = () => {
    this.props.clearMemberIds();
  };

  sendPlaylistInvites(playlistID, membersToAdd) {
    this.setState({ isSubmitting: true });
    let internalIds = [];
    let externalIds = [];
    let validityPeriod = 14;

    membersToAdd.forEach((element) => {
      if (element?.id !== undefined) internalIds.push({ id: element?.id });
      else {
        if (element?.inputValue !== undefined)
          externalIds.push({ email: element?.email });
        else externalIds.push({ email: element });
      }
    });

    const dataInternal = JSON.stringify({ members: [...internalIds] }, null, 2);

    const dataExternal = JSON.stringify(
      { members: [...externalIds], validity: validityPeriod },
      null,
      2
    );
    console.log("addCombineMembers called");

    PlaylistService.addCombineMembers(playlistID, dataInternal, dataExternal)
      .then(() => {
        // Refetch playlist latest data
        this.props.startFetchingsavePlaylistMetaData();
        PlaylistService.getAll().then((res) => {
          if (res.length === 0) {
            this.props.savePlaylistMetaData([]);
            this.props.playlistDoesntExist();
            this.props.navigate("/mymusic");
          } else {
            res.forEach((item) => {
              delete item.tracks;
            });
            this.props.savePlaylistMetaData(res);
            const currentPlaylistId = this.props?.match?.params?.id;
            this.props.getPlaylistById(currentPlaylistId);
            this.props.getComments(currentPlaylistId);
            this.props.closeHandlerProp();
            this.handleClose();
            this.setState({
              memberAdded: false,
              userList: [],
              isSubmitting: false,
              isUpdated: !this.state.isUpdated,
            });
          }
        });
      })
      .catch(() => {
        this.props.showError(
          "Something went wrong adding Members to the Playlist, please try again"
        );
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  }

  render() {
    const { classes, membersToAdd, playlistIdProp } = this.props;
    return (
      <div>
        <Formik
          render={(props) => (
            <form>
              <DialogContent classes={{ root: classes.dialogContent }}>
                <CombinedUserTextBlock2
                  userList={userList}
                  key={`CombinedUserTextBlock2_${this.state.isUpdated}`}
                />
                {this.state.isSubmitting && (
                  <div
                    className={`${classes.DialogLoader} AddNewMemberCombinedModalTab_loader`}
                  >
                    <SpinnerDefault />
                  </div>
                )}
              </DialogContent>
              <DialogActions className={classes.DialogActions}>
                <ButtonWrapper
                  variant="outlined"
                  onClick={this.props.closeHandlerProp}
                >
                  <FormattedMessage id="playlist.member.inviteDecline" />
                </ButtonWrapper>
                <ButtonWrapper
                  onClick={() => {
                    if (membersToAdd.length === 0 || !playlistIdProp) {
                      return;
                    }
                    const playlistID = playlistIdProp?.id;
                    console.log("playlistID", playlistID);
                    console.log("membersToAdd", membersToAdd);
                    this.sendPlaylistInvites(playlistID, membersToAdd);
                  }}
                  disabled={
                    this.state.isSubmitting ||
                    membersToAdd.length === 0 ||
                    !playlistIdProp
                  }
                >
                  <FormattedMessage id="playlist.member.inviteAccept" />
                </ButtonWrapper>
              </DialogActions>
            </form>
          )}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserNameProp: (data) => dispatch(fetchUserName(data)),
    closeAddMemberModal: () => dispatch(closeAddMemberToPlaylistDialog()),
    clearMemberIds: () => dispatch(clearMemberIdsForm()),
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    showError: (msg) => dispatch(showError(msg)),
    startFetchingsavePlaylistMetaData: () =>
      dispatch(startFetchingsavePlaylistMetaData()),
    savePlaylistMetaData: (data) => dispatch(savePlaylistMetaData(data)),
    playlistDoesntExist: () => dispatch(playlistDoesntExist()),
    getPlaylistById: (id) => dispatch(getPlaylistById(id)),
    getComments: (playlistID) =>
      dispatch(getAllCommentsByPlaylistID(playlistID)),
  };
};

const mapStateToProps = (state) => {
  return {
    open: state.playlistMember.addMemberDialogOpen,
    membersToAdd: state.playlistMember.formMemberID,
  };
};
export default withRouterCompat(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AddNewMemberCombinedModalTab))
);
