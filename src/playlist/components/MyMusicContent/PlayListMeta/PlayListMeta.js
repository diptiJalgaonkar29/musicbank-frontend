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
import getConfigJson from "../../../../common/utils/getConfigJson";
import AsyncService from "../../../../networking/services/AsyncService";
import ButtonWrapper from "../../../../branding/componentWrapper/ButtonWrapper";
import TextAreaWrapper from "../../../../branding/componentWrapper/TextAreaWrapper";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import { getUserId } from "../../../../common/utils/getUserAuthMeta";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import { withRouterCompat } from "../../../../common/utils/withRouterCompat";
// import { MdOutlineDescription } from "react-icons/md";

//addition by Trupti-Wits

class PlaylistMeta extends React.Component {
  state = {
    editModeCoverImage: false,
    editModeName: false,
    editModeDescription: false,
    editedName: false,
    editedDescription: false,
    name: "",
    description: "",
    coverImageName: "",
    coverImageFile: null,
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

  validateFileExtension(fileName) {
    var exp = /^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/;
    // console.log("***", fileName, exp.test(fileName));

    return exp.test(fileName);
  }
  static contextType = BrandingContext;
  // UPDATE PLAYLOIST LOGIC HANLDER
  updatePlaylistMetaDescription = async () => {
    //////////////////////////
    // PUT UPDATE LOGIC HERE//
    //////////////////////////

    const playlistId = this.props.playlistId;
    const name = this.state.name;
    const description = this.state.description;
    let coverImageName = this.state.coverImageName;
    const USER_ID = getUserId();

    const { jsonConfig: CONFIG } = this.context;
    if (name?.length > 100 || description?.length > 300 || name?.length > 100) {
      // console.log("inside if", name, description, coverImageName);
      if (description.length > 300) {
        this.props.showError("Description is too long, maximum 300 Chars");
        return;
      }
      if (name.length > 100) {
        this.props.showError("Playlist Title is too long, maximum 100 Chars");
        return;
      }
      if (coverImageName?.length > 100) {
        this.props.showError(
          "Playlist Cover Image Name is too long, maximum 100 Chars"
        );
        return;
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

    if (
      USER_ID === Number(localStorage.getItem("playlistCuratorId")) &&
      coverImageName !== ""
    ) {
      if (!this.validateFileExtension(coverImageName)) {
        this.props.showError("Enter valid Cover Image Name");
        return;
      }
    }
    if (this.state.coverImageFile) {
      let assetFormData = new FormData();
      assetFormData.append("playListCoverImage", this.state.coverImageFile);
      let assetResponse = await AsyncService.postFormData(
        `/playlists/uploadPlayListCoverImage`,
        assetFormData
      );
      // console.log("assetResponse", assetResponse?.data?.playListCoverImage);
      coverImageName = assetResponse?.data?.playListCoverImage;
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

    // console.log("event.target.value", event?.target?.value);
    // console.log("event.detail.value ", event?.detail?.value);

    this.setState({
      [name]: event?.detail?.value ?? event.target.value,
    });
  };
  
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
      coverImageFile,
      editedDescription,
      editedName,
      editedCoverImage,
    } = this.state;

    const { jsonConfig: CONFIG } = this.context;

    var playListNameStr = unescape(playListName);
    var playListDescriptionStr = unescape(playListDescription);
    var playListCoverImageStr = unescape(playListCoverImage);
    const USER_ID = getUserId();

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
            // <div
            //   className="PlaylistCoverImage--editIcon"
            //   onClick={this.enableNameEditMode.bind(this, "coverImage")}
            // >
            //   <EditIcon fontSize="inherit" />
            // </div>
            <IconButtonWrapper
              icon="Edit"
              className="PlaylistCoverImage--editIcon"
              onClick={this.enableNameEditMode.bind(this, "coverImage")}
            />
          )}
      </div>
    );

