import React from "react";
import "./cyaniteBlock.css";
import MediaService from "../common/services/MediaService";
import Chart from "react-apexcharts";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BrandingContext } from "../branding/provider/BrandingContext";
import PieChart from "./components/PieChart";
import RadarChart from "./components/RadarChart";
import MoodGraphsAllTaxonomy from "./MoodGraphsAllTaxonomy";
import AsyncService from "../networking/services/AsyncService";

class MoodChartTaxonomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReady: false,
      greeted: false,
      waveformData: null,
      segmentDataTimestamp: null,
      segmentDataArrayUpdated: null,
      moodColumnLblDataArray: null,
      moodColumnValDataArray: null,
      segmentDataArray: null,
    };
  }

  capitalizeName(name) {
    return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  async getJSON(path, callback) {
    return callback(await fetch(path).then((r) => r.json()));
  }

  getJSONData(_id) {
    this.getJSON(_id + ".json", (data) => {
      this.jsonData = data;
      this.audioAnalysisQuery(this.jsonData);
    });
  }

  getCyaniteAPIJSONData() {
    AsyncService.loadData("/cyanite?musicBankId=" + this.props.queryID)
      .then((res) => {
        try {
          let ampMainMoodEnabledTagIds = this.props?.trackTags?.map(
            (data) => data.id
          );
          let enabledAmpMainMoodTagsObj = this.props?.trackTags.reduce(
            (prev, current, index) => {
              return { ...prev, [current.label]: current.value };
            },
            {}
          );
          let ampMainMoodTagsIdAndLabelObj = this.props?.trackTags.reduce(
            (prev, current) => {
              return { ...prev, [current.id]: current.label };
            },
            {}
          );
          let enabledAmpMainMoodSegmentDetails = {};
          const ampMainMoodSegmentDetails = res.data?.segment_details?.mood;

          for (const [key, value] of Object.entries(
            ampMainMoodSegmentDetails
          )) {
            if (ampMainMoodEnabledTagIds.includes(+key)) {
              let label = ampMainMoodTagsIdAndLabelObj[key];
              enabledAmpMainMoodSegmentDetails[label] = value;
            }
          }

          let ampMainMoodMajorTags = this.props?.trackTags
            .filter((data) => res?.data?.mood_tags.includes(data.id + ""))
            .map((data) => data.label);

          res.data.ampMainMoodMajorTags = ampMainMoodMajorTags;
          res.data.enabledAmpMainMoodTags = enabledAmpMainMoodTagsObj;
          res.data.enabledAmpMainMoodSegmentDetails =
            enabledAmpMainMoodSegmentDetails;
          this.audioAnalysisQuery(res.data);
        } catch (error) {
          console.log(error);
        }
      })
      .catch(() => {
        console.log("error while catching cyanite data  ");
      });
  }

  audioAnalysisQuery(jsonData) {
    // var genereTagVal = jsonData.genre_tags.toString();
    // var moodTagVal = jsonData.mood_tags.toString();
    // var moodTagVal = jsonData.ampMainMoodMajorTags.toString();
    var bpmVal = Math.round(jsonData.bpm).toString();
    var keyArray = jsonData.key.confidences;
    //get max value in array
    var keyVal = "";

    if (keyArray !== undefined && keyArray.length > 0) {
      var maxOfKey = Math.max(...keyArray);
      //get index of max value in array
      var indexOfMaxOfKey = keyArray.indexOf(maxOfKey);
      keyVal = jsonData.key.values[indexOfMaxOfKey];
      keyVal = keyVal !== undefined ? keyVal : "";
    } else {
      keyArray = jsonData.key;
      keyVal = keyArray !== undefined ? keyArray : "";
    }
    var moodLblArray = Object.keys(jsonData.enabledAmpMainMoodTags);
    var genreLblArray = Object.keys(jsonData.genre);

    this.moodDataArray = jsonData.enabledAmpMainMoodTags;
    this.genreDataArray = jsonData.genre;
    this.valenceArousal = [
      Math.round(jsonData.valence * 100),
      Math.round(jsonData.arousal * 100),
    ];
    window.moodJSONData = jsonData.enabledAmpMainMoodSegmentDetails;

    this.moodLblDataArray = moodLblArray.map(function (item) {
      return {
        key: item,
        label: item.replace(/\b(\w)/g, (s) => s.toUpperCase()),
      };
    });

    this.genreLblDataArray = genreLblArray.map(function (item) {
      if (item === "electronicDance") return { key: item, label: "Dance" };
      else if (item === "indieAlternative")
        return { key: item, label: "Indie" };
      else if (item === "singerSongwriter")
        return { key: item, label: "Singer" };
      else if (item === "rapHipHop") return { key: item, label: "HipHop" };
      else if (item === "indieAlternative")
        return { key: item, label: "Indie" };
      else if (item === "reggae") return { key: item, label: "Regg" };

      return {
        key: item,
        label: item.replace(/\b(\w)/g, (s) => s.toUpperCase()),
      };
    });

    this.cyInfo = {
      __html:
        // "<b>Mood: </b>" +
        // "<span>" +
        // this.StringArrayToDisplayString(moodTagVal) +
        // "</span><br/>" +
        // "<b>Genre: </b>" +
        // "<span>" +
        // this.StringArrayToDisplayString(genereTagVal) +
        // "</span>&emsp;" +
        "<b>BPM: </b>" +
        bpmVal +
        "&emsp;" +
        "<b>Key: </b>" +
        "<span>" +
        this.capitalizeFirstLetter(keyVal) +
        "</span> ",
    };

    this.segmentDataArray = jsonData.enabledAmpMainMoodSegmentDetails;
    this.segmentDataTimestamp = jsonData.segment_details.timestamps;
    this.segmentDataTimestamp.unshift(0);

    this.segmentDataTimestamp.push(this.props.track_lengthProp);

    var segmentDataArrayEdit = this.segmentDataArray;

    this.segmentDataArrayUpdated = Object.keys(segmentDataArrayEdit).map(
      function (key) {
        segmentDataArrayEdit[key].unshift(segmentDataArrayEdit[key][0]);
        segmentDataArrayEdit[key].push(
          segmentDataArrayEdit[key][segmentDataArrayEdit[key].length - 1]
        );

        return { name: key, data: segmentDataArrayEdit[key] };
      }
    );

    var segmentDataArrayEdit1 = this.segmentDataArray;

    this.moodColumnLblDataArray = Object.keys(segmentDataArrayEdit1).map(
      function (key) {
        return key;
      }
    );

    this.moodColumnValDataArray = Object.keys(segmentDataArrayEdit1).map(
      function (key) {
        //return segmentDataArrayEdit1[key][0];
        return Math.round(segmentDataArrayEdit1[key][0] * 1000) / 100;
      }
    );

    this.setState({
      segmentDataTimestamp: this.segmentDataTimestamp,
      segmentDataArrayUpdated: this.segmentDataArrayUpdated,
      moodColumnLblDataArray: this.moodColumnLblDataArray,
      moodColumnValDataArray: this.moodColumnValDataArray,
      segmentDataArray: this.segmentDataArray,
    });

    if (
      this.props.preview_track_url !== null &&
      this.state.waveformData === null
    ) {
      return MediaService.getWaveform(this.props.preview_track_url)
        .then((res) => {
          return this.setState({
            propsLoaded: true,
            waveformData: res,
            dataReady: true,
          });
        })
        .catch((err) => {
          console.error(err, "something went wrong fetching the Waveform Data");
        });
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  StringArrayToDisplayString(string) {
    if (!string) return "";
    let stringArray = string?.split(",")?.join(", ");
    return stringArray?.charAt(0)?.toUpperCase() + stringArray?.slice(1);
  }

  shouldComponentUpdate() {
    if (this.state.dataReady) return false;
    else return true;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps?.trackTags?.length !== this.props?.trackTags?.length &&
      this.props?.trackTags?.length !== 0 &&
      this.props?.isSonicLogo === false
    ) {
      // console.log("prevProps**** got ampMainMoodTags tags");
      this.getCyaniteAPIJSONData();
      return;
    }
    if (
      prevProps?.trackTags?.length !== this.props?.trackTags?.length &&
      this.props?.trackTags?.length !== 0 &&
      this.props?.isSonicLogo === true
    ) {
      // console.log("prevProps**** got sonicmoodtags tags");
      this.setState({
        dataReady: true,
      });
      return;
    }
  }

  render() {
    if (!this.state.dataReady) {
      return <></>;
    } else if (this.props?.isSonicLogo) {
      return (
        <BrandingContext.Consumer>
          {({ config }) => (
            <div className="moodProfileBlock">
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  {config.modules.UpdateUItoV2 ? (
                    <Typography>Radar Charts</Typography>
                  ) : (
                    <Typography>RADAR CHARTS</Typography>
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <br />
                  <div className="radarBlock sonicLogoMainMoodTagsChart">
                    <RadarChart
                      config={config}
                      isSonicLogo={true}
                      labels={this.props?.trackTags?.map((data) => data.label)}
                      values={this.props?.trackTags?.map((data) => data.value)}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          )}
        </BrandingContext.Consumer>
      );
    } else {
      return (
        <BrandingContext.Consumer>
          {({ config }) => (
            <>
              <div className="moodProfileBlock">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    {config.modules.UpdateUItoV2 ? (
                      <Typography>Main Mood Tags - Overtime Graph</Typography>
                    ) : (
                      <Typography>TRIMMING TOOL</Typography>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <MoodGraphsAllTaxonomy
                      segmentXset={this.state.segmentDataTimestamp}
                      segmentYset={this.state.segmentDataArrayUpdated}
                      columnXset={this.state.moodColumnLblDataArray}
                      columnYSet={this.state.moodColumnValDataArray}
                      dataSet={this.state.segmentDataArray}
                      indexProp={this.state.queryID}
                      queryID={this.props.queryID}
                      typeProp={this.state.type}
                      loading={this.state.loadingPicture}
                      playingIndex={this.state.playingIndex}
                      // Transform into DATA object
                      track_lengthProp={this.props.track_lengthProp}
                      imgSrc={this.state.preview_track_data}
                      trackName={this.props.trackName}
                      preview_track_url={this.props.preview_track_url}
                      track_url={this.props.track_url}
                      waveformData={this.state.waveformData}
                      audioEditor={this.props.audioEditor}
                      preview_track_image_url={
                        this.props.preview_track_image_url
                      }
                    />
                  </AccordionDetails>
                </Accordion>
                <div style={{ height: "20px" }}>&nbsp;</div>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    {config.modules.UpdateUItoV2 ? (
                      <Typography>Radar Charts</Typography>
                    ) : (
                      <Typography>RADAR CHARTS</Typography>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <div
                      id="output"
                      className="cyDescription"
                      dangerouslySetInnerHTML={this.cyInfo}
                    />
                    <br />
                    <div className="radarBlock">
                      <RadarChart
                        isSonicLogo={false}
                        config={config}
                        labels={Object.keys(this.moodDataArray)}
                        values={Object.values(this.moodDataArray)}
                      />
                      <Chart
                        className="bar"
                        type="bar"
                        width={150}
                        height={400}
                        highlighted={null}
                        options={{
                          colors: ["var(--color-primary)"],
                          chart: {
                            toolbar: {
                              show: false,
                            },
                            type: "bar",
                            height: 300,
                          },
                          plotOptions: {
                            bar: {
                              borderRadius: 0,
                              horizontal: false,
                              colors: {
                                backgroundBarOpacity: 0,
                                backgroundBarRadius: "8",
                              },
                              states: {
                                hover: {
                                  filter: {
                                    type: "none",
                                  },
                                },
                              },
                            },
                          },
                          dataLabels: {
                            enabled: true,
                          },
                          xaxis: {
                            categories: ["Valence", "Arousal"],
                          },
                          yaxis: {
                            labels: {
                              show: false,
                            },
                          },
                        }}
                        series={[
                          {
                            data: this.valenceArousal,
                          },
                        ]}
                      />
                      <PieChart
                        genreDataArray={this.genreDataArray}
                        config={config}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            </>
          )}
        </BrandingContext.Consumer>
      );
    }
  }
}

export default MoodChartTaxonomy;
