import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Outlabels from "chartjs-plugin-outlabels3";
import { Doughnut } from "react-chartjs-2";
import { brandConstants } from "../../../common/utils/brandConstants";
import getSuperBrandName from "./../../../common/utils/getSuperBrandName";

// ✅ Utility: resolve CSS variables or return plain color
const resolveColor = (colorVar) => {
  if (!colorVar) return colorVar;

  // Handle var(--color-name)
  if (colorVar.startsWith("var(")) {
    const name = colorVar.slice(4, -1).trim();
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        ?.trim() || colorVar
    );
  }

  // Handle --color-name
  if (colorVar.startsWith("--")) {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(colorVar)
        ?.trim() || colorVar
    );
  }

  // Already hex/rgb
  return colorVar;
};

// ✅ Center text plugin with dynamic color
const createCenterTextPlugin = (text, color = "var(--color-white)") => ({
  id: "centerText",
  beforeDraw: (chart) => {
    if (!text) return;

    const { width, height } = chart;
    const ctx = chart.ctx;
    ctx.save();

    const lines = text.split(/\s+/);
    let fontSize = height / 16;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = resolveColor(color); // ✅ resolved color
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    const centerX = width / 2;
    const centerY = height / 2 - 25;
    const lineHeight = fontSize * 1.2;
    const totalTextHeight = lines.length * lineHeight;

    lines.forEach((line, i) => {
      const y = centerY - totalTextHeight / 2 + i * lineHeight + lineHeight / 2;
      ctx.fillText(line, centerX, y);
    });

    ctx.restore();
  },
});

// ✅ Register only once
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DonutChart = ({
  labels = [],
  values = [],
  centerText = "",
  centerTextColor = "var(--color-white)",
  bgColor = "--color-card",
}) => {
  const colorArr =
    getSuperBrandName() === brandConstants.WPP
      ? [
          resolveColor("--color-piechart-primary"),
          resolveColor("--color-piechart-secondary"),
          resolveColor("--color-piechart-tertiary"),
          resolveColor("--color-piechart-quaternary"),
          resolveColor("--color-piechart-quinary"),
        ]
      : ["#05A885", "#DE899A", "#8D69C0", "#0096BB", "#404040"];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => colorArr[i % colorArr.length]),
        cutout: "85%",
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    layout: {
      padding: {
        top: 30,
        bottom: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: resolveColor("var(--color-white)"), // ✅ resolved
          font: { size: 12 },
          padding: 14,
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.dataset.data[context.dataIndex];
            const sum = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / sum) * 100);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
      datalabels: {
        formatter: (value, ctx) => {
          const datasets = ctx.chart.data.datasets;
          if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
            const sum = datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / sum) * 100);
            return percentage > 2 ? percentage + "%" : "";
          }
          return "";
        },
        color: resolveColor("var(--color-white)"), // ✅ resolved
        font: { size: 12, weight: "bold" },
        anchor: "end",
        align: "end",
        offset: 0,
      },
    },
  };

  // Plugin to add vertical margin between chart and legend
  const legendMarginPlugin = {
    id: "legendMargin",
    beforeInit(chart) {
      const originalFit = chart.legend.fit;
      chart.legend.fit = function fit() {
        originalFit.bind(chart.legend)();
        this.height += 30;
      };
    },
  };

  const legendSpacingPlugin = {
    id: "legendSpacing",
    afterLayout(chart) {
      if (chart.legend?.options?.position === "bottom") {
        chart.legend.top += 30;
      }
    },
  };

  // ✅ Background plugin with resolved CSS variable
  const backgroundPlugin = (bgColorVar) => ({
    id: "customCanvasBackground",
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.fillStyle = resolveColor(bgColorVar);
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    },
  });

  return (
    <div className="chart">
      <Doughnut
        data={chartData}
        options={options}
        plugins={[
          backgroundPlugin(bgColor), // ✅ background
          createCenterTextPlugin(centerText, centerTextColor), // ✅ center text color
          legendMarginPlugin,
          legendSpacingPlugin,
        ]}
      />
    </div>
  );
};

export default DonutChart;
