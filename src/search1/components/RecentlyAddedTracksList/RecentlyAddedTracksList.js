import React, { useEffect, useMemo, useState } from "react";
import "./RecentlyAddedTracksList.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Spinner,
  SpinnerDefault,
} from "../../../common/components/Spinner/Spinner";
import SearchResultsCard from "../../../cyanite/components/searchResultsCard/SearchResultsCard";
import { loadRecentlyAdded } from "../../../browse/actions/RecentlyAddedTracksActions/RecentlyAddedTracksActions";
import { FormattedMessage } from "react-intl";
import { LazyLoadComponent } from "../../../common/components/LazyLoadComponent/LazyLoadComponent";

const RecentlyAddedTracksList = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { tracks: recentlyAddedTracks } = useSelector(
    (state) => state.recentlyAdded
  );
  const dispatch = useDispatch();
  useEffect(() => {
    Promise.all([dispatch(loadRecentlyAdded())]).then(() => {
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return (
      <div className="RecentlyAddedTracksList_skeleton">
        <SpinnerDefault />
      </div>
    );
  }

  if (recentlyAddedTracks?.length === 0) return <></>;

  return (
    <div className="RecentlyAddedTracksList_container">
      <span>
        <FormattedMessage id="browse.page.recently" />
      </span>
      <div className="RecentlyAddedTracksList">
        {recentlyAddedTracks?.map((track, index) => (
          <LazyLoadComponent
            ref={React.createRef()}
            defaultHeight={50}
            key={`${track?.id}-${index}`}
          >
            <SearchResultsCard
              data_type="library"
              track_name={track?.title}
              preview_image_url={track?.image}
            />
          </LazyLoadComponent>
        ))}
      </div>
    </div>
  );
};
export default RecentlyAddedTracksList;
