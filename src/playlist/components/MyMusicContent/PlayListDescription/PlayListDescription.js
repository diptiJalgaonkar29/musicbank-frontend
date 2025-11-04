import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/EditOutlined";
import React from "react";
import { connect } from "react-redux";

import {
  showError,
  showSuccess,
} from "../../../../redux/actions/notificationActions";
import {
  getAllPlaylists,
  getPlaylistById,
  openDeletePlaylistDialog,
  openShareTabsPlaylistDialog,
} from "../../../../redux/actions/playListActions";
import {
  openAddMemberToPlaylistDialog,
  openAddMemberExternalToPlaylistDialog,
  openMemberOverview,
} from "../../../../redux/actions/playListMemberActions";
import "../../../../_styles/PlaylistDescription.css";
import PlaylistService from "../../../services/PlaylistService";
import DeletePlaylistMenu from "../../DeletePlaylistMenu/DeletePlaylistMenu";
import PlayListCoverPictue from "../PlayListCoverPicture/PlayListCoverPictue";
import AsyncService from "../../../../networking/services/AsyncService";
import getConfigJson from "../../../../common/utils/getConfigJson";
import { getUserId } from "../../../../common/utils/getUserAuthMeta";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat";
// import { MdOutlineDescription } from "react-icons/md";

//addition by Trupti-Wits

class PlayListDescription extends React.Component {
  state = {
    editModeCoverImage: false,
    editModeName: false,
    editModeDescription: false,
    editedName: false,
    editedDescription: false,
    name: "",
    description: "",
    coverImageName: "",
  };

  componentDidMount() {
    const { playListName, playListDescription, playListCoverImage } =
      this.props;
    this.setState({
      name: playListName,
      description: playListDescription,
      coverImageName: playListCoverImage != null ? playListCoverImage : "",
    });
  }

  // TOGGLE EDIT MODE FOR NAME AND DESCRIPTION
  enableNameEditMode(type) {
    if (type === "coverImage") {
      this.setState({
        editModeCoverImage: true,
        editModeDescription: false,
        editModeName: false,
      });
    }
    if (type === "name") {
      this.setState({
        editModeCoverImage: false,
        editModeDescription: false,
        editModeName: true,
      });
    }
    if (type === "description") {
      this.setState({
        editModeCoverImage: false,
        editModeDescription: true,
        editModeName: false,
      });
    }
  }

  closeEditMode() {
    const { playListName, playListDescription, playListCoverImage } =
      this.props;
    // RESET STATE
    this.setState({
      edited: false,
      editModeDescription: false,
      editModeName: false,
      editModeCoverImage: false,
      editedDescription: false,
      editedName: false,
      editedCoverImage: false,
      name: playListName,
      description: playListDescription,
      coverImageName: playListCoverImage != null ? playListCoverImage : "",
    });
  }

  // UPDATE PLAYLOIST LOGIC HANLDER
  updatePlaylistMetaDescription = () => {
    //////////////////////////
    // PUT UPDATE LOGIC HERE//
    //////////////////////////
    const playlistId = this.props.playlistId;
    const name = this.state.name;
    const description = this.state.description;
    const coverImageName = this.state.coverImageName;

    if (name.length > 100 || description.length > 300) {
      if (description.length > 300) {
        this.props.showError("Description is too long, maximum 300 Chars");
      }
      if (name.length > 100) {
        this.props.showError("Paylist Title is too long, maximum 100 Chars");
      }
      if (coverImageName.length > 100) {
        this.props.showError(
          "Paylist Cover Image Name is too long, maximum 100 Chars"
        );
      }
      this.setState({
        edited: false,
        editModeDescription: false,
        editModeName: false,
        editModeCoverImage: false,
        editedDescription: false,
        editedName: false,
        editedCoverImage: false,
      });
      return;
    }

    PlaylistService.update(playlistId, name, description, coverImageName).then(
      (res) => {
        this.setState({
          edited: false,
          editModeDescription: false,
          editModeCoverImage: false,
          editModeName: false,
          editedDescription: false,
          editedName: false,
          editedCoverImage: false,
        });
        this.props.showSuccess(`Updated Playlist ${name}`);
        this.props.updatePlaylistMeta();
        this.props.getPlaylistById(playlistId);
      }
    );
  };

