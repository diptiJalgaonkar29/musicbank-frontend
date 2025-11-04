import React, { useEffect, useState } from "react";
import "./SearchResultsCard.css";
import MediaService from "../../../common/services/MediaService";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import getMediaBucketPath from "../../../common/utils/getMediaBucketPath";

const SearchResultsCard = ({
  track_name,
  artist_name,
  data_type,
  preview_image_url,
  source_id,
}) => {
  const [loading, setLoading] = useState(true);
  const [previewImageData, setPreviewImageData] = useState(null);
  useEffect(() => {
    if (!preview_image_url) return;
    if (data_type === "library") {
      // Promise.all([MediaService.getImage(preview_image_url)]).then((res) => {
      Promise.all([
        getMediaBucketPath(preview_image_url, source_id, "image"),
      ]).then((res) => {
        setLoading(false);
        setPreviewImageData(res[0]);
      });
    } else {
      setLoading(false);
      setPreviewImageData(preview_image_url);
    }
  }, [preview_image_url]);

  return (
    <div className="search_results_card_container">
      <div className="search_results_card_img_container">
        {loading ? (
          <div className="search_results_card_loader">
            <SpinnerDefault />
          </div>
        ) : (
          <img
            src={previewImageData}
            alt=""
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = `${document.location.origin}/brandassets/common/images/default_cover.png`;
            }}
          />
        )}
      </div>
      <div className="search_results_card_info_container">
        <span className="search_results_card_title">{track_name}</span>
        {artist_name && (
          <span className="search_results_card_subtitle" title={artist_name}>
            {artist_name}
          </span>
        )}
      </div>
    </div>
  );
};
export default SearchResultsCard;

// class SearchResultsCard extends React.Component {
//   state = {
//     loading: true,
//     preview_image_data: null,
//   };

//   componentDidMount() {
//     //console.log('SearchResultsCard -componentDidMount ' + this.props.preview_image_url);
//     this.getTrackCover();
//   }

//   getTrackCover() {
//     const { preview_image_url } = this.props;
//     if (preview_image_url !== undefined && preview_image_url !== null) {
//       if (this.props.data_type === "library") {
//         Promise.all([MediaService.getImage(preview_image_url)]).then((res) => {
//           this.setState({
//             preview_image_data: res[0],
//             loading: false,
//           });
//         });
//       } else {
//         this.setState({
//           preview_image_data: preview_image_url,
//           loading: false,
//         });
//       }
//     }
//   }

//   render() {
//     const { preview_image_data, loading } = this.state;
//     const { track_name, artist_name } = this.props;
//     return (
//       <div className="search_results_card_container">
//         <div
//           className="search_results_card_img_container"
//           style={{ float: "left" }}
//         >
//           <img src={preview_image_data} alt="search_results_img" />
//           <div
//             className="search_results_card_loader"
//             style={{ display: loading ? "block" : "none" }}
//           >
//             <SpinnerDefault />
//           </div>
//         </div>
//         <div style={{ float: "left", padding: "5px 0px" }}>
//           <span className="search_results_card_title" title={track_name}>
//             {track_name}
//           </span>

//           {artist_name !== "" && (
//             <span className="search_results_card_subtitle" title={artist_name}>
//               {artist_name}
//             </span>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// export default SearchResultsCard;
