import Button from "@mui/material/Button";
//import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
//import DialogTitle from "@mui/material/DialogTitle";
//import Slide from "@mui/material/Slide";
import { withStyles } from "@mui/styles";
import { Formik, Field } from "formik";
import React from "react";
//import { useState } from "react";
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
  closeAddMemberExternalToPlaylistDialog,
} from "../../../../redux/actions/playListMemberActions";
import { fetchUserName } from "../../../../redux/actions/searchActions";
// Functions
// Locale Komponneten
import NonRegisteredUser from "../NonRegisteredUser/NonRegisteredUser";
import PlaylistService from "../../../services/PlaylistService";

import "./AddNewMemberExternalModal.css";
import List from "@mui/material/List";

import { CopyToClipboard } from "react-copy-to-clipboard";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";

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
    paddingBottom: "2rem",
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

class AddNewMemberExternalModalTab extends React.Component {
  state = {
    memberAdded: false,
    linkList: null,
    isCopied: false,
  };
  handleClose = () => {
    this.props.clearMemberIds();
    this.props.closeAddMemberExternalModal();
  };

  handleReset = () => {
    this.props.clearMemberIds();
  };

  render() {
    // this.state.linkList.push('asdfasdfasdf');
    //const { classes, openProp, membersToAdd, playlistIdProp } = this.props;
    const { memberAdded, memberList } = this.state;
    const { classes, membersToAdd, playlistIdProp } = this.props;

    //https://codesandbox.io/s/loving-wind-84bhs?file=/src/App.js
    //const [isCopied, setIsCopied] = useState(false);

    const onCopyText = () => {
      alert("Link is copied");
    };

    return memberAdded ? (
      <div>
        <Formik
          onSubmit={() => {
            window.location.reload();
          }}
          render={(props) => (
            <form onSubmit={props.handleSubmit}>
              <DialogContent classes={{ root: classes.dialogContent }}>
                {/* <NonRegisteredUser playlistData={props.playlistIdProp} /> */}
                <div className="copyLinkBlock">
                  <div className="copyLinkBlockHeader">Copy Link</div>
                  <List>
                    {memberList.map((member, i) => (
                      <div key={"copyLinkEmailBlock" + i}>
                        <div className="copyLinkEmailBlock">
                          <span className="copyLinkEmail">{member.email}</span>
                        </div>
                        <div className="copyLinkBtnBlock">
                          <InputWrapper
                            className="copyLinkInputBox"
                            type="text"
                            value={member.url}
                            placeholder=""
                          />
                          <CopyToClipboard
                            text={member.url}
                            onCopy={onCopyText}
                          >
                            <div className="copy-area">
                              <button type="button" className="copyLinkBtn">
                                Copy Link
                              </button>
                            </div>
                          </CopyToClipboard>
                        </div>
                      </div>
                    ))}
                  </List>
                </div>
              </DialogContent>

              <DialogActions className={classes.DialogActions}>
                <Button
                  disableFocusRipple={true}
                  disableRipple
                  onClick={props.handleSubmit}
                  style={{
                    color: "var(--color-white)",
                    fontSize: "1.7rem",
                  }}
                >
                  <FormattedMessage id="playlist.member.inviteDecline" />
                </Button>
                <Button
                  id="extSubmit"
                  disableRipple
                  onClick={props.handleSubmit}
                  className="activeColor"
                  style={{ color: "grey", fontSize: "1.7rem" }}
                >
                  <FormattedMessage id="playlist.member.ok" />
                </Button>
              </DialogActions>
            </form>
          )}
        />
      </div>
    ) : (
      <div>
        <Formik
          onSubmit={(values, actions) => {
            if (
              typeof membersToAdd != "object" ||
              typeof membersToAdd == undefined ||
              membersToAdd.length === 0 ||
              !playlistIdProp
            ) {
              return;
            }
            const emails = [];
            const playlistID = playlistIdProp.id;
            membersToAdd.map((member) => {
              return emails.push({ email: member });
            });
            if (values.validity === undefined) values.validity = 1;

            const validityPeriod = parseInt(values.validity) * 7;

            const data = JSON.stringify(
              {
                members: [...emails],
                validity: validityPeriod,
              },
              null,
              2
            );
            PlaylistService.addMembersExternal(playlistID, data)
              .then((response) => {
                this.props.showSuccess(
                  `Sucess: Added ${
                    emails.length === 1 ? "Member" : "Members"
                  } to Playlist`
                );

                this.setState(
                  {
                    memberAdded: true,
                    memberList: response.data,
                  },
                  () => {
                    this.handleClose();
                    actions.resetForm({});
                    actions.setSubmitting(false);
                    actions.setStatus({
                      success: true,
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
                <NonRegisteredUser playlistData={props.playlistIdProp} />
                <div className="validityBlock">
                  <div id="validity-radio-group">Select Validity</div>
                  <div role="group" aria-labelledby="validity-radio-group">
                    <label className="validLbl">
                      <Field
                        type="radio"
                        name="validity"
                        value="1"
                        defaultChecked
                      />
                      1 Week
                    </label>
                    <label className="validLbl">
                      <Field type="radio" name="validity" value="2" />2 Weeks
                    </label>
                    <label className="validLbl">
                      <Field type="radio" name="validity" value="3" />3 Weeks
                    </label>
                    <label className="validLbl">
                      <Field type="radio" name="validity" value="4" />4 Weeks
                    </label>
                  </div>
                </div>
              </DialogContent>

              <DialogActions className={classes.DialogActions}>
                <Button
                  id="extSubmit"
                  disableRipple
                  onClick={props.handleSubmit}
                  className={
                    typeof membersToAdd == "object" &&
                    membersToAdd.length !== 0 &&
                    "activeColor"
                  }
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
    closeAddMemberExternalModal: () =>
      dispatch(closeAddMemberExternalToPlaylistDialog()),
    clearMemberIds: () => dispatch(clearMemberIdsForm()),
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    showError: (msg) => dispatch(showError(msg)),
  };
};

const mapStateToProps = (state) => {
  return {
    open: state.playlistMember.addMemberExternalDialogOpen,
    membersToAdd: state.playlistMember.formMemberID,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddNewMemberExternalModalTab));
