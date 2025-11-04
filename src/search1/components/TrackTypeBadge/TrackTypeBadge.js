import React from "react";
import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import "./TrackTypeBadge.css";
import {
  ASSET_PATHS,
  getBrandAssetPath,
} from "../../../common/utils/getBrandAssetMeta";

function getIcon(trackType) {
  switch (trackType) {
    case 1:
      return "BrandedTrack";
    case 2:
      return "AiIcon1";
    case 3:
      return "";
    case 4:
      return "SoundWave";
    case 5:
      return "Coin";
    case 6:
      return "";
    default:
      return "";
  }
}

const TrackTypeBadge = ({ trackType }) => {
  const BRANDED_TRACKS_TYPE_ID = 1;
  let icon = getIcon(trackType);

  if (!icon) {
    return <></>;
  }

  return (
    <div className="TrackTypeBadge_container" id={`TrackType-${trackType}`}>
      {trackType === BRANDED_TRACKS_TYPE_ID ? (
        <img
          src={`${getBrandAssetPath(ASSET_PATHS?.NAV_LOGO_PATH)}`}
          alt="brand_track"
          className={`TrackTypeBadge_icon`}
        />
      ) : (
        <IconWrapper icon={icon} />
      )}
    </div>
  );
};

export default TrackTypeBadge;
