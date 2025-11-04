import React from "react";
import { connect } from "react-redux";

import MediaService from "../../common/services/MediaService";
import "./CyaniteSearchBlockCard.css";
import Iframe from "react-iframe";
import ChipWrapper from "../../branding/componentWrapper/ChipWrapper";
import { LazyLoadComponent } from "../../common/components/LazyLoadComponent/LazyLoadComponent";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

//addition by Trupti-Wits -testing

// const INIT_TAGS_TO_SHOW = 20;
const REMOVE_WHITE_SPACES_REGEX = /\s/g;
var self;

class SpotifySearchBlockCard extends React.Component {
  state = {
    loading: true,
    preview_image_data: null,
    preview_track_data: null,
    clickedOnImage: false,
    showMore: false,
    refined_items: [],
    moodTags: [],
    genreTags: [],
    voiceProfile: null,
    waveformData: null,
  };

  componentDidMount() {
    // console.log("componentDidMount " + this.props.preview_image_url);
    //this.getTrackCover();
    //this.loadImages();
    /* this.setState({
            moodTags: this.getMoodFilteredTags(),
            genreTags: this.getGenreFilteredTags()            
        }); */
  }

  getDominantVoiceProfile(voiceArr) {
    // console.log("getDominantVoiceProfile ", voiceArr);
    if (voiceArr !== undefined) {
      var obj = voiceArr;
      var newObJ = Object.keys(obj).map(function (key) {
        return { key: key, value: obj[key] };
      });
      var max = Math.max.apply(
        null,
        newObJ.map(function (el) {
          return el.value;
        })
      );
      var output = newObJ.filter(function (el) {
        return el.value === max;
      })[0];
      //console.log("getDominantVoiceProfile ", output.key);
      return this.capitalizeFirstLetter(output.key);
    }
  }

  getMajorKey(keyArr) {
    var keyArray = keyArr;
    //get max value in array
    var keyVal = "";
    if (keyArray !== undefined && keyArray.length > 0) {
      var maxOfKey = Math.max(...keyArray);
      //get index of max value in array
      var indexOfMaxOfKey = keyArray.indexOf(maxOfKey);
      keyVal = keyArr.values[indexOfMaxOfKey];
      keyVal = keyVal !== undefined ? keyVal : "";
    }
    return keyVal;
  }

  getMoodFilteredTags() {
    // console.log("getMoodFilteredTags");
    const { search_result, moodTags } = this.props;

    if (search_result === null) {
      return [];
    }
    const searchResultWithoutWhiteSpace = search_result.replace(
      REMOVE_WHITE_SPACES_REGEX,
      ""
    );

    return moodTags.filter(
      (item) =>
        item.replace(REMOVE_WHITE_SPACES_REGEX, "") !==
        searchResultWithoutWhiteSpace
    );
  }

  getGenreFilteredTags() {
    // console.log("getGenreFilteredTags");
    const { search_result, genreTags } = this.props;
    //console.log("track genre tags : "+genreTags);
    if (search_result === null) {
      return [];
    }
    const searchResultWithoutWhiteSpace = search_result.replace(
      REMOVE_WHITE_SPACES_REGEX,
      ""
    );

    return genreTags.filter(
      (item) =>
        item.replace(REMOVE_WHITE_SPACES_REGEX, "") !==
        searchResultWithoutWhiteSpace
    );
  }

