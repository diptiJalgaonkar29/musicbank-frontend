import React from "react";
import { connect } from "react-redux";

import MediaService from "../../common/services/MediaService";
import TrackMetaPlayer from "./TrackMetaPlayer";

import "./CyaniteSearchBlockCard.css";
import ChipWrapper from "../../branding/componentWrapper/ChipWrapper";
import { LazyLoadComponent } from "../../common/components/LazyLoadComponent/LazyLoadComponent";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

// const INIT_TAGS_TO_SHOW = 20;
const REMOVE_WHITE_SPACES_REGEX = /\s/g;
var self;

class CyaniteSearchBlockCard extends React.Component {
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
    // console.log('componentDidMount ' + this.props.preview_image_url);
    this.getTrackCover();
  }

  getDominantVoiceProfile(voiceArr) {
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

      return this.capitalizeFirstLetter(output.key);
    }
  }

  getMajorKey(keyArr) {
    var keyArray = keyArr?.confidences;
    //get max value in array
    var keyVal = "";
    if (keyArray !== undefined && keyArray.length > 0) {
      var maxOfKey = Math.max(...keyArray);
      //get index of max value in array
      var indexOfMaxOfKey = keyArray.indexOf(maxOfKey);
      keyVal = keyArr.values[indexOfMaxOfKey];
      keyVal = keyVal !== undefined ? keyVal : "";
    } else {
      keyArray = keyArr;
      keyVal = keyArray !== undefined ? keyArray : "";
    }
    return keyVal;
  }

  getMoodFilteredTags() {
    const { search_result, moodTags } = this.props;
    // console.log('track moodTags : ' + moodTags);
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
    const { search_result, genreTags } = this.props;

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
    var flatTagStr = "";
    if (tagArr !== undefined) {
      flatTagStr = tagArr.map((item) => {
        return self.capitalizeFirstLetter(item);
      });
      flatTagStr = flatTagStr.toString();
    }
    return flatTagStr;
  }

  StringArrayToDisplayString(string) {
    if (!string) return "-";
    if (Array.isArray(string) && string.length === 0) {
      return "-";
    }
    let stringArray = string?.join(", ");
    return stringArray?.charAt(0)?.toUpperCase() + stringArray?.slice(1);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getTrackCover() {
    const { preview_image_url } = this.props;
    if (preview_image_url !== undefined && preview_image_url !== null) {
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

  render() {
    self = this;
    const playingIndexFromStore = this.props.playingIndex;
    return (
      <tr>
        <td>
          <LazyLoadComponent ref={React.createRef()}>
            <TrackMetaPlayer
              trackId={this.props.music_bank_id}
              key={this.props.indexProp}
              index={this.props.indexProp}
              playFromPicture={this.state.clickedOnImage}
              type="Tc"
              active={
                playingIndexFromStore !== null &&
                playingIndexFromStore === this.props.indexProp
              }
            />
          </LazyLoadComponent>
        </td>
        <td>{Math.round(this.props.bpm)}</td>

        <td>{this.getMajorKey(this.props.dmkey)}</td>
        <td>
          {/* <span className="st-tbl-sel-2">
                {this.getDominantVoiceProfile(this.props.voice)}
              </span> */}
          <ChipWrapper
            className="st-tbl-sel-2"
            label={this.getDominantVoiceProfile(this.props.voice)}
          />
        </td>

        <td>{this.StringArrayToDisplayString(this.props.genreTags)}</td>

        <td>{this.StringArrayToDisplayString(this.props.moodTags)}</td>
        <td>{this.props?.valence?.toFixed(2)}</td>
        <td>{this.props?.arousal?.toFixed(2)}</td>
        <td>{this?.props?.version}</td>
      </tr>
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

export default withRouterCompat(
  connect(mapStateToProps)(CyaniteSearchBlockCard)
);
