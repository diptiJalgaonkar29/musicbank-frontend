import React from "react";
import { useDispatch } from "react-redux";
import { removeSelectedTrackFromDownloadBasket } from "../../../redux/actions/trackDownloads";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import LoadBasketCoverImage from "../LoadBasketCoverImage/LoadBasketCoverImage";
import { Link } from "react-router-dom";
import "./BasketTracksTable.css";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { showSuccess } from "../../../redux/actions/notificationActions";

const BasketTracksTable = ({ loading, updateTrackList, trackList }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <div className="downloadBasket_outer_container">
        <div className="downloadBasket_inner_container">
          <table className="table table-dark" width="100%">
            <thead className="tableHeader">
              <tr>
                <th scope="col">Cover image</th>
                <th scope="col">Title</th>
                <th scope="col">GEMA Number</th>
                <th scope="col">Author(s) + GEMA Number</th>
                <th scope="col">Publisher + GEMA Number</th>
                <th scope="col">Media type</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="spinnerContainer">
                    <div className="spinnerWrapper">
                      <SpinnerDefault />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {trackList?.map((track, i) => {
                  return (
                    <tr key={"basket_track" + i}>
                      <td scope="col" style={{ width: "10%" }}>
                        <LoadBasketCoverImage
                          data_type="library"
                          preview_image_url={track?.preview_image_url}
                          trackList={trackList}
                        />
                      </td>
                      <td
                        scope="col"
                        style={{
                          width: "15%",
                          wordBreak: "break-word",
                        }}
                      >
                        <Link
                          to={`/track_page/${track.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <p
                            className="TrackCard__item__title"
                            // style={{ fontSize: "14px" }}
                          >
                            {track?.registration_title || track?.title || "-"}
                          </p>
                        </Link>
                      </td>
                      <td scope="col" style={{ width: "20%" }}>
                        {track?.gema_number || "-"}
                      </td>
                      <td scope="col" style={{ width: "20%" }}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: track?.author_gema_number || "-",
                          }}
                        />
                      </td>
                      <td scope="col" style={{ width: "20%" }}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: track?.publisher_gema_number || "-",
                          }}
                        />
                      </td>
                      <td scope="col" style={{ width: "10%" }}>
                        {track?.audio_type || "-"}
                      </td>
                      <td scope="col" style={{ width: "20%" }}>
                        <IconButtonWrapper
                          icon="Trash"
                          className="remove_basket_track"
                          onClick={() => {
                            dispatch(
                              removeSelectedTrackFromDownloadBasket({
                                id: track.id,
                                audio_type: track.audio_type,
                              })
                            );
                            let newTrackList = trackList?.filter((t) => {
                              return !(
                                t.id == track.id &&
                                t.audio_type == track.audio_type
                              );
                            });
                            updateTrackList(newTrackList);
                            dispatch(
                              showSuccess("Track removed successfully!")
                            );
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default BasketTracksTable;
