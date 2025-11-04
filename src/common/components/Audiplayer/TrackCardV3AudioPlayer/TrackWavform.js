// src/components/Waveform.jsx
import React from "react";

const TrackWaveform = ({ data, width = 500, height = 60, color = "#00C6FF" }) => {
  if (!data || data.length === 0) return <div style={{ color: "#888" }}>No waveform</div>;

  const max = Math.max(...data);
  const barWidth = width / data.length;

  return (
    <svg width={width} height={height} style={{ background: "#111", borderRadius: 10 }}>
      {data.map((val, i) => {
        const barHeight = (val / max) * height * 0.9;
        const x = i * barWidth;
        const y = height / 2 - barHeight / 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth * 0.8}
            height={barHeight}
            fill={color}
            rx={barWidth * 0.3}
          />
        );
      })}
    </svg>
  );
};

export default TrackWaveform;
