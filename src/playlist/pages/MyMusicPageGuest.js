import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { withStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { getPlaylistDataUnregistered } from "../../redux/actions/playListActions";
import { getAllCommentsByPlaylistID } from "../../redux/actions/playListCommentActions";
import MyMusicContent from "../components/MyMusicContent/MyMusicContent";
import MemberOverviewModal from "../components/PlaylistMembers/MemberOverviewModal/MemberOverviewModal";
import MemberOverviewModalGuest from "../components/PlaylistMembers/MemberOverviewModal/MemberOverviewModalGuest";
import MyMusicPageHoc from "../layout/MyMusicPageHoc";
import PlaylistService from "../services/PlaylistService";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

const stylesInvalidPop = {
  messageBox: {
    maxWidth: "300px",
    margin: "20px auto",
    textAlign: "center",
  },
};

let isLinkValid = true;
let isPlaylistNotFound = false;
let chkPlaylistID = "";
let mcode = "";

let playlistData = "";

let validityChecked = false;

//http://localhost:8080/api/playlists/playlistMcodeDetails
//http://localhost:3000/#/mymusic/102/be743789-2777-4be1-a7e4-e83659047d10
//http://localhost:3000/api/playlists/playlistMcodeDetails
//http://localhost:3000/#/mymusic/102/90eed7b9-7298-49e1-8654-8815d62a2b2a

//http://localhost:3000/#/mymusic/125/d3c5af3b-2141-4131-8748-6ce6b4109952

//http://localhost:3000/#/mymusic/125/9f944119-9be2-4baa-aef8-d10cf97c4e77 (30days)

//http://localhost:3000/#/mymusic/126/c7e325e1-8a4b-48f9-bb5b-3f4481a43f58 - no comments

//unregisteredMembers = '{"members":[{"id":64,"email":"trupti1105@gmail.com"},{"id":83,"email":"truptipawar.developer@gamil.com"}]}';

class MyMusicPageGuest extends Component {
  UNSAFE_componentWillMount() {
    // console.log('UNSAFE_componentWillMount');
    // DISPATCH GET PLAYLIST DATDA BY ID, SAVE TRACK IDS INTO REDUX STORE
    //this.props.getAllPlaylists();
  }

  componentDidMount() {
    // console.log('componentDidMount');
    // console.log('guest page');
    /// POSSIBLE LOGIC FOR REDIRECT USER FROM URL NOT FINAL !!! ///
    // first check if link is valid

    const isUrlFromUser = this.props.match.params;
    if (
      isUrlFromUser.constructor === Object &&
      Object.entries(isUrlFromUser).length !== 0
    ) {
      // ID GIVEN

      const id = this.props.match.params.id;
      chkPlaylistID = this.props.match.params.id;
      mcode = this.props.match.params.mcode;
      if (mcode !== undefined) {
        //////////////
        let validateFor = JSON.stringify(
          {
            mcode: mcode,
            playlistid: id,
          },
          null,
          2
        );

        PlaylistService.getLinkValidity(validateFor).then((res) => {
          playlistData = res;
          //unregisteredMembers = res.unregisteredMembers
          if (res?.message === "PlaylistNotFound") {
            isPlaylistNotFound = true;
          } else if (res.status === false) {
            isLinkValid = false;
          } else {
            isLinkValid = true;
          }

          validityChecked = true;
          this.setState({ validityChecked: true });
          if (isLinkValid) {
            this.props.getPlaylistDataUnregistered(playlistData);
            this.props.getComments(id);
          }
        });
      } else {
        //console.log();
      }
    }
  }

  render() {
    if (validityChecked) {
      if (isPlaylistNotFound) {
        return (
          <>
            <Card style={stylesInvalidPop.messageBox} variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  <FormattedMessage id="playlist.extra.playlistnotfound" />
                </Typography>
              </CardContent>
            </Card>
          </>
        );
      }
      //SWITCH CASE IF THERE IS NO PLAYLIST AVAILABLE
      else if (!isLinkValid) {
        //alert("not valid")
        return (
          <>
            <Card style={stylesInvalidPop.messageBox} variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  <FormattedMessage id="playlist.extra.invalidlink" />
                </Typography>
              </CardContent>
            </Card>
          </>
        );
      } else {
        const {
          PlaylistMetaData,
          PlaylistByIdDataLoading,
          PlaylistByIdData,
          playlistDoesntExist,

          openMemberOverviewState,
          openMemberOverviewGuestState,
        } = this.props;
        const renderContent = (config) => {
          // alert(chkPlaylistID);
          let content = (
            <MyMusicContent
              loadingProp={PlaylistByIdDataLoading}
              dataProp={PlaylistByIdData}
              playlistDoesntExistProp={playlistDoesntExist}
              isUnRegistered={true}
              mCode={mcode}
              chkPlaylistID={chkPlaylistID}
              config={config}
            />
          );

          if (Array.isArray(PlaylistMetaData)) {
            // CASE NO PLAYLISTS
            if (PlaylistMetaData.length === 0) {
              content = (
                <div className="MyMusic__Content--noPlaylist">
                  <h2>
                    <FormattedMessage id="playlist.page.noPlaylist" />
                  </h2>
                </div>
              );
            } else {
              //NOT LOADING
              content = (
                <MyMusicContent
                  loadingProp={PlaylistByIdDataLoading}
                  dataProp={PlaylistByIdData}
                  playlistDoesntExistProp={playlistDoesntExist}
                  isUnRegistered={true}
                  mCode={mcode}
                  chkPlaylistID={chkPlaylistID}
                  config={config}
                />
              );
            }
          }

          return content;
        };
        return (
          <>
            <BrandingContext.Consumer>
              {({ config }) => (
                <React.Fragment>
                  <MemberOverviewModal
                    isUnRegistered={true}
                    openProp={openMemberOverviewState}
                  />
                  <MemberOverviewModalGuest
                    isUnRegistered={true}
                    openProp={openMemberOverviewGuestState}
                  />
                  <MyMusicPageHoc isUnRegistered={true}>
                    {renderContent(config)}
                  </MyMusicPageHoc>
                </React.Fragment>
              )}
            </BrandingContext.Consumer>
          </>
        );
      }
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComments: (playlistID) =>
      dispatch(getAllCommentsByPlaylistID(playlistID, true, mcode)),

    getPlaylistDataUnregistered: (playlistData) =>
      dispatch(getPlaylistDataUnregistered(playlistData)),
  };
};

const mapStateToProps = (state) => {
  return {
    validityChecked: false,
    PlaylistMetaData: state.playlist.PlaylistMetaData,
    PlaylistByIdDataLoading: state.playlist.PlaylistByIdDataLoading,
    PlaylistByIdData: state.playlist.PlaylistByIdData,

    playlistDoesntExist: state.playlist.playlistDoesntExist,

    openMemberOverviewState: state.playlistMember.memberOverviewDialogOpen,
    openMemberOverviewGuestState:
      state.playlistMember.memberOverviewDialogGuestOpen,
  };
};

export default withRouterCompat(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(stylesInvalidPop)(MyMusicPageGuest))
);
