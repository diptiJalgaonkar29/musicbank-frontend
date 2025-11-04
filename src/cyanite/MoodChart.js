import React from "react";
import Radar from "react-d3-radar";
import "react-svg-radar-chart/build/css/index.css";
import "./cyaniteBlock.css";
import MediaService from "../common/services/MediaService";
import MoodGraphsAll from "./MoodGraphsAll";
import Chart from "react-apexcharts";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BrandingContext } from "../branding/provider/BrandingContext";
import PieChart from "./components/PieChart";
import AsyncService from "../networking/services/AsyncService";

class MoodChart extends React.Component {
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
    AsyncService.loadData(`/cyanite?musicBankId=${this.props.queryID}`)
      .then((res) => {
        this.audioAnalysisQuery(res.data);
      })
      .catch(() => {
        console.log("error while catching cyanite data  ");
      });
  }

  audioAnalysisQuery(jsonData) {
    // var genereTagVal = jsonData.genre_tags.toString();
    // var moodTagVal = jsonData.mood_tags.toString();
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
    var moodLblArray = Object.keys(jsonData.mood);
    var genreLblArray = Object.keys(jsonData.genre);

    this.moodDataArray = jsonData.mood;
    this.genreDataArray = jsonData.genre;
    this.valenceArousal = [
      Math.round(jsonData.valence * 100),
      Math.round(jsonData.arousal * 100),
    ];
    window.moodJSONData = jsonData.segment_details.mood;

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

    this.segmentDataArray = jsonData.segment_details.mood;
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
    let stringArray = string.split(",").join(", ");
    return stringArray.charAt(0).toUpperCase() + stringArray.slice(1);
  }

  shouldComponentUpdate() {
    if (this.state.dataReady) return false;
    else return true;
  }

  componentDidMount() {
    this.getCyaniteAPIJSONData();
  }

  render() {
    if (!this.state.dataReady) {
      return false;
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
                      <Typography>Trimming Tool</Typography>
                    ) : (
                      <Typography>TRIMMING TOOL</Typography>
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <MoodGraphsAll
                      theme={config.theme}
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
                      <div className="radarChart">
                        <Radar
                          className="radar"
                          width={500}
                          height={500}
                          padding={80}
                          domainMax={1}
                          highlighted={null}
                          data={{
                            variables: this.moodLblDataArray,
                            sets: [
                              {
                                key: "mood",
                                label: "Moods",
                                values: this.moodDataArray,
                              },
                            ],
                          }}
                        />
                      </div>
                      <Chart
                        className="bar"
                        type="bar"
                        width={150}
                        height={400}
                        highlighted={null}
                        options={{
                          colors: [getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()],
                          chart: {
                            toolbar: {
                              show: false,
                            },
                            type: "bar",
                            height: 300,
                          },
                          plotOptions: {
                            bar: {
                              borderRadius: 40,
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

export default MoodChart;