  // CHANGE INPUT NAME
  handleChange = (name) => (event) => {
    if (name === "coverImageName") {
      this.setState({
        editedCoverImage: true,
      });
    }
    if (name === "description") {
      this.setState({
        editedDescription: true,
      });
    }
    if (name === "name") {
      this.setState({
        editedName: true,
      });
    }

    this.setState({
      [name]: event.target.value,
    });
  };
  static contextType = BrandingContext;
  render() {
    const {
      isOwner,
      playListName,
      playListDescription,
      playListCoverImage,
      playlistId,
      amountOfTracksProps,
      openDeletePlaylistModal,
      openShareTabsPlaylistModal,
      isMobileProp,
      amountOfMembersProp,
      isUnRegistered,
      imagesData,
      mCode,
      coverImage,
      curatorCover,
    } = this.props;
    const {
      editModeCoverImage,
      editModeName,
      editModeDescription,
      name,
      description,
      coverImageName,
      editedDescription,
      editedName,
      editedCoverImage,
    } = this.state;

    var playListNameStr = unescape(playListName);
    var playListDescriptionStr = unescape(playListDescription);
    var playListCoverImageStr = unescape(playListCoverImage);
    const USER_ID = getUserId();
    const { jsonConfig: CONFIG } = this.context;
    let coverImages = (
      <div className="PlaylistCoverImage--image">
        <PlayListCoverPictue
          imagesData={imagesData}
          isUnRegistered={isUnRegistered}
          mCode={mCode}
          coverImage={coverImage}
          curatorCover={curatorCover}
        />

        {USER_ID === Number(localStorage.getItem("playlistCuratorId")) &&
          !isUnRegistered &&
          isOwner && (
            <div
              className="PlaylistCoverImage--editIcon"
              onClick={this.enableNameEditMode.bind(this, "coverImage")}
            >
              <EditIcon fontSize="inherit" />
            </div>
          )}
      </div>
    );

    if (!isUnRegistered && editModeCoverImage === true) {
      coverImages = (
        <div className="PlaylistCoverImage EditMode">
          <textarea
            value={unescape(coverImageName)}
            autoFocus
            onChange={this.handleChange("coverImageName")}
            className="PlaylistCoverImage--textarea"
          />
          <span className="PlaylistCoverImage--approveNewName">
            <CloseIcon
              onClick={this.closeEditMode.bind(this)}
              fontSize="inherit"
            />
            {editedCoverImage === true ? (
              <DoneIcon
                fontSize="inherit"
                style={{ color: "var(--color-primary)" }}
                onClick={this.updatePlaylistMetaDescription}
              />
            ) : null}
          </span>
        </div>
      );
    }

    // DESCRIPTION - NAME
    let nameField = (
      <div className="PlaylistDescription__Name">
        <span className="PlaylistDescription__Name--info">
          {playListNameStr}
        </span>
        {!isUnRegistered && isOwner && (
          <div
            className="PlaylistDescription__Name--editIcon"
            onClick={this.enableNameEditMode.bind(this, "name")}
          >
            <EditIcon fontSize="inherit" />
          </div>
        )}
      </div>
    );

    if (!isUnRegistered && editModeName === true) {
      nameField = (
        <div className="PlaylistDescription__Name EditMode">
          <textarea
            value={unescape(name)}
            autoFocus
            onChange={this.handleChange("name")}
            className="PlaylistDescription__Name--textarea"
          />
          <span className="PlaylistDescription__Name--approveNewName">
            <CloseIcon
              onClick={this.closeEditMode.bind(this)}
              fontSize="inherit"
            />
            {editedName === true ? (
              <DoneIcon
                fontSize="inherit"
                style={{ color: "var(--color-primary)" }}
                onClick={this.updatePlaylistMetaDescription}
              />
            ) : null}
          </span>
        </div>
      );
    }

    // DESCRIPTION - EDIT FIELD
    let descriptionField = (
      <div className="PlaylistDescription__Description">
        <span
          className={`PlaylistDescription__Description--info DescriptionFont ${
            playListDescriptionStr === "" ? "AddDescriptionBtn" : ""
          }`}
        >
          {playListDescriptionStr}
          {playListDescriptionStr === "" && !isUnRegistered && isOwner && (
            <div
              className="AddDescription"
              onClick={this.enableNameEditMode.bind(this, "description")}
            >
              Add Desc{/* <MdOutlineDescription /> */}
            </div>
          )}
        </span>
        {!isUnRegistered && isOwner && (
          <div
            className={`PlaylistDescription__Description--editIcon ${
              playListDescriptionStr === "" && !isUnRegistered && isOwner
                ? "AddedDescriptionBtn"
                : ""
            }`}
            onClick={this.enableNameEditMode.bind(this, "description")}
          >
            <EditIcon fontSize="inherit" />
          </div>
        )}
      </div>
    );

    // {playListDescriptionStr !== "" && !isUnRegistered && isOwner ? (
    //   playListDescriptionStr
    // ) : (
    //   <div
    //     className="AddDescription"
    //     onClick={this.enableNameEditMode.bind(this, "description")}
    //   >
    //     Add Desc
    //   </div>
    // )}

    if (!isUnRegistered && editModeDescription === true) {
      descriptionField = (
        <div className="PlaylistDescription__Description EditMode">
          <textarea
            value={unescape(description)}
            onChange={this.handleChange("description")}
            autoFocus
            className="PlaylistDescription__Description--textarea"
          />
          <span className="PlaylistDescription__Description--approveNewName">
            <CloseIcon
              onClick={this.closeEditMode.bind(this)}
              fontSize="inherit"
            />
            {editedDescription === true ? (
              <DoneIcon
                fontSize="inherit"
                style={{ color: "var(--color-primary)" }}
                onClick={this.updatePlaylistMetaDescription}
              />
            ) : null}
          </span>
        </div>
      );
    }
    return (
      <div
        className={
          isMobileProp && window.innerWidth < 768
            ? "PlaylistDescription__Mobile__container"
            : "PlaylistDescription__container"
        }
      >
        <div className="PlaylistDescription__Wrapper">
          {coverImages}
          {nameField}
          {descriptionField}
          <div className="PlaylistDescription__Extra">
            <span className="DescriptionFont">
              {amountOfTracksProps === 1
                ? `${amountOfTracksProps} Track`
                : `${amountOfTracksProps} Tracks`}
            </span>
            {isMobileProp && window.innerWidth < 768 && (
              <span className="DescriptionFont">
                {amountOfMembersProp.length === 1
                  ? `${amountOfMembersProp.length} Member`
                  : `${amountOfMembersProp.length} Members`}
              </span>
            )}
            {!isUnRegistered && (
              <DeletePlaylistMenu
                className="PlaylistDescription__Extra--delete"
                openDeleteModalProp={() => openDeletePlaylistModal(playlistId)}
                openShareTabsModalProp={() =>
                  openShareTabsPlaylistModal(playlistId)
                }
                shareHandlerProp={this.props.openAddMemberModal}
                shareExternalHandlerProp={this.props.openAddMemberExternalModal}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    showError: (msg) => dispatch(showError(msg)),
    getPlaylistById: (id) => dispatch(getPlaylistById(id)),
    updatePlaylistMeta: () => dispatch(getAllPlaylists()),
    openAddMemberModal: () => dispatch(openAddMemberToPlaylistDialog()),
    openAddMemberExternalModal: () =>
      dispatch(openAddMemberExternalToPlaylistDialog()),
    openDeletePlaylistModal: (playlistId) =>
      dispatch(openDeletePlaylistDialog(playlistId)),
    openShareTabsPlaylistModal: (playlistId) =>
      dispatch(openShareTabsPlaylistDialog(playlistId)),
    openMemberOverviewModal: () => dispatch(openMemberOverview()),
  };
};

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
  };
};
export default withRouterCompat(
  connect(mapStateToProps, mapDispatchToProps)(PlayListDescription)
);
