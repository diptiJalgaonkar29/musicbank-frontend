import Add from "@mui/icons-material/Add";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import {
  getAllPlaylists,
  getPlaylistById,
  openCreateNewPlaylistDialog,
  setCreateNewPlaylistType,
} from "../../../redux/actions/playListActions/index";
import { getAllCommentsByPlaylistID } from "../../../redux/actions/playListCommentActions/index";
import "../../../_styles/MyMusicSideBar.css";

import { BrandingContext } from "../../../branding/provider/BrandingContext";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

class MyMusicSideBar extends React.Component {
  state = {
    id: null,
  };
  openCreateNewPlaylistDialog = () => {
    this.props.openCreateNewPlaylistModal();
    this.props.setCreateNewPlaylistType("withOutTracks");
  };

  loadPlaylistByIdHanlder(id) {
    this.props.getPlaylistById(id);
    this.props.getComments(id);

    this.props.navigate(`/mymusic/${id}`);
    this.setState({
      id,
    });
  }

  componentDidMount() {
    const urlString = this.props.location.pathname;
    const id = urlString.split("/")[2];
    if (id) {
      this.setState({
        id,
      });
    }
  }

  render() {
    const {
      playlistData,
      deletePlaylistDialogOpen,
      playlistToDelete,
      noplaylist,
    } = this.props;
    const { id } = this.state;

    return (
      <>
        <BrandingContext.Consumer>
          {({ config }) => (
            <React.Fragment>
              {config.modules.UpdateUItoV2 ? (
                // <div
                //   className="MyMusicSideBar__Item AddPlaylist"
                //   onClick={this.openCreateNewPlaylistDialog}
                //   style={{ justifyContent : noplaylist ? "center" : ""}}
                // >
                //   <Add />

                //   <span>
                //     <FormattedMessage id="playlist.page.createNew" />
                //   </span>
                // </div>

                <div className="playlist_add_btn_container">
                  <IconButtonWrapper
                    icon="Add"
                    // className="AddPlaylist"
                    onClick={this.openCreateNewPlaylistDialog}
                    style={{ justifyContent: noplaylist ? "center" : "" }}
                  />
                </div>
              ) : null}

              <div className="MyMusicSideBar__Wrapper">
                {playlistData
                  ? playlistData.map((item) => {
                      return (
                        <div
                          style={{
                            border:
                              deletePlaylistDialogOpen &&
                              playlistToDelete === item.id
                                ? "1px solid red"
                                : "",
                          }}
                          className="MyMusicSideBar__Item"
                          key={item.id}
                          onClick={this.loadPlaylistByIdHanlder.bind(
                            this,
                            item.id
                          )}
                          ref={this.simulateClick}
                        >
                          {" "}
                          <h4
                            className={
                              Number(id) === item.id ? "activeColor" : ""
                            }
                          >
                            {unescape(item.name)}
                          </h4>
                        </div>
                      );
                    })
                  : null}
              </div>
              {config.modules.UpdateUItoV2 ? null : (
                <div
                  className="MyMusicSideBar__Item AddPlaylist"
                  onClick={this.openCreateNewPlaylistDialog}
                >
                  <Add />

                  <span>
                    <FormattedMessage id="playlist.page.createNew" />
                  </span>
                </div>
              )}
            </React.Fragment>
          )}
        </BrandingContext.Consumer>
      </>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    openCreateNewPlaylistModal: () => dispatch(openCreateNewPlaylistDialog()),
    setCreateNewPlaylistType: (type) =>
      dispatch(setCreateNewPlaylistType(type)),
    getComments: (playlistID) =>
      dispatch(getAllCommentsByPlaylistID(playlistID)),
    getAllPlaylists: () => dispatch(getAllPlaylists()),
    getPlaylistById: (id) => dispatch(getPlaylistById(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    playlistData: state.playlist.PlaylistMetaData,
    deletePlaylistDialogOpen: state.playlist.deletePlaylistDialogOpen,
    shareTabsPlaylistDialogOpen: state.playlist.shareTabsPlaylistDialogOpen,
    playlistToDelete: state.playlist.playlistToDelete,
    playlistToShare: state.playlist.playlistToShare,
  };
};

export default withRouterCompat(
  connect(mapStateToProps, mapDispatchToProps)(MyMusicSideBar)
);
