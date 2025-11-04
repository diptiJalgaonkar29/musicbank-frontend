
import { withStyles } from "@mui/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
// Helper
import { connect } from "react-redux";
//Local
import { SpinnerDefault } from "../../../../common/components/Spinner/Spinner";
// Redux Imports
import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import { closeMemberOverviewGuest } from "../../../../redux/actions/playListMemberActions";
import PlaylistService from "../../../services/PlaylistService";
import moment from "moment";

import "./MemberOverviewModalGuest.css";
import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import CheckboxWrapper from "../../../../branding/componentWrapper/CheckboxWrapper";
import { getAllCommentsByPlaylistID } from "../../../../redux/actions/playListCommentActions";
import { getPlaylistById } from "../../../../redux/actions/playListActions";
import {
  playlistDoesntExist,
  savePlaylistMetaData,
  startFetchingsavePlaylistMetaData,
} from "../../../../redux/actions/playListActions/playListActions";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat";

const styles = {
  dialogPaper: {
    minHeight: "28rem",
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
    justifyContent: "center",
    boxSizing: "border-box",
    padding: "2.4rem 2.4rem",
  },
};

class MemberOverviewModalGuest extends React.Component {
  state = {
    open: false,
    loaded: false,
    selectedUsers: [],
  };

  handleCloseRefresh = () => {
    this.props.closeMemberOverviewModalGuest();
    this.setState(
      {
        open: false,
        loaded: false,
        selectedUsers: [],
      },
      () => {
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
  };

  handleClose = () => {
    this.props.closeMemberOverviewModalGuest();
    this.setState({
      open: false,
      loaded: false,
      selectedUsers: [],
    });
  };

  handleDeleteMember = () => {
    const playlistID = this.props.playlistData.id;
    const { selectedUsers } = this.state;

    // ERROR CHECK
    if (selectedUsers.length < 0 || !playlistID) {
      return;
    }
    Promise.all(
      selectedUsers.map((e) => {
        if (e.email === null || e.email === "")
          return PlaylistService.removeMemberUnregistered(
            playlistID,
            e.email,
            e.url
          );
        else
          return PlaylistService.removeMemberUnregistered(
            playlistID,
            e.email,
            e.url
          );
        //for deleting links without email id, we need to pass some other data to API
        //confirm from backend and pass data accordingly, possible data could be url or randomcode
        //return PlaylistService.removeMemberUnregistered(playlistID, e.email, e.url, e.randomCode);
      })
    ).then(() => this.handleCloseRefresh());
  };

  componentDidUpdate = () => {
    const { playlistData } = this.props;
    const { loaded } = this.state;

    if (playlistData && loaded === false) {
      this.setState({
        members: playlistData.membersunregistered,
        loaded: true,
        edited: false,
      });
    }
  };

  handleClickOnUser(id, email, url, randomCode) {
    // TOGGLE USER ID
    this.setState((state) => {
      const dublicate = state.selectedUsers.find((item) => id === item.id);
      if (dublicate) {
        const selectedUsers = state.selectedUsers.filter(
          (item) => id !== item.id
        );
        return {
          selectedUsers,
        };
      }

      const selectedUsers = [
        ...state.selectedUsers,
        { id: id, email: email, url: url, randomCode: randomCode },
      ];
      return {
        selectedUsers,
      };
    });
  }

  handleRecentLinkUser(memberEmail) {
    const playlistID = this.props.playlistData?.id;
    const membersEmail = {
      email: memberEmail,
    };
    const validityPeriod = 14;
    const data = JSON.stringify(
      {
        members: [membersEmail],
        validity: validityPeriod,
      },
      null,
      2
    );
    PlaylistService.addMembersExternal(playlistID, data)
      .then(() => {
        this.props.showSuccess(`Sucess: Link has been sent to the member`);
        this.handleCloseRefresh();
      })
      .catch(() => {
        this.props.showError(
          "Something went wrong share link to the Members,  please try again"
        );
      });
  }
  render() {
    const { classes, openProp, playlistData, isUnRegistered } = this.props;
    const { selectedUsers } = this.state;

    if (playlistData) {
      if (playlistData.membersunregistered == null)
        playlistData.membersunregistered = [];
    }

    let content = <SpinnerDefault />;
    if (playlistData) {
      content = (
        <React.Fragment>
          <ul className="MemberOverview__ul">
            {selectedUsers.length > 0 ? (
              <li className="MemberOverview__li--select errorColorBackground">
                <FormattedMessage id="playlist.member.selected" />{" "}
                {selectedUsers.length}
              </li>
            ) : (
              <li className="MemberOverview__li--select" />
            )}
            {playlistData.membersunregistered.length === 0 ? (
              <li className="MemberOverview__li">
                <FormattedMessage id="playlist.member.noMember" />
              </li>
            ) : (
              playlistData.membersunregistered.map((member) => {
                return (
                  <React.Fragment key={member.id}>
                    <li
                      className="MemberOverview__li"
                      style={{ position: "relative" }}
                    >
                      <span
                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {member.email !== "" && member.email !== null
                          ? member.email
                          : member.url}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        {member.email && (
                          <ButtonWrapper
                            onClick={this.handleRecentLinkUser.bind(
                              this,
                              member.email
                            )}
                            size="s"
                            className="recent_link_icon"
                          >
                            Resend
                          </ButtonWrapper>
                        )}
                        {!isUnRegistered && (
                          <CheckboxWrapper
                            onClick={this.handleClickOnUser.bind(
                              this,
                              member.id,
                              member.email,
                              member.url,
                              member.randomCode
                            )}
                          />
                        )}
                      </div>
                    </li>
                    <div className="validityMeta">
                      <span>
                        <b>Validity : {member.validityPeriod + " days"}</b> (
                        {moment(member.newTimestamp).format("LL")} -{" "}
                        {moment(member.validityDate).format("LL")})
                      </span>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </ul>
        </React.Fragment>
      );
    }
    return (
      <div>
        <ModalWrapper
          isOpen={openProp}
          onClose={this.handleClose}
          title="External Members Overview"
          disableCloseIcon={true}
          WPPhideCloseBtn={true}
          className="external_members_overview_modal"
        >
          {content}
          <div className={classes.DialogActions}>
            <ButtonWrapper onClick={this.handleClose}>
              <FormattedMessage id="playlist.member.decline" />
            </ButtonWrapper>
            {!isUnRegistered && (
              <ButtonWrapper
                disabled={selectedUsers.length === 0}
                onClick={this.handleDeleteMember}
              >
                <FormattedMessage id="playlist.member.accept" />
              </ButtonWrapper>
            )}
          </div>
        </ModalWrapper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeMemberOverviewModalGuest: () => dispatch(closeMemberOverviewGuest()),
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

const mapStateToProps = (state) => {
  return {
    open: state.playlistMember.addMemberDialogOpen,
    playlistData: state.playlist.PlaylistByIdData,
  };
};
export default withRouterCompat(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(MemberOverviewModalGuest))
);
