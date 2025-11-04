import Button from "@mui/material/Button";
//import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
//import DialogTitle from "@mui/material/DialogTitle";
//import Slide from "@mui/material/Slide";
import { withStyles } from "@mui/styles";
import { Formik } from "formik";
import React from "react";
import { FormattedMessage } from "react-intl";
// Helper
import { connect } from "react-redux";
// Redux Imports
import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import {
  clearMemberIdsForm,
  closeAddMemberToPlaylistDialog,
} from "../../../../redux/actions/playListMemberActions";
import { fetchUserName } from "../../../../redux/actions/searchActions";
// Functions
// Locale Komponneten
import SearchForUserDownShift from "../SearchUser/SearchUser";
import PlaylistService from "../../../services/PlaylistService";
import { getAllCommentsByPlaylistID } from "../../../../redux/actions/playListCommentActions";
import { getPlaylistById } from "../../../../redux/actions/playListActions";
import {
  playlistDoesntExist,
  savePlaylistMetaData,
  startFetchingsavePlaylistMetaData,
} from "../../../../redux/actions/playListActions/playListActions";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat";

/* function Transition(props) {
    return <Slide direction="top" {...props} />;
} */

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
    paddingTop: "3rem",
    paddingBottom: "3rem",
    height: "auto",
    minHeight: "20rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "flex-start",
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
};

class AddNewMemberModalTab extends React.Component {
  state = {
    memberAdded: false,
  };
  handleClose = () => {
    this.props.clearMemberIds();
    this.props.closeAddMemberModal();
  };

  handleReset = () => {
    this.props.clearMemberIds();
  };

  render() {
    //const { classes, openProp, membersToAdd, playlistIdProp } = this.props;
    const { classes, membersToAdd, playlistIdProp } = this.props;
    return (
      <div>
        <Formik
          onSubmit={(values, actions) => {
            if (membersToAdd.length === 0 || !playlistIdProp) {
              return;
            }
            const ids = [];
            const playlistID = playlistIdProp.id;
            membersToAdd.map((member) => {
              return ids.push({ id: member.id });
            });

            const data = JSON.stringify(
              {
                members: [...ids],
              },
              null,
              2
            );
            PlaylistService.addMembers(playlistID, data)
              .then(() => {
                this.props.showSuccess(
                  `Sucess: Added ${
                    ids.length === 1 ? "Member" : "Members"
                  } to Playlist`
                );
                this.setState(
                  {
                    memberAdded: true,
                  },
                  () => {
                    this.handleClose();
                    actions.resetForm({});
                    actions.setSubmitting(false);
                    actions.setStatus({
                      success: true,
                    });
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
                      }
                    });
                  }
                );
              })
              .catch(() => {
                this.props.showError(
                  "Something went wrong adding Members to the Playlist,  please try again"
                );
              });
          }}
          render={(props) => (
            <form onSubmit={props.handleSubmit}>
              <DialogContent classes={{ root: classes.dialogContent }}>
                <SearchForUserDownShift />
              </DialogContent>
              <DialogActions className={classes.DialogActions}>
                <Button
                  disableRipple
                  onClick={props.handleSubmit}
                  //className="activeColor"
                  className={membersToAdd.length !== 0 && "activeColor"}
                  style={{ color: "grey", fontSize: "1.7rem" }}
                >
                  <FormattedMessage id="playlist.member.inviteAccept" />
                </Button>
                <Button
                  disableFocusRipple={true}
                  disableRipple
                  onClick={this.props.closeHandlerProp}
                  style={{
                    color: "var(--color-white)",
                    fontSize: "1.7rem",
                  }}
                >
                  <FormattedMessage id="playlist.member.inviteDecline" />
                </Button>
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
  )(withStyles(styles)(AddNewMemberModalTab))
);
