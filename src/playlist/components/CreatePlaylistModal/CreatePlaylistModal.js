import { withStyles } from "@mui/styles";
import { Field, Formik } from "formik";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
// Helper
import { connect } from "react-redux";
import * as Yup from "yup";
// Local
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import {
  closeCreateNewPlaylistDialog,
  getPlaylistById,
} from "../../../redux/actions/playListActions";
import PlaylistService from "../../services/PlaylistService";
import getConfigJson from "../../../common/utils/getConfigJson";
import "./CreatePlaylistModal.css";
import AsyncService from "../../../networking/services/AsyncService";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import TextAreaWrapper from "../../../branding/componentWrapper/TextAreaWrapper";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import FileInputWrapper from "../../../branding/componentWrapper/FileInputWrapper";
import { getAllCommentsByPlaylistID } from "../../../redux/actions/playListCommentActions";
import {
  playlistDoesntExist,
  savePlaylistMetaData,
  startFetchingsavePlaylistMetaData,
} from "../../../redux/actions/playListActions/playListActions";
import { getUserId } from "../../../common/utils/getUserAuthMeta";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

const styles = {
  dialogPaper: {
    transform: "translateY(-10rem)",
    backgroundColor: "var(--color-card)",
    boxShadow: "none",
    color: "var(--color-white)",
    borderRadius: "0px",
  },
  dialogContent: {
    paddingTop: "3rem",
    paddingBottom: "2rem",
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
  coverImageUploadBtnWrapper: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    textAlign: "center",
  },
  coverImageUploadBtn: {
    border: "none",
    color: "var(--color-white)",
    backgroundColor: "var(--color-primary)",
    padding: "6px 8px",
    borderRadius: "20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  coverImageFileInput: {
    fontSize: "100px",
    position: "absolute",
    left: "0",
    top: "0",
    opacity: "0",
    height: "30px",
    width: "100%",
  },
  coverImageFilename: {
    fontSize: "16px",
  },
};

const SUPPORTED_FORMATS = ["image/"];

const SignupSchema = Yup.object().shape({
  Playlist_name: Yup.string()
    .min(1, "Too Short!")
    .max(100, "Too Long!")
    .trim()
    .required("Required"),
  Playlist_description: Yup.string()
    .trim()
    .min(1, "Too Short!")
    .max(300, "Too Long!"),
  Playlist_cover_image: Yup.mixed().test(
    "fileFormat",
    "Unsupported Format",
    (value) => {
      // console.log("value", value, !value);
      // console.log("value.type", value?.type);
      // console.log("SUPPORTED_FORMATS", SUPPORTED_FORMATS);
      if (!value) return true;
      return SUPPORTED_FORMATS.some((format) =>
        value?.type?.startsWith(format)
      );
    }
  ),
});

class CreatePlaylistModal extends React.Component {
  state = {
    open: false,
    cover_image_file: null,
  };

  createNewPlaylist = () => {
    this.props.showSuccess("Success: Created New Playlist");
  };

  handleClose = () => {
    this.props.closeCreateNewPlaylistModal();
  };

  validateFileExtension(fileName) {
    var exp = /^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/;
    // console.log("***", fileName, exp.test(fileName));

    return exp.test(fileName);
  }
  static contextType = BrandingContext;

