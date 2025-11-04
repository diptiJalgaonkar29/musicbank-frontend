import React from "react";
import Chart from "./Chart.js";

class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    };
  }

  componentWillMount() {
    this.getChartData();
  }

  getChartData() {
    // Ajax calls here
    const sortableData = Object.entries(this.props.genreDataArray)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    var labelsData = Object.keys(sortableData);
    var labelDataStr = labelsData
      .toString()
      .replace("electronicDance", "edm")
      .replace("indieAlternative", "indie")
      .replace("rapHipHop", "hiphop")
      .replace("singerSongwriter", "songwriter");
    labelsData = labelDataStr.split(",").map((data) => {
      return data.charAt(0).toUpperCase() + data.slice(1);
    });

    var seriesData = Object.values(sortableData);

    seriesData.forEach((data, i) => {
      if (data === 0) {
        labelsData.splice(i, 1);
        seriesData.splice(i, 1);
      }
    });

    labelsData = [...labelsData.slice(0, 9), "others"];

    const restData = [...seriesData.slice(9)];

    const otherData = restData.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );

    seriesData = [...seriesData.slice(0, 9), otherData];

    const colorArr = [
      getComputedStyle(document.documentElement).getPropertyValue('--color-piechart-primary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-piechart-secondary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-piechart-tertiary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-piechart-quaternary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-piechart-quinary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-piechart-senary').trim()
    ];

    this.setState({
      chartData: {
        labels: labelsData,
        sortorder: "value-desc",
        datasets: [
          {
            data: seriesData,
            backgroundColor: [...colorArr, ...colorArr, ...colorArr],
          },
        ],
      },
    });
  }

  render() {
    return (
      <div className="pieChart">
        <Chart chartData={this.state.chartData} type="outlabeledDoughnut" />
      </div>
    );
  }
}

export default PieChart;
