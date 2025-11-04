import React from "react";
import { connectRefinementList } from "react-instantsearch-dom";
import TrackCard from "../../search/components/Trackcard/Trackcard";
import { LazyLoadComponent } from "../../common/components/LazyLoadComponent/LazyLoadComponent";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import { connectInfiniteHits } from "react-instantsearch-dom";

const InfiniteHits = ({
  hits,
  hasPrevious,
  refinePrevious,
  hasMore,
  refineNext,
}) => {
  hits = hits.sort(() => Math.random() - 0.5);
  return (
    <div className="SSResult mtop20">
      <button
        className="gsTagPrev"
        disabled={!hasPrevious}
        onClick={refinePrevious}
      >
        Show previous
      </button>
      <ol>
        {hits.map((hitObj) => (
          <>
            <BrandingContext.Consumer>
              {({ config }) => (
                <>
                  {/* <li key={hit.objectID}>{hit.track_name}</li> */}
                  <div
                    key={hitObj.objectID}
                    style={{ marginTop: "1.5rem", position: "relative" }}
                  >
                    {/* <li key={hitObj.objectID}>{hitObj.artist_name}</li> */}
                    <LazyLoadComponent
                      ref={React.createRef()}
                      defaultHeight={300}
                    >
                      <div className="lload">
                        <TrackCard
                          id={hitObj.created_at_timestamp}
                          key={hitObj.created_at_timestamp}
                          indexProp={hitObj.objectID}
                          cyanite_id={hitObj.cyanite_id}
                          track_length={hitObj.duration_in_sec}
                          allTags={hitObj.tag_all}
                          track_name={hitObj.track_name}
                          preview_image_url={hitObj.preview_image_url}
                          preview_track_url={hitObj.preview_track_url}
                          tempo={hitObj.tempo}
                          tag_tempo={hitObj.tag_tempo}
                          cyaniteProfile={config.modules.CyaniteProfile}
                          UpdateUItoV2={config.modules.UpdateUItoV2}
                        />
                      </div>
                    </LazyLoadComponent>
                  </div>
                </>
              )}
            </BrandingContext.Consumer>
          </>
        ))}
      </ol>
      <button className="gsTagNext" disabled={!hasMore} onClick={refineNext}>
        Show more
      </button>
    </div>
  );
};
export const SSCustomInfiniteHits = connectInfiniteHits(InfiniteHits);
