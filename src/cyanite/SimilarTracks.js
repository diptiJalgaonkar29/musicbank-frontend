import React from "react";
import TrackCard from "../search/components/Trackcard/Trackcard";
import TrackPageHoc from "../track/layout/TrackPageHoc";
import AsyncService from "../networking/services/AsyncService";

class SimilarTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      error: false,
    };
  }

  fetchSimilarTracks() {
    const cyaniteId = this.props.match.params.id;
    // console.log("cyaniteId : " + cyaniteId);

    AsyncService.loadData(`/cyanite/similar?cyaniteId=${cyaniteId}`)
      .then((res) => {
        this.setState({
          jsonData: res.data,
          error: false,
        });
      })
      .catch(() => {
        this.setState({ error: true });
        console.log("error while catching cyanite data");
      });
  }

  render() {
    const jsonData = this.state.jsonData;

    if (jsonData == null) this.fetchSimilarTracks();

    return (
      <TrackPageHoc key={this.props.match.params.id}>
        {this.state.error ? (
          <h1 style={{ color: "red", padding: "10px" }}>
            Oops! something went wrong, Please try again.
          </h1>
        ) : jsonData == null ? (
          <h1 style={{ color: "wheat", padding: "10px" }}>Please wait...</h1>
        ) : jsonData.length <= 0 ? (
          <h1 style={{ color: "wheat", padding: "10px" }}>
            No Similar Track Found.
          </h1>
        ) : (
          jsonData.map((track, i) => (
            <div
              className="TrackPage__wrapper--track"
              key={"TrackPage__wrapper--track" + i}
            >
              <TrackCard
                id={track.new_timestamp}
                key={track.new_timestamp}
                indexProp={track.id}
                track_length={track.duration_in_sec}
                allTags={Object.keys(track.tags).map(
                  (index) => track.tags[index].name
                )}
                track_name={track.title}
                preview_image_url={track.preview_image_url}
                preview_track_url={track.preview_track_url}
                tempo={track.tempo}
                tag_tempo={track.tempo}
                cyanite_id={this.props.match.params.id}
              />
            </div>
          ))
        )}
      </TrackPageHoc>
    );
  }
}

export default SimilarTracks;