  render() {
    const { classes, openProp, hasTracks, trackID, calledFromPlaylist } =
      this.props;

    //////
    // ADD CAS IF CREATE NEW PLAYLIST WITH TRACK ID OR WITHOUT
    //if (hasTracks === false) {
    // THIS MEANS THE NEW PLAYLIST DO NOT HAVE AN INITIAL TRACK
    //}
    //////
    const { jsonConfig: CONFIG } = this.context;
    const USER_ID = getUserId();

    return (
      <div>
        <ModalWrapper
          isOpen={openProp}
          onClose={this.handleClose}
          title="Create New Playlist"
        >
          <Formik
            initialValues={{
              Playlist_name: "",
              Playlist_description: "",
              Playlist_cover_image: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values, actions) => {
              let assetResponse;
              if (values.Playlist_cover_image) {
                let assetFormData = new FormData();
                assetFormData.append(
                  "playListCoverImage",
                  values.Playlist_cover_image
                );
                assetResponse = await AsyncService.postFormData(
                  `/playlists/uploadPlayListCoverImage`,
                  assetFormData
                );
                // console.log(
                //   "assetResponse",
                //   assetResponse?.data?.playListCoverImage
                // );
              }
              // if (
              //   !this.validateFileExtension(
              //     escape(values.Playlist_cover_image)
              //   ) &&
              //   escape(values.Playlist_cover_image) !== ""
              // ) {
              //   this.props.showError("Enter valid Cover Image Name");
              //   return;
              // }
              //const toIdArray = (id) =>
              //Array.isArray(id) ? id.map((e) => [{ id: e }]) : [{ id }];
              const data = JSON.stringify(
                {
                  //name: escapeStringRegexp(values.Playlist_name),
                  //description: escapeStringRegexp(values.Playlist_description),
                  name: escape(values.Playlist_name),
                  description: escape(values.Playlist_description),
                  coverImage: assetResponse?.data?.playListCoverImage || null,
                  // ADD TRACK ID IF YOU DONT COME FROM MY MUSIC PAGE
                  tracks:
                    !calledFromPlaylist && trackID && hasTracks ? trackID : [],
                },
                null,
                2
              );

              // console.log("data", data);

              //////////////////
              //!POST REQUEST!//
              //////////////////
              PlaylistService.create(data)
                .then(() => {
                  this.props.showSuccess("Sucess: Created new Playlist");
                  this.handleClose();
                  actions.resetForm({});
                  actions.setSubmitting(false);
                  actions.setStatus({ success: true });

                  if (hasTracks === false) {
                    // Refetch playlist data TO DISPLAY NEW PLAYLIST ON SIDEBAR
                    // Refetch playlist data
                    this.props.startFetchingsavePlaylistMetaData();
                    PlaylistService.getAll().then((res) => {
                      console.log("create res", res);

                      if (res.length === 0) {
                        this.props.savePlaylistMetaData([]);
                        this.props.playlistDoesntExist();
                        this.props.navigate("/mymusic");
                      } else {
                        res.forEach((item) => {
                          delete item.tracks;
                        });
                        this.props.savePlaylistMetaData(res);
                        let id = res[0].id;
                        this.props.getPlaylistById(id);
                        this.props.getComments(id);
                        this.props.navigate(`/mymusic/${id}`);
                      }
                    });
                  }
                })
                .catch(() => {
                  this.props.showError(
                    "Something went wrong creating a New Playlist, please try again"
                  );
                });
              ///////////////////////////
              //////////////////////////
              //////////////////////////
            }}
            render={(props) => {
              const { errors, touched, handleSubmit } = props;
              return (
                <form onSubmit={handleSubmit} className="create_playlist_form">
                  <SonicInputLabel htmlFor="Playlist_name">
                    <FormattedMessage id="playlist.create.nameInputTitle" />
                  </SonicInputLabel>
                  <Field
                    id="Playlist_name"
                    name="Playlist_name"
                    // autoFocus
                    type="text"
                    placeholder={`${this.props.intl.messages["playlist.create.nameInputPlaceHolder"]}`}
                    component={InputWrapper}
                  />
                  {errors.Playlist_name && touched.Playlist_name && (
                    <p className="ss_error_msg">{errors.Playlist_name}</p>
                  )}
                  <br />
                  <br />
                  <SonicInputLabel htmlFor="Playlist_description">
                    <FormattedMessage id="playlist.create.descriptionInputTitle" />
                  </SonicInputLabel>
                  <Field
                    id="Playlist_description"
                    name="Playlist_description"
                    type="text"
                    placeholder={`${this.props.intl.messages["playlist.create.descriptionInputPlaceHolder"]}`}
                    component={TextAreaWrapper}
                    rows="6"
                  />
                  {errors.Playlist_description &&
                    touched.Playlist_description && (
                      <p className="ss_error_msg">
                        {errors.Playlist_description}
                      </p>
                    )}

                  {USER_ID ===
                    Number(localStorage.getItem("playlistCuratorId")) && (
                    <>
                      <br />
                      <br />

                      <SonicInputLabel htmlFor="playlist_cover_ref">
                        <FormattedMessage id="playlist.create.coverImageInputTitle" />
                      </SonicInputLabel>
                      <Field
                        id="playlist_cover_ref"
                        name="Playlist_cover_image"
                        type="file"
                        accept="image/*"
                        placeholder={`${this.props.intl.messages["playlist.create.coverImageInputPlaceHolder"]}`}
                        component={FileInputWrapper}
                        variant="outlined"
                      />
                      {errors.Playlist_cover_image && (
                        <p className="ss_error_msg">
                          {errors.Playlist_cover_image}
                        </p>
                      )}
                    </>
                  )}

                  <div className={classes.DialogActions}>
                    <ButtonWrapper
                      variant="outlined"
                      onClick={this.handleClose}
                    >
                      <FormattedMessage id="playlist.create.decline" />
                    </ButtonWrapper>
                    <ButtonWrapper
                      type="submit"
                      disabled={!props?.values?.Playlist_name}
                    >
                      <FormattedMessage id="playlist.create.accept" />
                    </ButtonWrapper>
                  </div>
                </form>
              );
            }}
          />
        </ModalWrapper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeCreateNewPlaylistModal: () => dispatch(closeCreateNewPlaylistDialog()),
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
    hasTracks: state.playlist.createNewPlaylistDialogType === "withTracks",
    trackID: state.playlist.trackIDToAddToNewPlaylist,
    authentication: state.authentication,
  };
};
export default withRouterCompat(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectIntl(withStyles(styles)(CreatePlaylistModal)))
);