    if (!isUnRegistered && editModeCoverImage === true) {
      coverImages = (
        <div>
          <div className="PlaylistCoverImage--label">Upload Cover Image</div>
          <div className="PlaylistCoverImage">
            <TextAreaWrapper
              value={unescape(coverImageName)}
              autoFocus
              onChange={this.handleChange("coverImageName")}
              className="PlaylistCoverImage--textarea"
              readOnly
              placeholder="-"
            />
            <span className="PlaylistCoverImage--approveNewName">
              <IconButtonWrapper
                icon="Close"
                onClick={this.closeEditMode.bind(this)}
              />

              {editedCoverImage && (
                <IconButtonWrapper
                  icon="Done"
                  onClick={this.updatePlaylistMetaDescription}
                />
              )}
            </span>
            <span className="PlaylistCoverImage--approveNewName">
              {!!coverImageName && (
                <ButtonWrapper
                  onClick={() => {
                    this.setState({
                      coverImageName: "",
                      coverImageFile: null,
                      editedCoverImage: true,
                    });
                  }}
                >
                  Remove
                </ButtonWrapper>
              )}

              <div
                className="file-upload-wrapper"
                id="file-upload-wrapper"
                data-text="Select cover image"
              >
                <input
                  name="file-upload-field"
                  type="file"
                  className="file-upload-field"
                  value=""
                  title=""
                  accept="image/*"
                  onChange={(e) => {
                    this.setState({
                      coverImageName:
                        e.target?.files[0]?.name || coverImageName || "",
                      coverImageFile:
                        e.target?.files[0] || coverImageFile || null,
                      editedCoverImage: true,
                    });
                  }}
                />
              </div>
            </span>
          </div>
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
          <IconButtonWrapper
            className="PlaylistDescription__Name--editIcon"
            icon="Edit"
            onClick={this.enableNameEditMode.bind(this, "name")}
          />
        )}
      </div>
    );

    if (!isUnRegistered && editModeName === true) {
      nameField = (
        <div className="PlaylistDescription__Name">
          <TextAreaWrapper
            value={unescape(name)}
            autoFocus
            onChange={this.handleChange("name")}
            className="PlaylistDescription__Name--textarea"
          />
          <span className="PlaylistDescription__Name--approveNewName">
            <IconButtonWrapper
              icon="Close"
              onClick={this.closeEditMode.bind(this)}
            />
            {editedName === true ? (
              <IconButtonWrapper
                icon="Done"
                onClick={this.updatePlaylistMetaDescription}
              />
            ) : null}
          </span>
        </div>
      );
    }

    // DESCRIPTION - EDIT FIELD
    // let descriptionField = (
    //   <div className="PlaylistDescription__Description">
    //     <span
    //       className={`PlaylistDescription__Description--info DescriptionFont ${
    //         playListDescriptionStr === "" ? "AddDescriptionBtn" : ""
    //       }`}
    //     >
    //       <span className="PlaylistDescription__Description--info--span">
    //         {playListDescriptionStr || "-"}
    //       </span>
    //       {/* {playListDescriptionStr === "" && !isUnRegistered && isOwner && (
    //         <ButtonWrapper
    //           className="AddDescription"
    //           onClick={this.enableNameEditMode.bind(this, "description")}
    //         >
    //           Add description
    //         </ButtonWrapper> 
    //       )} */}
    //     </span>
    //     {!isUnRegistered && isOwner && (
    //       <IconButtonWrapper
    //         className={`PlaylistDescription__Description--editIcon ${
    //           playListDescriptionStr === "" && !isUnRegistered && isOwner
    //             ? "AddedDescriptionBtn"
    //             : ""
    //         }`}
    //         icon="Edit"
    //         onClick={this.enableNameEditMode.bind(this, "description")}
    //       />
    //     )}
    //   </div>
    // );

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

    // if (!isUnRegistered && editModeDescription === true) {
    //   descriptionField = (
    //     <div className="PlaylistDescription__Description">
    //       <TextAreaWrapper
    //         value={unescape(description)}
    //         onChange={this.handleChange("description")}
    //         autoFocus
    //       />
    //       <span className="PlaylistDescription__Description--approveNewName">
    //         <IconButtonWrapper
    //           icon="Close"
    //           onClick={this.closeEditMode.bind(this)}
    //         />
    //         {editedDescription === true ? (
    //           <IconButtonWrapper
    //             icon="Done"
    //             onClick={this.updatePlaylistMetaDescription}
    //           />
    //         ) : null}
    //       </span>
    //     </div>
    //   );
    // }
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
          {/* {descriptionField} */}
          <div className="PlaylistDescription__Extra">
            <span className="DescriptionFont">
              {!amountOfTracksProps
                ? `0 Track`
                : amountOfTracksProps === 1
                ? `${amountOfTracksProps} Track`
                : `${amountOfTracksProps} Tracks`}
            </span>
            {isMobileProp && window.innerWidth < 768 && (
              <span className="DescriptionFont">
                {amountOfMembersProp?.length === 1
                  ? `${amountOfMembersProp?.length} Member`
                  : `${amountOfMembersProp?.length} Members`}
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
  connect(mapStateToProps, mapDispatchToProps)(PlaylistMeta)
);
