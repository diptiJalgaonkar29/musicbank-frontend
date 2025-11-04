import React, { useEffect, useState } from "react";
import DonutChart from "./DonutChart";

const placeHolderTextStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 0,
  height: "calc(100% - 80px)",
  position: "absolute",
  width: "100%",
};

const NoDataHorizontalBarChartPlaceholder = ({ placeholder }) => {
  return (
    <div
      style={{ position: "relative", width: "250px", paddingBottom: "85px" }}
    >
      <h4 style={placeHolderTextStyle}>{placeholder}</h4>
    </div>
  );
};

export default function Top10Moods({ data, isLoading }) {
  const [moodMeta, setMoodMeta] = useState({ labels: [], values: [] });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setMoodMeta({
        labels: Object.keys(data), // mood names
        values: Object.values(data), // counts
      });
    }
  }, [data]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <NoDataHorizontalBarChartPlaceholder
        placeholder={isLoading ? "Loading..." : "No data found!"}
      />
    );
  }

  return (
    <DonutChart
      labels={moodMeta.labels}
      values={moodMeta.values}
      centerText="Trending Moods"
    />
  );
}