  getTagsFlatList(tagArr) {
    // console.log("getTagsFlatList");
    var flatTagStr = tagArr.map((item) => {
      return self.capitalizeFirstLetter(item);
    });
    flatTagStr = flatTagStr.toString();
    return flatTagStr;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  getTrackCover() {
    const { preview_image_url } = this.props;
    if (preview_image_url !== undefined) {
      Promise.all([MediaService.getImage(preview_image_url)]).then((res) => {
        this.setState({
          preview_image_data: res[0],
          loading: false,
        });
      });
    }
  }

  redirect = (id) => {
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

  StringArrayToDisplayString(string) {
    if (!string) return "";
    let stringArray = string?.join(", ");
    return stringArray?.charAt(0)?.toUpperCase() + stringArray?.slice(1);
  }

  render() {
    // const { refinement_items_redux, search_result } = this.props;
    // const { moodTags, genreTags } = this.state;
    self = this;

    // let counter = 0;
    //let all_tags_without_query = [...allTags];
    // let all_tags_without_query = [...moodTags, ...genreTags];
    // SLICE TAGS TO 10

    // Filter Array by Refined Items
    // let refinement_items_redux_filtered;
    // Filter out "" from the refinement Items Array from the Redux Store
    // if (refinement_items_redux !== null) {
    //   refinement_items_redux_filtered = refinement_items_redux
    //     .filter(Boolean)
    //     .filter((el) => el !== search_result);
    // }
    // Filter the displayed Tags from the refined items
    // if (
    //   refinement_items_redux_filtered !== undefined &&
    //   refinement_items_redux_filtered.length > 0
    // ) {
    //   all_tags_without_query = [...all_tags_without_query].filter(
    //     (el) => !refinement_items_redux_filtered.includes(el)
    //   );
    // }

    // let ButtonTORender = (
    //   <span onClick={this.handleShowMore} className="TrackCard__toggleTagsBtn">
    //     Show all &#8594;
    //   </span>
    // );
    // let RefinedItems = null;
    // if (
    //   refinement_items_redux_filtered !== undefined &&
    //   refinement_items_redux_filtered.length > 0
    // ) {
    //   counter = refinement_items_redux_filtered.length;
    //   RefinedItems = refinement_items_redux_filtered.map((item) => {
    //     return (
    //       <span className="activeColor" key={item}>
    //         {item}
    //       </span>
    //     );
    //   });
    // }

    // const toSlice = INIT_TAGS_TO_SHOW - counter;
    // let slicedTags = all_tags_without_query.slice(0, toSlice);

    // let TagsToRender = slicedTags.map((item) => {
    //   return (
    //     <span className="tagset" key={item}>
    //       {item}
    //     </span>
    //   );
    // });

    // if (this.state.showMore) {
    //   TagsToRender = all_tags_without_query.map((item) => {
    //     return (
    //       <span className="tagset" key={item}>
    //         {item}
    //       </span>
    //     );
    //   });

    //   ButtonTORender = (
    //     <span
    //       onClick={this.handleShowLess}
    //       className="TrackCard__toggleTagsBtn"
    //     >
    //       &#8592; Show less
    //     </span>
    //   );
    // }

    let sptIframe =
      "https://open.spotify.com/embed/track/" + this.props.id + "?theme=0";
    return (
      <>
        {
          <tr>
            <td>
              <LazyLoadComponent ref={React.createRef()}>
                <Iframe
                  src={sptIframe}
                  width="auto"
                  height="80"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                />
              </LazyLoadComponent>
            </td>
            <td>{this.props.bpm}</td>
            {/* <td>time-sig4/4</td> */}
            <td>{this.props.dmkey}</td>
            <td>
              {/* <span className="st-tbl-sel-2">{this.props.voice}</span> */}
              <ChipWrapper className="st-tbl-sel-2" label={this.props.voice} />
            </td>
            {/* <td><span className="st-tbl-sel-3">Low</span></td> */}
            <td>{this.StringArrayToDisplayString(this.props.genreTags)}</td>
            {/* <td>EDM Tags</td> */}
            <td>{this.StringArrayToDisplayString(this.props.moodTags)}</td>
            <td>{this.props.valence.toFixed(2)}</td>
            <td>{this.props.arousal.toFixed(2)}</td>
            <td>{this.props.version}</td>
            {/* <td>
                            <div className="st-tbl-action">
                                <span className="st-btn-action">Details</span> <span className="st-btn-action-sep">|</span> <span className="st-btn-action">Similarity</span>
                            </div>
                        </td> */}
          </tr>
        }
      </>
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

export default withRouterCompat(connect(mapStateToProps)(SpotifySearchBlockCard));
