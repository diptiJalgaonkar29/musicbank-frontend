import React from 'react';
import MediaService from '../../common/services/MediaService';
import { SpinnerDefault } from '../../common/components/Spinner/Spinner';

class SearchResultRowData extends React.Component {
  state = {
    loading: true,
    preview_image_data: null,
  };

  componentDidMount() {
    //console.log('SearchResultRowData -componentDidMount ' + this.props.preview_image_url);
    this.getTrackCover();
  }

  getTrackCover() {
    const { preview_image_url } = this.props;
    if (preview_image_url !== undefined && preview_image_url !== null) {
      if (this.props.data_type === 'library') {
        Promise.all([MediaService.getImage(preview_image_url)]).then((res) => {
          this.setState({
            preview_image_data: res[0],
            loading: false,
          });
        });
      } else {
        this.setState({
          preview_image_data: preview_image_url,
          loading: false,
        });
      }
    }
  }

  render() {
    return (
      <>
        <div className="st-tbl-logo-holder" style={{ float: 'left' }}>
          <img
            src={this.state.preview_image_data}
            alt=""
            className="st-tbl-logo"
          />
          <div
            className="searchRowImgLoader"
            style={{ display: this.state.loading ? 'block' : 'none' }}
          >
            <SpinnerDefault />
          </div>
        </div>
        <div style={{ float: 'left', padding: '5px 0px' }}>
          <span
            className="st-tbl-text trackTitle"
            title={this.props.track_name}
          >
            {this.props.track_name}
          </span>

          {this.props.artist_name !== '' && (
            <span
              className="st-tbl-text trackArtist"
              title={this.props.artist_name}
            >
              {this.props.artist_name}
            </span>
          )}
        </div>
      </>
    );
  }
}

export default SearchResultRowData;
