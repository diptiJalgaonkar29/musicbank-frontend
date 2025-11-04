import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import DonutChart from "./DonutChart";

// ✅ Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

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
      <div style={{ visibility: "hidden" }}>
        <HorizontalBarChart labels={[]} values={[]} />
      </div>
    </div>
  );
};

const options = {
  indexAxis: "y", // ✅ Makes it horizontal
  responsive: true,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  layout: {
    padding: {
      left: 35,
      right: 75,
      bottom: 0,
    },
  },
  plugins: {
    legend: { display: false },
    datalabels: {
      color: "#000",
      align: "end",
      anchor: "end",
      font: {
        weight: "bold",
        size: 12,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
        font: {
          size: 14,
          family: "Roboto , Helvetica , Arial , sans-serif",
        },
      },
      grid: {
        color: "#F2F4F6",
      },
    },
    x: {
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
};

const addEllipsisForLongLabel = (labels, maxChars) => {
  return labels.map((label, index) =>
    label.length > maxChars
      ? `${index + 1}. ${label.slice(0, maxChars)}...`
      : `${index + 1}. ${label}`
  );
};

function HorizontalBarChart({ labels, values }) {
  var style = getComputedStyle(document.body);
  var primCol = style.getPropertyValue("--color-primary");
  const data = {
    labels: addEllipsisForLongLabel(labels, 26),
    datasets: [
      {
        data: values,
        borderColor: primCol,
        backgroundColor: primCol,
      },
    ],
  };
  return (
    <div style={{ paddingBottom: "30px" }}>
      <Bar options={options} data={data} />
    </div>
  );
}

export default function Top10Genre({ data, isLoading }) {
  if (!data || JSON.stringify(data) === "{}")
    return (
      <NoDataHorizontalBarChartPlaceholder
        placeholder={isLoading ? "Loading..." : "No data found!"}
      />
    );

  const NO_OF_DATA_SHOW = 9;

  let genreData = Object.keys(data).map((key) => ({
    label: key,
    value: data[key],
  }));
  const TOP_GENRE = genreData.slice(0, NO_OF_DATA_SHOW);
  const OTHER_GENRE = genreData.slice(NO_OF_DATA_SHOW, genreData?.length - 1);
  if (OTHER_GENRE?.length > 0) {
    let othersGenreValue = OTHER_GENRE.reduce((prevValue, currentValue) => {
      return prevValue + currentValue?.value;
    }, 0);
    TOP_GENRE.push({ label: "Others", value: othersGenreValue });
  }

  let labels = TOP_GENRE?.map((data) => data.label);
  let values = TOP_GENRE?.map((data) => data.value);

  return (
    <DonutChart labels={labels} values={values} centerText="Trending Genres" />
  );
}
