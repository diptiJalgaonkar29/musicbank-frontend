import React, { Component } from "react";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import {
  showError,
  showSuccess,
} from "../../redux/actions/notificationActions";
import "../../_styles/BasketPage.css";
import BasketTracksTable from "../components/BasketTracksTable/BasketTracksTable";
import { Link } from "react-router-dom";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { setInitDownloadBasket } from "../../redux/actions/trackDownloads/tracksDownload";
import AsyncService from "../../networking/services/AsyncService";
import { getUserId } from "../../common/utils/getUserAuthMeta";

const checkRequiredAudioTypeFile = (track, audio_type) => {
  if (audio_type === "MP3") {
    return track?.preview_track_url;
  } else if (audio_type === "WAV") {
    return track?.track_url;
  } else if (audio_type === "STEM") {
    return track?.stems_zip_wav_url;
  }
};

class BasketPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackList: null,
      loading: true,
      downloadFormVisible: false,
    };

    this.fetchBasketData = this.fetchBasketData.bind(this);
    this.updateTrackList = this.updateTrackList.bind(this);
  }

  componentDidMount() {
    if (this.props?.downloadBasket?.isTrackDownloadingInBG) {
      this.props.navigate("/download_basket_form/");
      return;
    }
    this.fetchBasketData();
  }

  updateTrackList(newTrackList) {
    this.setState({ trackList: newTrackList });
  }

  fetchBasketData() {
    if (this.props?.downloadBasket?.tracksInDownloadBasket) {
      const idsArray = this.props?.downloadBasket?.tracksInDownloadBasket?.map(
        (track) => {
          return track.id;
        }
      );
      let uniqueIds = [...(new Set(idsArray) || [])];

      if (idsArray.length !== 0) {
        AsyncService.postData("/tracks/tracks_details_by_ids", uniqueIds)
          .then((res) => {
            // console.log(
            //   "tracksInDownloadBasket",
            //   this.props?.downloadBasket?.tracksInDownloadBasket
            // );
            var tracksInBasket =
              this.props?.downloadBasket?.tracksInDownloadBasket
                ?.map((track) => {
                  const result = res.data?.find((trackfromDB) => {
                    return (
                      trackfromDB?.id == track.id &&
                      !!checkRequiredAudioTypeFile(
                        trackfromDB,
                        track?.audio_type
                      )
                    );
                  });
                  if (!!result) {
                    return { ...result, ...track };
                  } else {
                    return null;
                  }
                })
                ?.filter(Boolean);
            this.setState({
              trackList: tracksInBasket,
              loading: false,
            });

            const newBasketCookieArray = tracksInBasket.map(
              ({ id, audio_type }) => ({
                id,
                audio_type,
              })
            );
            if (
              newBasketCookieArray?.length !==
              this.props?.downloadBasket?.tracksInDownloadBasket?.length
            ) {
              this.props.showSuccess(
                "Some of the tracks from your cart are not available and will be removed"
              );
            }
            const basketCookie = Cookies.get("basket")
              ? JSON.parse(Cookies.get("basket"))
              : {};
            const userId = getUserId()?.toString();
            basketCookie[userId] = newBasketCookieArray;
            // console.log("basketCookie", basketCookie);
            Cookies.set("basket", JSON.stringify(basketCookie));
            this.props.setInitDownloadBasket(newBasketCookieArray);
          })
          .catch((err) => {
            console.log("Error while fetching tracks details by ids", err);
          });
      }
    }
  }

  render() {
    const { trackList, loading } = this.state;
    const { downloadBasket } = this.props;

    return (
      <MainLayout>
        <div className="downloadBasketPage__container">
          <div
            className={"downloadBasketPage__wrapper"}
            style={{ color: "var(--color-white)" }}
          >
            {!downloadBasket?.tracksInDownloadBasket ||
            downloadBasket?.tracksInDownloadBasket?.length === 0 ? (
              <div className={"downloadBasket_Empty"}>
                <span className="downloadBasketPage__emptyheaderTextBox">
                  Your basket is empty !
                </span>
              </div>
            ) : (
              <>
                <div className={"downloadBasket_left"}></div>
                <div className={"downloadBasket_right"}>
                  <div className="downloadBasketPage__headerTextBox__container">
                    <span className="downloadBasketPage__headerTextBox boldFamily">
                      Download Basket
                    </span>
                    <div className={"download_zip_button_wrapper"}>
                      <Link to="/download_basket_form/">
                        <ButtonWrapper>Download</ButtonWrapper>
                      </Link>
                    </div>
                  </div>
                  <BasketTracksTable
                    loading={loading}
                    trackList={trackList}
                    updateTrackList={this.updateTrackList}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    downloadBasket: state.downloadBasket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showError: (msg) => dispatch(showError(msg)),
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    setInitDownloadBasket: (basketTracksInCookieByUser) =>
      dispatch(setInitDownloadBasket(basketTracksInCookieByUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasketPage);
