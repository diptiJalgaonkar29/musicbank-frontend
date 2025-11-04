import React, { useContext, useMemo } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { BrandingContext } from "../../branding/provider/BrandingContext";

// Register required chart types
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({
  config,
  isSonicLogo = false,
  labels,
  values,
}) {
  const { jsonConfig: CONFIG } = useContext(BrandingContext);

  // Fetch theme variables from CSS
  const chartPrimaryColor = getComputedStyle(document.body)?.getPropertyValue(
    "--color-radarchart-primary"
  );
  const fontPrimary = getComputedStyle(document.body)?.getPropertyValue(
    "--font-primary"
  );
  const fontColor = getComputedStyle(document.body)?.getPropertyValue(
    "--color-white"
  );

  const RadarData = useMemo(() => ({
    labels,
    datasets: [
      {
        backgroundColor: chartPrimaryColor || "rgba(54, 162, 235, 0.2)",
        borderColor: "transparent",
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
        pointRadius: 2,
        pointHoverBackgroundColor: chartPrimaryColor,
        pointHoverBorderColor: chartPrimaryColor,
        data: values,
      },
    ],
  }), [labels, values, chartPrimaryColor]);

  const RadarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        mode: "point",
        callbacks: {
          title: () => "",
          label: (tooltipItem) =>
            `${labels[tooltipItem.dataIndex]} : ${+values[
              tooltipItem.dataIndex
            ].toFixed(2)}`,
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: isSonicLogo
          ? CONFIG?.RADAR_CHART_SONIC_LOGO_MAX_LIMIT
          : CONFIG?.RADAR_CHART_MAIN_MOOD_MAX_LIMIT,
        ticks: {
          display: false, // ✅ this hides all the numeric values like 0.2564555
        },
        angleLines: {
          color: "#A1A1A1",
          lineWidth: 1,
        },
        grid: {
          color: "#A1A1A1",
          circular: true,
        },
        pointLabels: {
          color: fontColor || "#fff",
          font: {
            size: 10,
            family: fontPrimary || "sans-serif",
            weight: 300,
          },
        },
      },
    },
  }), [isSonicLogo, CONFIG, labels, values, fontPrimary, fontColor]);

  return (
    <div className="radarChartV2" style={{ flex: 1, width: "400px", height: "400px" }}>
      <Radar
        data={RadarData}
        options={RadarOptions}
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
}
