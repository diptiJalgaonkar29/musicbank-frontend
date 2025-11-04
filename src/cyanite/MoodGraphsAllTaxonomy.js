import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

import AudioPlayerSH2 from "../common/components/Audiplayer/AudioPlayerSH2";
import AudioWaveformEditor from "./AudioWaveformEditor3";
import "./cyaniteBlock.css";
import getConfigJson from "../common/utils/getConfigJson"; // (kept to mirror original imports)
import formatTime from "../common/utils/formatTime";
import ToggleWrapper from "../branding/componentWrapper/ToggleWrapper";
import { FooterMusicPlayerContext } from "../hooks/FooterMusicPlayerContext";
import { BrandingContext } from "../branding/provider/BrandingContext";

const MoodGraphsAllTaxonomy = (props) => {
  console.log("MoodGraphsAllTaxonomy props", props);
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const footerCtx = useContext(FooterMusicPlayerContext);

  const [showGrid, setShowGrid] = useState(true);
  // const [waveformData, setWaveformData] = useState(props.waveformData);
  const [checkedState, setCheckedState] = useState(
    new Array(props.segmentYset.length).fill(true)
  );
  const [colorBarCodes, setColorBarCodes] = useState(
    (props.segmentYset || []).map(
      (_, index) => `var(--color-overtimechart-${index + 1})`
    )
  );

  console.log("fleg======>", props?.flag);
  // keep waveformData in sync with prop
  // useEffect(() => {
  //   setWaveformData(props.waveformData);
  // }, [props.waveformData]);

  // reset toggles & colors when series change
  useEffect(() => {
    setCheckedState(new Array(props.segmentYset.length).fill(true));
    setColorBarCodes(
      (props.segmentYset || []).map(
        (_, index) => `var(--color-overtimechart-${index + 1})`
      )
    );
  }, [props.segmentYset]);

  // cleanup ApexCharts instance on unmount
  useEffect(() => {
    return () => {
      const chart = ApexCharts.getChartByID("moodLine");
      if (chart && typeof chart.destroy === "function") chart.destroy();
    };
  }, []);

  const toggleSeries = useCallback((item, index) => {
    const chart = ApexCharts.getChartByID("moodLine");
    if (chart) chart.toggleSeries(item);
    setCheckedState((prev) => prev.map((val, i) => (i === index ? !val : val)));
  }, []);

  const SelectedAll = useCallback(() => {
    try {
      const chart = ApexCharts.getChartByID("moodLine");
      const allSelected = checkedState.every(Boolean);

      if (allSelected) {
        setCheckedState(new Array(props.segmentYset.length).fill(false));
        const labels = props.segmentYset.map((s) => s.name);
        labels.forEach((name) => {
          setTimeout(() => chart?.hideSeries(name), 0);
        });
      } else {
        props.segmentYset.forEach((s) => {
          setTimeout(() => chart?.showSeries(s.name), 0);
        });
        setCheckedState(new Array(props.segmentYset.length).fill(true));
      }
    } catch (error) {
      console.log("EWrror", error);
    }
  }, [checkedState, props.segmentYset]);

  const optionsS = useMemo(() => {
    return {
      chart: {
        id: "moodLine",
        group: "trackAnalysis",
        toolbar: {
          show: false,
          offsetX: 0,
          offsetY: 0,
          padding: { left: 0, right: 0 },
        },
        zoom: { enabled: false },
        events: {},
        offsetX: 0,
        offsetY: 0,
        padding: { left: 0, right: 0 },
      },
      grid: {
        show: showGrid,
        borderColor: "grey",
        strokeDashArray: 4,
        offsetX: 0,
        offsetY: 0,
        padding: { left: 0, right: 0 },
      },
      xaxis: {
        tooltip: { enabled: false },
        categories: props.segmentXset,
        labels: { show: false },
        axisBorder: {
          show: true,
          color: "var(--color-white)",
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: { show: false },
        offsetX: 0,
        offsetY: 0,
        padding: { left: 0, right: 0 },
      },
      yaxis: {
        min: 0,
        max: CONFIG?.OVERTIME_GRAPH_MAX_LIMIT,
        tickAmount:
          CONFIG?.OVERTIME_GRAPH_MAX_LIMIT?.toString()?.split(".")?.[1] || 10,
        labels: {
          show: true,
          formatter: (value) => `${Number(value).toFixed(1)}`,
          offsetX: -10,
          offsetY: 0,
          style: {
            colors: ["var(--color-white)"],
            fontSize: "12px",
            fontWeight: 400,
            fontFamily: "var(--font-primary)",
          },
        },
        axisBorder: {
          show: true,
          color: "var(--color-white)",
          offsetX: -4,
          offsetY: 0,
        },
        axisTicks: {
          show: false,
          borderType: "solid",
          color: "var(--color-white)",
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
        offsetX: 0,
        offsetY: 0,
        padding: { left: 0, right: 0 },
      },
      legend: {
        show: false,
        offsetX: 0,
        offsetY: 0,
        padding: { left: 0, right: 0 },
      },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        shared: false,
        x: {
          show: true,
          formatter: function (value, { dataPointIndex, w }) {
            return formatTime(+w.globals.categoryLabels[dataPointIndex]);
          },
        },
        y: {
          show: true,
          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
            return +w.globals.series[seriesIndex][[dataPointIndex]]?.toFixed(2);
          },
          title: { formatter: (seriesName) => seriesName },
        },
      },
      markers: {
        size: 0,
        colors: undefined,
        strokeColors: "var(--color-white)",
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
        hover: { size: undefined, sizeOffset: 3 },
      },
      stroke: {
        show: true,
        curve: "smooth",
        lineCap: "butt",
        colors: undefined,
        width: 3,
        dashArray: 0,
      },
      colors: colorBarCodes,
    };
  }, [
    showGrid,
    props.segmentXset,
    CONFIG?.OVERTIME_GRAPH_MAX_LIMIT,
    colorBarCodes,
  ]);

  return (
    <div className="cyaniteGraphs cyaniteGraphsV2">
      <div className="row lineChart">
        <div className="grid_toggle_container">
          <ToggleWrapper
            label="Grid"
            onClick={() => setShowGrid((s) => !s)}
            checked={showGrid}
          />
        </div>
        <div className="mixed-chart">
          <Chart
            options={optionsS}
            series={props.segmentYset}
            type="line"
            width="100%"
            height={400}
          />
        </div>
      </div>

      {!!props.flag && (
        <div className="Cyanite_AudioPlayer">
          <AudioPlayerSH2
            showMusicController={true}
            songUrl={props.preview_track_url}
            track_length={props.track_lengthProp}
            index={props.queryID}
            trackID={props.queryID}
            // waveformDataProp={waveformData}
            playFromPicture={false}
            key={props.queryID}
            type={"TpTc"}
            active={
              props.playingIndex !== null &&
              props.playingIndex === props.indexProp
            }
            isCyaniteActive={true}
            trackCardNameProp={props.trackName}
            srcUrl={props.preview_track_image_url}
            playingAudio={footerCtx.playingAudio}
            setPlayingAudio={footerCtx.setPlayingAudio}
            playPause={footerCtx.playPause}
            setPlayList={footerCtx.setPlayList}
            setPlayingIndex={footerCtx.setPlayingIndex}
            setPlayListType={footerCtx.setPlayListType}
            playingFooterMusicPlayer={false}
            wavefile={props.wavefile}
            source_id={props.source_id}
            strotswar_track_id={props.strotswar_track_id}
            trackId={props.trackId}
          />
        </div>
      )}
      {props.audioEditor && (
        <AudioWaveformEditor
          trackWavURL={props.track_url}
          trackMp3URL={props.preview_track_url}
          trackLength={props.track_lengthProp}
          trackID={props.queryID}
        />
      )}

      <div className="legendContainer">
        {props?.segmentYset?.map((item, index) => (
          <ToggleWrapper
            label={item.name}
            key={item.name}
            onClick={() => toggleSeries(item.name, index)}
            checked={checkedState[index]}
            bgColor={
              checkedState?.[index] ? `--color-overtimechart-${index + 1}` : ""
            }
          />
        ))}

        <div className="deselectAllSwitch">
          <ToggleWrapper
            label="Select all"
            onClick={SelectedAll}
            checked={checkedState?.every(Boolean)}
          />
        </div>
      </div>
    </div>
  );
};

export default MoodGraphsAllTaxonomy;
