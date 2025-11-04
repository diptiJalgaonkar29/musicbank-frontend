import React, { useContext, useEffect, useMemo, useState } from "react";
import "./cyaniteBlock.css";
import MediaService from "../common/services/MediaService";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { BrandingContext } from "../branding/provider/BrandingContext";
import RadarChart from "./components/RadarChart";
import MoodGraphsAllTaxonomy from "./MoodGraphsAllTaxonomy";
import AsyncService from "../networking/services/AsyncService";
import "./MoodChartTaxonomyV2.css";
import ChipWrapper from "../branding/componentWrapper/ChipWrapper";
import IconButtonWrapper from "../branding/componentWrapper/IconButtonWrapper";
import getSortedLabelledTagsArray from "../common/utils/getSortedLabelledTagsArray";
import algoliasearch from "algoliasearch";

function MoodChartTaxonomyV2(props) {
  const {
    queryID,
    trackTags,
    isSonicLogo,
    track_lengthProp,
    preview_track_url,
    topTags,
    trackName,
    track_url,
    preview_track_image_url,
    audioEditor,
    genreTags,
    wavefile,
    source_id,
    strotswar_track_id,
    trackId,
  } = props;

  const { config } = useContext(BrandingContext);

  // --- state (mirrors the class component) ---
  const [dataReady, setDataReady] = useState(false);
  const [waveformData, setWaveformData] = useState(null);
  const [segmentDataTimestamp, setSegmentDataTimestamp] = useState(null);
  const [segmentDataArrayUpdated, setSegmentDataArrayUpdated] = useState(null);
  const [moodColumnLblDataArray, setMoodColumnLblDataArray] = useState(null);
  const [moodColumnValDataArray, setMoodColumnValDataArray] = useState(null);
  const [segmentDataArray, setSegmentDataArray] = useState(null);
  const [open, setOpen] = useState(false);

  // extra derived pieces the class stored on `this`
  const [moodDataArray, setMoodDataArray] = useState({});
  const [genreDataArray, setGenreDataArray] = useState({});
  const [valenceArousal, setValenceArousal] = useState([0, 0]);
  const [cyInfo, setCyInfo] = useState({ __html: "" });

  // --- helpers (same logic) ---
  const capitalizeFirstLetter = (s = "") =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const capitalizeName = (name = "") =>
    name.replace(/\b(\w)/g, (m) => m.toUpperCase());

  const StringArrayToDisplayString = (str) => {
    if (!str) return "";
    const s = str.split(",").join(", ");
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // --- data fetchers (kept for parity; not used elsewhere here) ---
  const getJSON = async (path, callback) =>
    callback(await fetch(path).then((r) => r.json()));

  const getJSONData = (_id) => {
    getJSON(`${_id}.json`, (data) => {
      audioAnalysisQuery(data);
    });
  };

  // --- cyanite/algolia fetch (same structure as class version) ---
  const getCyaniteAPIJSONData = async () => {
    try {
      const client = algoliasearch(
        "UGELINWMHK",
        "ca0ae95e4a09ce03c09546001ac1a6d3"
      );
      const index = client.initIndex("tracksData_GraphSegements");

      // alert(id);
      const result = await index.getObject(queryID);

      // console.log("res", res);
      // build mood/tag maps from props
      try {
        console.log("result", result);
        const idToName = result.amp_main_mood_tags_data.reduce((acc, tag) => {
          acc[tag.tagId] = tag.tagName;
          return acc;
        }, {});

        // Replace IDs with names
        const enabledAmpMainMoodSegmentDetails = Object.fromEntries(
          Object.entries(result.cyanite_Segment_Details.mood).map(
            ([id, values]) => [idToName[id] || id, values]
          )
        );

        // const enabledAmpMainMoodSegmentDetails =
        //   result.amp_main_mood_tags_data.tagName || {};
        //res?.data?.segment_details?.mood || {};
        const enabledAmpMainMoodTags = Object.fromEntries(
          (result?.amp_main_mood_tags_data || [])
            .filter((t) => t?.tagName != null && t?.tagValue != null)
            .map(({ tagName, tagValue }) => [tagName, Number(tagValue)])
        );
        const enriched = {
          ...result,
          enabledAmpMainMoodTags,
          enabledAmpMainMoodSegmentDetails,
          enabledAmpMainMoodSegmentDetails,
        };

        audioAnalysisQuery(enriched);
      } catch (e) {
        console.log(e);
      }
    } catch {
      console.log("error while catching cyanite data");
    }
  };

  // --- main computation logic (ported 1:1) ---
  const audioAnalysisQuery = async (jsonData) => {
    const bpmVal = Math.round(jsonData?.bpm || 0).toString();

    // key handling
    let keyVal = "";
    const keyObj = jsonData?.key;
    if (
      keyObj &&
      Array.isArray(keyObj.confidences) &&
      keyObj.confidences.length > 0
    ) {
      const max = Math.max(...keyObj.confidences);
      const idx = keyObj.confidences.indexOf(max);
      keyVal = keyObj.values?.[idx] ?? "";
    } else {
      keyVal = keyObj ?? "";
    }

    const moodLblArray = Object.keys(jsonData?.enabledAmpMainMoodTags || {});
    const genreLblArray = Object.keys(jsonData?.genre || {});

    setMoodDataArray(jsonData?.enabledAmpMainMoodTags || {});
    setGenreDataArray(jsonData?.genre || {});

    setValenceArousal([
      Math.round((jsonData?.valence || 0) * 100),
      Math.round((jsonData?.arousal || 0) * 100),
    ]);

    // expose for parity with class (used elsewhere in app?)
    window.moodJSONData = jsonData?.enabledAmpMainMoodSegmentDetails;

    const moodLblDataArrayLocal = moodLblArray.map((item) => ({
      key: item,
      label: capitalizeName(item),
    }));

    // kept for parity (not used in render)
    const genreLblDataArrayLocal = genreLblArray.map((item) => {
      if (item === "electronicDance") return { key: item, label: "Dance" };
      if (item === "indieAlternative") return { key: item, label: "Indie" };
      if (item === "singerSongwriter") return { key: item, label: "Singer" };
      if (item === "rapHipHop") return { key: item, label: "HipHop" };
      if (item === "reggae") return { key: item, label: "Regg" };
      return { key: item, label: capitalizeName(item) };
    });

    setCyInfo({
      __html:
        "<b>BPM: </b>" +
        bpmVal +
        "&emsp;" +
        "<b>Key: </b>" +
        "<span>" +
        capitalizeFirstLetter(keyVal) +
        "</span> ",
    });

    const segData = jsonData?.enabledAmpMainMoodSegmentDetails || {};
    console.log("jsonData", jsonData);
    const ts = [0, ...(jsonData?.cyanite_Segment_Details?.timestamps || [])];

    // match original behavior: prepend 0 and push track_lengthProp
    ts.push(track_lengthProp);

    // Build arrays with first/last duplicates per original logic
    const updated = Object.keys(segData).map((k) => {
      const series = [...(segData[k] || [])];
      if (series.length > 0) {
        series.unshift(series[0]);
        series.push(series[series.length - 1]);
      } else {
        series.push(0, 0); // keep structure if empty
      }
      return { name: k, data: series };
    });

    const moodColsLbl = Object.keys(segData);
    const moodColsVal = Object.keys(segData).map((k) => {
      const v = segData[k]?.[0] ?? 0;
      return Math.round(v * 1000) / 100;
    });

    setSegmentDataArray(segData);
    setSegmentDataTimestamp(ts);
    setSegmentDataArrayUpdated(updated);
    setMoodColumnLblDataArray(moodColsLbl);
    setMoodColumnValDataArray(moodColsVal);

    // waveform & readiness (kept same: only set dataReady after waveform fetch)
    // if (preview_track_url && !waveformData) {

    // if (preview_track_url) {
    //   try {
    // const wf = await MediaService.getWaveform(preview_track_url);
    //  setWaveformData(wf);
    setDataReady(true);
    //   } catch (err) {
    //     console.error(err, "something went wrong fetching the Waveform Data");
    //   }
    // }
    // NOTE: original code does not set dataReady when preview_track_url is null.
    // If you want to render without waveform, uncomment:
    // else {
    //   setDataReady(true);
    // }
  };

  // --- lifecycle equivalents ---
  // componentDidUpdate logic: run when trackTags length changes
  useEffect(() => {
    const len = trackTags?.length || 0;
    if (len !== 0 && isSonicLogo === false) {
      getCyaniteAPIJSONData();
    }
    if (len !== 0 && isSonicLogo === true) {
      setDataReady(true);
    }
  }, [trackTags?.length, isSonicLogo, queryID]);

  // --- render ---
  if (!dataReady) {
    return <></>;
  }

  if (isSonicLogo) {
    return (
      <div className="moodProfileBlock MoodChartTaxonomyV2_container">
        <Accordion>
          <AccordionSummary
            expandIcon={<IconButtonWrapper icon="DownArrow" />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="MoodChartTaxonomyV2_content">
              <div className="radar_chart_tags_container">
                <div className="radar_chart_container">
                  <RadarChart
                    config={config}
                    isSonicLogo={true}
                    labels={(trackTags || []).map((d) => d.label)}
                    values={(trackTags || []).map((d) => d.value)}
                  />
                </div>
                {topTags?.length > 0 && (
                  <div className="mood_tags_container">
                    <p className="MoodChartTaxonomyV2_title">Top Emotions</p>
                    <div className="MoodChartTaxonomyV2_mood_tags_list">
                      <RenderTaxonomyTopMainTags
                        tags={topTags}
                        isSonicLogo={isSonicLogo}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  // non-sonic logo path
  return (
    <div className="moodProfileBlock MoodChartTaxonomyV2_container">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={() => setOpen((prev) => !prev)}
        >
          Asset Analysis
        </AccordionSummary>
        <AccordionDetails>
          <div className="MoodChartTaxonomyV2_content">
            <p className="MoodChartTaxonomyV2_title">Mood Graph</p>
            <div className="radar_chart_tags_container">
              <div className="radar_chart_container">
                {console.log("moodDataArray", moodDataArray)}
                <RadarChart
                  isSonicLogo={false}
                  config={config}
                  labels={Object.keys(moodDataArray).filter(
                    (label) =>
                      !(window.globalConfig?.HIDE_MOOD_TAGS || [])
                        .map((t) => t.toLowerCase())
                        .includes(label.toLowerCase())
                  )}
                  values={Object.entries(moodDataArray)
                    .filter(
                      ([label]) =>
                        !(window.globalConfig?.HIDE_MOOD_TAGS || [])
                          .map((t) => t.toLowerCase())
                          .includes(label.toLowerCase())
                    )
                    .map(([_, value]) => value)}
                />
              </div>
            </div>

            <div className="overtime_graph_container">
              <p className="MoodChartTaxonomyV2_title">
                Main Mood Tags - Overtime Graph
              </p>

              <MoodGraphsAllTaxonomy
                segmentXset={segmentDataTimestamp}
                segmentYset={segmentDataArrayUpdated}
                columnXset={moodColumnLblDataArray}
                columnYSet={moodColumnValDataArray}
                dataSet={segmentDataArray}
                indexProp={undefined /* was this.state.queryID in class */}
                queryID={queryID}
                typeProp={undefined /* was this.state.type in class */}
                loading={undefined /* was this.state.loadingPicture */}
                playingIndex={undefined /* was this.state.playingIndex */}
                track_lengthProp={track_lengthProp}
                imgSrc={undefined /* was this.state.preview_track_data */}
                trackName={trackName}
                preview_track_url={preview_track_url}
                track_url={track_url}
                waveformData={waveformData}
                audioEditor={audioEditor}
                preview_track_image_url={preview_track_image_url}
                wavefile={wavefile}
                source_id={source_id}
                strotswar_track_id={strotswar_track_id}
                trackId={trackId}
                flag={open}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default MoodChartTaxonomyV2;

const RenderTaxonomyTopMainTags = ({ tags, isSonicLogo }) => {
  if (!tags || tags.length === 0) return <></>;

  const tagsType = isSonicLogo ? "SONIC_LOGO_MOOD_TAGS" : "AMP_MOOD_TAGS";
  const labeledTags = getSortedLabelledTagsArray(tags, tagsType) || [];

  return (
    <>
      {labeledTags.map((item) => (
        <ChipWrapper
          key={item.toString()}
          label={item}
          className="MoodChartTaxonomyV2_mood_tag"
        />
      ))}
    </>
  );
};
