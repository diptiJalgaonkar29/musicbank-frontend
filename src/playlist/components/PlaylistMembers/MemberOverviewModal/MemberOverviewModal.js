
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
import { closeMemberOverview } from "../../../../redux/actions/playListMemberActions";
import PlaylistService from "../../../services/PlaylistService";
import ModalWrapper from "../../../../branding/componentWrapper/ModalWrapper";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import CheckboxWrapper from "../../../../branding/componentWrapper/CheckboxWrapper";
import {
  getPlaylistById,
  playlistDoesntExist,
  savePlaylistMetaData,
  startFetchingsavePlaylistMetaData,
} from "../../../../redux/actions/playListActions/playListActions";
import { getAllCommentsByPlaylistID } from "../../../../redux/actions/playListCommentActions";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat";
//addition by Trupti-Wits

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

class MemberOverviewModal extends React.Component {
  state = {
    open: false,
    loaded: false,
    selectedUsers: [],
  };

  handleCloseRefresh = () => {
    this.props.closeMemberOverviewModal();
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
          if (res?.length === 0) {
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
    this.props.closeMemberOverviewModal();
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
    if (selectedUsers?.length < 0 || !playlistID) {
      return;
    }
    Promise.all(
      selectedUsers.map((id) => {
        return PlaylistService.removeMember(playlistID, id);
      })
    ).then(() => this.handleCloseRefresh());
  };

  componentDidUpdate = () => {
    const { playlistData } = this.props;
    const { loaded } = this.state;

    if (playlistData && loaded === false) {
      this.setState({
        members: playlistData.members,
        loaded: true,
        edited: false,
      });
    }
  };

  handleClickOnUser(id) {
    // TOGGLE USER ID
    this.setState((state) => {
      const dublicate = state.selectedUsers.find((item) => item === id);
      if (dublicate) {
        const selectedUsers = state.selectedUsers.filter((item) => item !== id);
        return {
          selectedUsers,
        };
      }

      const selectedUsers = [...state.selectedUsers, id];
      return {
        selectedUsers,
      };
    });
  }

  render() {
    const { classes, openProp, playlistData, isUnRegistered } = this.props;
    const { selectedUsers } = this.state;

    let content = <SpinnerDefault />;
    if (playlistData) {
      content = (
        <React.Fragment>
          <ul className="MemberOverview__ul">
            {selectedUsers?.length > 0 ? (
              <li className="MemberOverview__li--select errorColorBackground">
                <FormattedMessage id="playlist.member.selected" />{" "}
                {selectedUsers?.length}
              </li>
            ) : (
              <li className="MemberOverview__li--select" />
            )}
            {playlistData?.members?.length === 0 ? (
              <li className="MemberOverview__li">
                <FormattedMessage id="playlist.member.noMember" />
              </li>
            ) : (
              playlistData?.members?.map((member) => {
                return (
                  <li className="MemberOverview__li" key={member.id}>
                    {member.email}
                    {!isUnRegistered && (
                      <CheckboxWrapper
                        onClick={this.handleClickOnUser.bind(this, member.id)}
                      />
                    )}
                  </li>
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
          title="Registered Members Overview"
          WPPhideCloseBtn={true}
          disableCloseIcon={true}
          className="registered_members_overview_modal"
        >
          {content}
          <div className={classes.DialogActions}>
            {!isUnRegistered && (
              <ButtonWrapper
                disabled={selectedUsers?.length === 0}
                onClick={this.handleDeleteMember}
              >
                <FormattedMessage id="playlist.member.accept" />
              </ButtonWrapper>
            )}
            <ButtonWrapper onClick={this.handleClose}>
              <FormattedMessage id="playlist.member.decline" />
            </ButtonWrapper>
          </div>
        </ModalWrapper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeMemberOverviewModal: () => dispatch(closeMemberOverview()),
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
  )(withStyles(styles)(MemberOverviewModal))
);
