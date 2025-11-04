import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import "./TrackTypeBadge.css";
import { styled } from "styled-components";
import ToolTipWrapper from "./../../../branding/componentWrapper/ToolTipWrapper";

function getIcon(trackType) {
  switch (trackType) {
    case 1:
      return { icon: "BrandedTrack", name: "Branded Track" };
    case 2:
      return { icon: "AiTrack", name: "AI Track" };
    case 3:
      return { icon: "LibraryTrack", name: "Library Track" };
    case 4:
      return {}; // icon not available
    case 5:
      return { icon: "OnDemandTrack", name: "On-Demand Track" };
    case 6:
      return {};
    default:
      return {};
  }
}

const TrackTypeBadge = ({ trackType }) => {
  const { icon, name } = getIcon(trackType);

  if (!icon) return null; // no icon to show

  return (
    <div
      className="TrackTypeBadge_containerV2"
      id={`TrackType-${trackType}`}
      style={{ cursor: "pointer" }}
    >
      <ToolTipWrapper title={name}>
        <IconWrapper icon={icon} />
      </ToolTipWrapper>
    </div>
  );
};

export default TrackTypeBadge;
