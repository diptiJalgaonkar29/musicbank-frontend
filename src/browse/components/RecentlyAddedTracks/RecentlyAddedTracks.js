import React, { useEffect, useState } from "react";
import TrackSlideShow from "../TrackSlideShow/TrackSlideShow";
import TrackSlideShowItem from "../TrackSlideShowItem/TrackSlideShowItem";
import { injectIntl } from "react-intl";
import AsyncService from "../../../networking/services/AsyncService";

const RecentlyAddedTracks = ({ intl }) => {
  const [recentlyAddedTracks, setRecentlyAddedTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRecentTracks = async () => {
    try {
      let recentTracks = await AsyncService.loadData("/trackMeta/recentTracks");
      if (recentTracks?.data?.length > 0) {
        setRecentlyAddedTracks(recentTracks?.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecentTracks();
  }, []);

  return (
    <>
      {recentlyAddedTracks?.length !== 0 && (
        <div className="slider-recentlyAdded test">
          <TrackSlideShow title={`${intl.messages["browse.page.recently"]}`}>
            {recentlyAddedTracks?.map((item, index) => (
              <TrackSlideShowItem key={index} track={item} />
            ))}
          </TrackSlideShow>
        </div>
      )}
    </>
  );
};

export default injectIntl(RecentlyAddedTracks);
