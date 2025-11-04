import React, { Component } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

import AudioPlayer from "../common/components/Audiplayer/AudioPlayer";
import AudioWaveformEditor from "./AudioWaveformEditor3";
import { FooterMusicPlayerContext } from "../hooks/FooterMusicPlayerContext";

const colorBarCodes = [
  "#008dff",
  "#707070",
  "#a2a2e3",
  "#0aecf4",
  "#5b43a7",
  "#127688",
  "#c4467f",
  "#38b987",
  "#c44937",
  "#538582",
  "#ca96b3",
  "#c1884f",
  "#03a8ad",
];
let mounted = false;

class MoodGraphsAll extends Component {
  constructor(props) {
    super(props);

    this.updateColumnBars = this.updateColumnBars.bind(this);

    this.state = {
      loading: true,
      preview_image_data: null,
      waveformData: this.props.waveformData,
      propsLoaded: false,
      preview_track_url: this.props.preview_track_url,
      trackID: this.props.indexProp,

      optionsC: {
        chart: {
          id: "moodColumn",
          group: "trackAnalysis",
          offsetY: 0,
          height: 400,
          sparkline: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          events: {
            mounted: function (chartContext, config) {
              let lblArr = config.globals.labels;
              lblArr.forEach(function (index) {
                ApexCharts.exec("moodLine", "showSeries", index);
              });
            },
            click: function (event, chartContext, config) {
              let lblArr = config.globals.labels;
              if (config.dataPointIndex >= 0) {
                if (!mounted) {
                  lblArr.forEach(function (index) {
                    ApexCharts.exec("moodLine", "hideSeries", index);
                  });
                  mounted = true;
                }
                ApexCharts.exec(
                  "moodLine",
                  "toggleSeries",
                  config.globals.labels[config.dataPointIndex]
                );
              }
            },
          },
        },
        grid: {
          show: false,
          row: {
            opacity: 0.1,
          },
        },
        xaxis: {
          categories: this.props.columnXset,
          labels: {
            show: false,
          },
        },
        yaxis: {
          min: 1,
          max: 10,
          labels: {
            show: false,
          },
        },
        colors: colorBarCodes,
        plotOptions: {
          bar: {
            borderRadius: 6,
            columnWidth: "45%",
            distributed: true,
            dataLabels: {
              position: "bottom",
              width: "45%",
            },
            colors: {
              backgroundBarColors: [getComputedStyle(document.documentElement).getPropertyValue('--color-white').trim()],
              backgroundBarOpacity: 1,
              backgroundBarRadius: "8",
            },
            states: {
              normal: {
                allowMultipleDataPointsSelection: true,
                filter: {
                  type: "lighten",
                  value: 0.8,
                },
              },
              hover: {
                allowMultipleDataPointsSelection: true,
                filter: {
                  type: "none",
                  value: 1,
                },
              },
              active: {
                allowMultipleDataPointsSelection: true,
                filter: {
                  type: "darken",
                  value: 1,
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: undefined,
          formatter: function (value, { dataPointIndex, w }) {
            return [value, w.config.xaxis.categories[dataPointIndex]];
          },
          textAnchor: "middle",
          distributed: true,
          offsetX: 0,
          offsetY: -10,
          style: {
            fontSize: "15px",
            fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-primary').trim(),
            fontWeight: "bold",
            colors: undefined,
          },
          background: {
            enabled: true,
            foreColor: getComputedStyle(document.documentElement).getPropertyValue('--color-white').trim(),
            padding: 8,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-white').trim(),
            opacity: 0,
            dropShadow: {
              enabled: true,
              top: 1,
              left: 1,
              blur: 1,
              color: "#000",
              opacity: 0.45,
            },
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            color: "#000",
            opacity: 0.45,
          },
        },
        legend: {
          show: false,
        },
      },
      seriesC: [
        {
          name: "Moods",
          data: this.props.columnYSet,
        },
      ],

      optionsS: {
        chart: {
          id: "moodLine",
          group: "trackAnalysis",
          toolbar: {
            show: false,
            offsetX: 0,
            offsetY: 0,
            padding: { left: 0, right: 0 },
          },
          zoom: {
            enabled: false,
          },
          events: {
            mouseMove: this.updateColumnBars,
          },
          offsetX: 0,
          offsetY: 0,
          padding: { left: 0, right: 0 },
        },
        grid: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          padding: { left: 0, right: 0 },
        },
        xaxis: {
          categories: this.props.segmentXset,
          labels: {
            show: false,
          },
          offsetX: 0,
          offsetY: 0,
          padding: { left: 0, right: 0 },
        },
        yaxis: {
          labels: {
            show: false,
          },
          offsetX: 0,
          offsetY: 0,
          padding: { left: 0, right: 0 },
        },
        legend: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          padding: { left: 0, right: 0 },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: true,
          shared: false,
          x: {
            show: true,
            formatter: function (value, { dataPointIndex, w }) {
              return w.globals.categoryLabels[dataPointIndex];
            },
          },
          y: {
            show: true,
            formatter: function (value, { seriesIndex, dataPointIndex, w }) {
              return (
                Math.round(
                  w.globals.series[seriesIndex][[dataPointIndex]] * 1000
                ) / 100
              );
            },
            title: {
              formatter: (seriesName) => seriesName,
            },
          },
        },
        markers: {
          size: 1,
          colors: undefined,
          strokeColors: getComputedStyle(document.documentElement).getPropertyValue('--color-white').trim(),
          strokeWidth: 1,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          shape: "circle",
          radius: 3,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          showNullDataPoints: true,
          hover: {
            size: undefined,
            sizeOffset: 3,
          },
        },
        stroke: {
          show: true,
          curve: "straight",
          lineCap: "butt",
          colors: undefined,
          width: 3,
          dashArray: 0,
        },
        colors: colorBarCodes,
      },
      seriesS: this.props.segmentYset,
    };
  }

  componentDidMount() {
    // RESET STATE ON UNMOUNTING
    this.setState({
      propsLoaded: false,
    });
  }

  updateColumnBars = (event, chartContext, config) => {
    var segmentDataArrayEdit2 = this.props.dataSet;
    if (config.dataPointIndex >= 0) {
      var barUpdateDataArray = Object.keys(segmentDataArrayEdit2).map(function (
        key
      ) {
        return (
          Math.round(segmentDataArrayEdit2[key][config.dataPointIndex] * 1000) /
          100
        );
      });
      this.setState({
        seriesC: [
          {
            name: "Moods",
            data: barUpdateDataArray,
          },
        ],
      });
    }
  };

  updateGraphOnTimeChange = (value) => {
    if (this.props.segmentXset.includes(Math.round(value))) {
      var segmentDataArrayEdit2 = this.props.dataSet;
      var updateIndex = Math.round(value / 15);

      updateIndex =
        updateIndex >= segmentDataArrayEdit2["aggressive"].length
          ? segmentDataArrayEdit2["aggressive"].length - 1
          : updateIndex;
      if (updateIndex >= 0) {
        var barUpdateDataArray = Object.keys(segmentDataArrayEdit2).map(
          function (key) {
            return (
              Math.round(segmentDataArrayEdit2[key][updateIndex] * 1000) / 100
            );
          }
        );
        this.setState({
          seriesC: [
            {
              name: "Moods",
              data: barUpdateDataArray,
            },
          ],
        });
      }
    }
  };

  render() {
    return (
      <FooterMusicPlayerContext.Consumer>
        {({
          playingAudio,
          setPlayingAudio,
          playPause,
          setPlayList,
          setPlayingIndex,
          setPlayListType,
        }) => (
          <div className="cyaniteGraphs">
            <div className="row columnChart">
              <div className="mixed-chart">
                <Chart
                  options={this.state.optionsC}
                  series={this.state.seriesC}
                  type="bar"
                  width="96%"
                  height={400}
                />
              </div>
            </div>
            <div className="row lineChart">
              <div className="mixed-chart">
                <Chart
                  options={this.state.optionsS}
                  series={this.state.seriesS}
                  type="line"
                  width="100%"
                  height={400}
                />
              </div>
            </div>
            <div className="Cyanite_AudioPlayer">
              <AudioPlayer
                songUrl={this.props.preview_track_url}
                track_length={this.props.track_lengthProp}
                index={this.props.indexProp}
                waveformDataProp={this.state.waveformData}
                playFromPicture={false}
                key={this.props.queryID}
                type={"TpTc"}
                active={
                  this.props.playingIndex !== null &&
                  this.props.playingIndex === this.props.indexProp
                }
                isCyaniteActive={true}
                updateGraphOnTimeChange={this.updateGraphOnTimeChange}
                trackCardNameProp={this.props.trackName}
                srcUrl={this.props.preview_track_image_url}
                playingAudio={playingAudio}
                setPlayingAudio={setPlayingAudio}
                playPause={playPause}
                setPlayList={setPlayList}
                setPlayingIndex={setPlayingIndex}
                setPlayListType={setPlayListType}
                playingFooterMusicPlayer={false}
              />
            </div>

            {this.props.audioEditor && (
              <AudioWaveformEditor
                trackWavURL={this.props.track_url}
                trackMp3URL={this.props.preview_track_url}
                trackLength={this.props.track_lengthProp}
                trackID={this.props.queryID}
              />
            )}
          </div>
        )}
      </FooterMusicPlayerContext.Consumer>
    );
  }
}

export default MoodGraphsAll;
