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
  closeAddMemberExternalToPlaylistDialog,
} from "../../../../redux/actions/playListMemberActions";
import { fetchUserName } from "../../../../redux/actions/searchActions";
import PlaylistService from "../../../services/PlaylistService";
import "./AddGeneralLinkModal.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
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
    paddingTop: "3rem",
    paddingBottom: "2rem",
    height: "auto",
    minHeight: "12rem",
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

class AddGeneralLinkModalTab extends React.Component {
  state = {
    memberAdded: false,
    linkList: null,
    isCopied: false,
    generalLink: "",
  };

  generateShareLink = (playlistID) => {
    const validityPeriod = 14;

    const data = JSON.stringify({ validity: validityPeriod }, null, 2);
    PlaylistService.getGeneralLink(playlistID, data)
      .then((response) => {
        this.setState({ generalLink: response.data[0].url });
      })
      .catch(() => {
        console.log("no generallink generated");
      });
  };

  updateShareLink = (playlistID, _linkURL, _validity) => {
    const data = JSON.stringify(
      { url: _linkURL, validityPeriod: _validity, playlistId: playlistID },
      null,
      2
    );
    const params =
      "?validityPeriod=" +
      _validity +
      "&url=" +
      escape(_linkURL) +
      "&playlistId=" +
      playlistID;
    PlaylistService.updateGeneralLink(playlistID, data, params)
      .then((response) => {
        alert("Validity period updated for the link");
      })
      .catch(() => {
        console.log("no generallink generated");
      });
  };

  updatePage = () => {
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
      }
    });
  };

  onValueChange() {}

  onCopyText = () => {
    this.props.showSuccess("Link is copied");
  };

  render() {
    const { generalLink } = this.state;
    const { classes, playlistIdProp } = this.props;

    if (generalLink === "") this.generateShareLink(playlistIdProp.id);

    return (
      <div>
        <Formik
          onSubmit={(values) => {
            if (!playlistIdProp) {
              return;
            }
            const playlistID = playlistIdProp.id;
            if (values.validity === undefined) values.validity = 2;

            const validityPeriod = parseInt(values.validity) * 7;
            this.updateShareLink(playlistID, generalLink, validityPeriod);
          }}
          render={(props) => (
            <form onSubmit={props.handleSubmit}>
              <DialogContent classes={{ root: classes.dialogContent }}>
                <div>
                  <div className="copyLinkBtnBlock">
                    <InputWrapper type="text" value={generalLink} />
                    <CopyToClipboard
                      text={generalLink}
                      onCopy={this.onCopyText}
                    >
                      <div className="copy-area">
                        {/* <ButtonWrapper type="button" className="copyLinkBtn"> */}
                        <ButtonWrapper type="button">Copy Link</ButtonWrapper>
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
              </DialogContent>

              <DialogActions className={classes.DialogActions}>
                <ButtonWrapper variant="outlined" onClick={this.updatePage}>
                  <FormattedMessage id="playlist.member.decline" />
                </ButtonWrapper>
                <ButtonWrapper id="textSubmit" onClick={this.updatePage}>
                  <FormattedMessage id="playlist.member.ok" />
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
    closeAddMemberExternalModal: () =>
      dispatch(closeAddMemberExternalToPlaylistDialog()),
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
    open: state.playlistMember.addMemberExternalDialogOpen,
    membersToAdd: state.playlistMember.formMemberID,
  };
};
export default withRouterCompat(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AddGeneralLinkModalTab))
);
