import React from "react";
import { connect } from "react-redux";


import Picture from "../../../common/components/AnimatedPicture/AnimatedPicture";
import AudioPlayer from "../../../common/components/Audiplayer/AudioPlayer.js";
import MediaService from "../../../common/services/MediaService";
import AddItemToPlaylistMenu from "../../../playlist/components/AddItemToPlaylistMenu/AddItemToPlaylistMenu";
import "../../../_styles/TrackCard.css";
import SimilarTrackIconPng from "../../../static/similar_track_ic.png";
import { MdQueue } from "react-icons/md";
import { withRouterCompat } from "../../../common/utils/withRouterCompat.js";

const INIT_TAGS_TO_SHOW = 20;
const REMOVE_WHITE_SPACES_REGEX = /\s/g;

class TrackCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      preview_image_data: null,
      preview_track_data: null,
      clickedOnImage: false,
      showMore: false,
      refined_items: [],
      allTags: [],
      waveformData: null,
    };
    this.tagClickHandler = this.tagClickHandler.bind(this);
  }

  componentDidMount() {
    this.loadImages();
    this.setState({
      allTags: this.getFilteredTags(),
    });
  }

  getFilteredTags() {
    const { search_result, allTags } = this.props;
    //console.log("track tags : "+allTags);
    if (search_result === null) {
      return [];
    }
    const searchResultWithoutWhiteSpace = search_result.replace(
      REMOVE_WHITE_SPACES_REGEX,
      ""
    );

    return allTags?.filter(
      (item) =>
        item.replace(REMOVE_WHITE_SPACES_REGEX, "") !==
        searchResultWithoutWhiteSpace
    );
  }

  loadImages() {
    const { preview_image_url, preview_track_url } = this.props;
    Promise.all([
      MediaService.getImage(preview_image_url),
      MediaService.getWaveform(preview_track_url),
    ]).then((res) => {
      this.setState({
        preview_image_data: res[0],
        waveformData: res[1],
        loading: false,
      });
    });
  }

  redirect = (id) => {
    this.props.navigate(`/track_page/${id}`);
  };

  redirectToSimilar = (id) => {
    this.props.navigate(`/track_page/${id}`);
  };

  handleShowMore = () => {
    this.setState({
      showMore: true,
    });
  };

  handleShowLess = () => {
    this.setState({
      showMore: false,
    });
  };

  tagClickHandler = (item) => {
    // console.log("tag click " + item.target.textContent);
  };

  trackList = [];

  addToQueue = () => {
    localStorage.setItem("typeOfTrackList", "queue");

    this.trackList = JSON.parse(localStorage.getItem("trackList"));

    this.trackList.push({
      id: this.props.indexProp,
      title: this.props.track_name,
      img: this.props.preview_image_url,
      mp3: this.props.preview_track_url,
    });

    localStorage.setItem("trackList", JSON.stringify(this.trackList));
  };

  render() {
    const { refinement_items_redux, search_result } = this.props;
    const { allTags } = this.state;

    let counter = 0;
    let all_tags_without_query = [...allTags];
    // SLICE TAGS TO 10

    // Filter Array by Refined Items
    let refinement_items_redux_filtered;
    // Filter out "" from the refinement Items Array from the Redux Store
    if (refinement_items_redux !== null) {
      refinement_items_redux_filtered = refinement_items_redux
        .filter(Boolean)
        .filter((el) => el !== search_result);
    }
    // Filter the displayed Tags from the refined items
    if (
      refinement_items_redux_filtered !== undefined &&
      refinement_items_redux_filtered.length > 0
    ) {
      all_tags_without_query = [...all_tags_without_query].filter(
        (el) => !refinement_items_redux_filtered.includes(el)
      );
    }

    let ButtonTORender = (
      <span onClick={this.handleShowMore} className="TrackCard__toggleTagsBtn">
        Show all &#8594;
      </span>
    );
    let RefinedItems = null;
    if (
      refinement_items_redux_filtered !== undefined &&
      refinement_items_redux_filtered.length > 0
    ) {
      counter = refinement_items_redux_filtered.length;
      RefinedItems = refinement_items_redux_filtered.map((item) => {
        return (
          <span className="activeColor" key={item}>
            {item}
          </span>
        );
      });
    }

    const toSlice = INIT_TAGS_TO_SHOW - counter;
    let slicedTags = all_tags_without_query.slice(0, toSlice);

    let TagsToRender = slicedTags.map((item) => {
      //console.log("tag - ", item)
      return (
        <>
          <span
            className="tagset"
            key={item}
            // onClick={this.tagClickHandler}
          >
            {item}
          </span>
        </>
      );
    });

    if (this.state.showMore) {
      TagsToRender = all_tags_without_query.map((item) => {
        return (
          <span className="tagset" key={item}>
            {item}
          </span>
        );
      });

      ButtonTORender = (
        <span
          onClick={this.handleShowLess}
          className="TrackCard__toggleTagsBtn"
        >
          &#8592; Show less
        </span>
      );
    }

    const playingIndexFromStore = this.props.playingIndex;
    return (
      <div className="TrackCard" key={this.props.indexProp}>
        <div className="TrackCard__Left">
          <div className="TrackCard__cover">
            <Picture
              key={this.props.indexProp}
              srcUrl={this.state.preview_image_data}
              loading={this.state.loading}
              index={this.props.indexProp}
              clickedOnImage={() => this.redirect(this.props.indexProp)}
            />
          </div>
          {this.props.cyaniteProfile && (
            <div className="actionMenuSet">
              {this.props.cyanite_id !== null && (
                <div className="similarTracksBtnBlock actionMenuIcons">
                  <span
                    className="similarTracksBtn"
                    style={{ backgroundImage: `url(${SimilarTrackIconPng})` }}
                    onClick={() => {
                      const win = window.open(
                        "/#/similar_tracks/" +
                          this.props.cyanite_id +
                          "-" +
                          this.props.indexProp
                      );
                      win.focus();
                    }}
                  ></span>
                </div>
              )}
              <AddItemToPlaylistMenu
                stClass="actionMenuIcons"
                trackCardIdProp={this.props.indexProp}
                trackCardNameProp={this.props.track_name}
              />

              <button onClick={this.addToQueue} id="queue">
                <MdQueue />
              </button>
            </div>
          )}
        </div>

        <div className="TrackCard__details">
          <div className="TrackCard__player" key={this.props.key}>
            <AudioPlayer
              key={this.props.indexProp}
              songUrl={this.props.preview_track_url}
              track_length={this.props.track_length}
              index={this.props.indexProp}
              waveformDataProp={this.state.waveformData}
              playFromPicture={this.state.clickedOnImage}
              type="Tc"
              active={
                playingIndexFromStore !== null &&
                playingIndexFromStore === this.props.indexProp
              }
              // shubham goPhygital
              trackCardNameProp={this.props.track_name}
              srcUrl={this.props.preview_image_url}
            />
          </div>
          <div className="TrackCard__title__container">
            <p
              className="TrackCard__item__title"
              onClick={() => this.redirect(this.props.indexProp)}
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              {this.props.track_name}{" "}
              {/* ({this.props.tempo} {this.props.tag_tempo}) */}
            </p>
            {!this.props.cyaniteProfile && (
              <AddItemToPlaylistMenu
                trackCardIdProp={this.props.indexProp}
                trackCardNameProp={this.props.track_name}
              />
            )}
          </div>

          <div className="TrackCard__item__tags">
            {this.props.search_result ? (
              <span className="activeColor">{this.props.search_result}</span>
            ) : null}

            {RefinedItems}
            {TagsToRender}
            {/* <CustomRefinementList attribute={slicedTags} operator="and" /> */}
            <br />
            {ButtonTORender}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playingIndex: state.player.playingIndex,
    search_result: state.search.search_result,
    refinement_items_redux: state.search.refinement_items,
  };
};

export default withRouterCompat(connect(mapStateToProps)(TrackCard));
