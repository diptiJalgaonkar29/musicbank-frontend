import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { BrandingContext } from "../../branding/provider/BrandingContext";

// Register plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: props.chartData,
    };
  }

  render() {
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div className="chart">
            <Pie
              width={440}
              height={440}
              data={this.state.chartData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        const value = tooltipItem.raw;
                        const dataset = tooltipItem.dataset.data;
                        const sum = dataset.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / sum) * 100);
                        return `${tooltipItem.label}: ${percentage}%`;
                      },
                    },
                  },
                  legend: {
                    display: false,
                  },
                  datalabels: {
                    color: config.theme["--color-white"],
                    anchor: "end",
                    align: "end",
                    offset: 10,
                    formatter: (value, ctx) => {
                      const sum = ctx.chart.data.datasets[0].data.reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percentage = Math.round((value / sum) * 100);
                      return percentage > 2
                        ? `${ctx.chart.data.labels[ctx.dataIndex]} (${percentage}%)`
                        : "";
                    },
                    font: {
                      size: 10,
                      family: config.theme["--font-primary"],
                    },
                    clamp: true,
                    clip: true,
                  },
                },
              }}
            />
          </div>
        )}
      </BrandingContext.Consumer>
    );
  }
}

export default Chart;
