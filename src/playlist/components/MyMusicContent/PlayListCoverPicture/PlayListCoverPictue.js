import React, { useState, useEffect } from "react";
import { SpinnerDefault } from "../../../../common/components/Spinner/Spinner";
import "../../../../_styles/PlayListCoverPicture.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PlayListCoverPictue = (props) => {
  const [blobs, setBlobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { curatorCover, coverImage, imagesData } = props;

    let images = [];

    if (curatorCover && coverImage) {
      images = Array.isArray(coverImage) ? coverImage : [coverImage];
    } else if (imagesData) {
      images = Array.isArray(imagesData) ? imagesData : [imagesData];
    }

    setBlobs(images);
    setIsLoading(false);
  }, [props]);

  const { isMobileProp, tracksCount } = props;

  let content = (
    <>
      {isLoading && (
        <div
          className={`PlayListCoverPicture__Loading ${
            props.curatorCover && "playlist__cover__image"
          }`}
        >
          <SpinnerDefault />
        </div>
      )}
    </>
  );

  if (blobs !== null) {
    if (props?.curatorCover) {
      content = blobs?.map((url, i) => (
        <LazyLoadImage
          key={i}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          className="trackslider_image-playlist"
          src={url}
          effect="opacity"
          alt={`PlaylistCover-${i}`}
        />
      ));
    } else {
      content = blobs?.map((url, i) => {
        return (
          <img
            className={
              isMobileProp && window.innerWidth < 768
                ? `PlaylistImage-${i}__Mobile`
                : `PlaylistImage-${i}`
            }
            src={url}
            key={i}
            alt={`PlaylistCover-${i}`}
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = `${document.location.origin}/brandassets/common/images/default_cover.png`;
            }}
          />
        );
      });
    }
  }

  return (
    <div
      className={
        isMobileProp && window.innerWidth < 768
          ? "PlayListCoverPicture__Mobile__container"
          : "PlayListCoverPicture__container trackslider_image-playlist"
      }
    >
      <div
        className={
          isMobileProp && window.innerWidth < 768
            ? "PlayListCoverPicture__Mobile"
            : "PlayListCoverPicture"
        }
        style={{
          display: props.curatorCover ? "block" : "grid",
          position: "relative", // required for overlay
        }}
      >
        {content}

        {/* 🔹 Hover Overlay */}
        {tracksCount && (
          <div className="playlist-overlay">
            <span>{tracksCount} Tracks</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayListCoverPictue;
