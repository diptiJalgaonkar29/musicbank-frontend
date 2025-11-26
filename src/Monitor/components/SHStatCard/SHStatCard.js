import React from "react";
import IconWrapper from '../../../branding/componentWrapper/IconWrapper';
import './SHStatCard.css';

export default function SHStatCard({ name, value, changedBy, status, oneLine = false }) {

  function getIconByName(name) {
    const icons = {
      "Branded Tracks": 'BrandedTrackMonitorIcon',
      "On-Demand Tracks": 'OnDemandTrackMonitorIcon',
      "AI Tracks": 'AIMonitorIcon',
      "Custom Tracks": 'CustomIcon',
      "On-Request Tracks": 'EventIcon',
      "Library Tracks": 'LibraryMonitorIcon',
      "Event Sounds": 'EventIcon',
      "Soundscapes": "SoundscapeIcon",
      "UX/UI Sounds": "UxUiIcon",
      "Sonic Logos": "SonicIcon",
      "Sound Effects": "SoundEffectsIcon",
      "Podcast Sounds": "PodcastIcon",
    };
    return icons[name];
  }

  function getArrow(status) {
    if (status === "positive")
      return <span className="arrow arrow-up">▲</span>;
    if (status === "negative")
      return <span className="arrow arrow-down">▼</span>;
    return null;
  }

  const Icon = getIconByName(name);

  const ChangeIndicator = (
    <div className="stat-change">
      {getArrow(status)}
      <span className="change-value">{changedBy}</span>
    </div>
  );

  // Helper function to format number
  function formatValue(value) {
    if (value === null || value === undefined) return value;
    if (value >= 1000) return (value / 1000).toFixed(1) + "k";
    return value;
  }




  return oneLine ? (
    <div className="stat-card stat-card-one-line">
        <div className="stat-icon-label-group">
            <div className="stat-icon-wrapper">
                <IconWrapper icon={Icon} />
            </div>
            <p className="stat-label">{name}</p>
        </div>

        <div className="stat-value-group">
            <p className="stat-value">{formatValue(value)}</p>
            {ChangeIndicator}
        </div>
    </div>
  ) : (
    <div className="stat-card">
      <div className="stat-icon-wrapper">
        <IconWrapper icon={Icon} />
      </div>

      <div className="stat-text">
        <p className="stat-label">{name}</p>
        <p className="stat-value">{formatValue(value)}</p>
        {ChangeIndicator}
      </div>
    </div>
  );
}