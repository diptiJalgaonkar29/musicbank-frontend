import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import AsyncService from "../networking/services/AsyncService";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import { showError } from "../redux/actions/notificationActions";

import { predictIcons } from "./predictIcons";
import "./predictionReport.css";

function PredictionReportPage(props) {
  console.log("PredictionReportPage", props.p);

  const projectId = props.projectId;
  console.log("projectId", projectId);

  const [predictionReportData, setPredictionReportData] = useState([]);
  const [loadingPredictionData, setLoadingPredictionData] = useState(false);

  const PredictProjectReady = predictIcons["PredictProjectReady"];
  const PredictStatusReady = predictIcons["PredictStatusReady"];
  const PredictProjectResume = predictIcons["PredictProjectResume"];
  const PredictStatusResume = predictIcons["PredictStatusResume"];
  const PredictProjectInprogress = predictIcons["PredictProjectInprogress"];
  const PredictSorting = predictIcons["PredictSorting"];

  const [predictionReportDataSorted, setPredictionReportDataSorted] = useState(
    []
  );
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    console.log("useEffect- fetchPRedicitonData call");
    fetchPredictionReportData();
  }, []);

  useEffect(() => {
    if (!predictionReportData || !predictionReportData.length) return;

    const { key, direction } = sortConfig;
    if (!key) {
      setPredictionReportDataSorted(predictionReportData);
      return;
    }

    const sorted = [...predictionReportData].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      // Handle date fields
      if (key === "c_date") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      // Force numbers for numeric fields
      if (["asset_count", "report_status"].includes(key)) {
        valA = Number(valA);
        valB = Number(valB);
      }

      // Compare
      if (typeof valA === "string" && typeof valB === "string") {
        const compare = valA.localeCompare(valB);
        return direction === "asc" ? compare : -compare;
      } else {
        const compare = valA > valB ? 1 : valA < valB ? -1 : 0;
        return direction === "asc" ? compare : -compare;
      }
    });
    //console.log("SORTED ", sorted)

    setPredictionReportDataSorted(sorted);
  }, [predictionReportData, sortConfig]);

  async function fetchPredictionReportData() {
    console.log("fetchPredictionReportData");
    setLoadingPredictionData(true);
    const data = await AsyncService.loadData(
      "/predict/getPredictReportData?projectId=" + projectId
    );
    setPredictionReportData(data.data);
    setLoadingPredictionData(false);
    console.log("fetchPredictionReportData", data.data);
  }

  function createPredictionReport() {
    console.log("createPredictionReport", projectId);
    const createReportData = [
      {
        assetName: "",
        assetSourceId: "",
        assetType: 0,
        d_link: "",
        projectId: projectId,
        source: 1,
      },
    ];
    AsyncService.postData("predict/addTransaction", createReportData)
      .then((response) => {
        console.log("addtransaction -response", response);
        redirectToExternal(response?.data); // use the token you got
      })
      .catch((err) => {
        console.log("error", err);
        showError("Something went wrong.");
      });
  }

  const redirectToExternal = (token) => {
    const form = document.createElement("form");
    form.method = "POST";
    //form.action = "https://demo.predict.sonic-hub.com/predict-login";
    form.action = window.globalConfig?.PREDICT_BASE_URL + "/predict-login";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "txn_token";
    input.value = token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
  };

  const getReportStatus = (status) => {
    //0=initiated 1=created 2=in process 3=completed
    switch (status) {
      case 0:
        return (
          <>
            <PredictStatusResume
              width={20}
              height={20}
              className="predictREsume"
            />
            <span data-dbstatus="initiated" className="">
              Resume
            </span>
          </>
        );
      case 1:
        return (
          <>
            <span data-dbstatus="inprocess" className="predictInprocess">
              Loading...
            </span>
          </>
        );
      case 2:
        return (
          <>
            <span data-dbstatus="inprocess" className="predictInprocess">
              Loading...
            </span>
          </>
        );
      case 3:
        return (
          <>
            <PredictStatusReady
              width={20}
              height={20}
              className="predictReady"
            />
            <span data-dbstatus="completed" className="predictReadyText">
              Ready
            </span>
          </>
        );
      default:
        return "";
    }
  };

  const getReportNameWithIcon = (_name, _status) => {
    switch (_status) {
      case 0:
        return (
          <>
            <PredictProjectResume
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <p>{_name}</p>
          </>
        );
      case 1:
        return (
          <>
            <PredictProjectInprogress
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <p>{_name}</p>
          </>
        );
      case 2:
        return (
          <>
            <PredictProjectInprogress
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <p>{_name}</p>
          </>
        );
      case 3:
        return (
          <>
            <PredictProjectReady
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <p>{_name}</p>
          </>
        );
    }
  };

  const getReportAssetBg = (_name, _id) => {
    //--assetsTypeVoiceOver:#C89EFF; /*Voice Over*/
    //--assetsTypeMusic:#F4C6C1; /*Brand Music & Sonic DNA*/
    //--assetsTypePodcastClip:#D4DFFE; /*Brand Podcast*/
    //--assetsTypeAudioAd:#C3F1C3; /*Audio Ad*/
    //--assetsTypeAudioLogo:#FDDE7C; /*Sonic Logo*/
    //--assetsTypeVideoAd:#DA7B7B; /*Video Ad*/
    //--assetsTypeFunctionalSound:#7DBAE7; /*UX UI Sounds*/
    switch (_name) {
      case "Audio Ad":
        return "#C3F1C3"; //Audio Ad
      case "Brand Music":
        return "#F4C6C1"; /*Brand Music & Sonic DNA*/
      case "Sonic DNA":
        return "#F4C6C1"; /*Brand Music & Sonic DNA*/
      case "Podcast Clip":
        return "#D4DFFE"; /*Brand Podcast*/
      case "Sonic Logo":
        return "#FDDE7C"; /*Sonic Logo*/
      case "Video Ad":
        return "#DA7B7B"; /*Video Ad*/
      case "Functional Sound":
        return "#7DBAE7"; /*UX UI Sounds*/
      case "Soundscapes":
        return "#FDDE7C"; /*Soundscapes*/
      case "Sound Effects":
        return "#FDDE7C"; /*Sound Effects*/
    }
  };

  const getReportDate = (date) => {
    const localTime = moment.utc(date).local();
    return localTime.format("DD.MM.YYYY");
  };

  const sortPredictReportBy = (key) => {
    console.log("sortPredictReportBy ", key, predictionReportData);

    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <>
      <div className="prediction-section">
        <div className="prediction-header">
          <h2>Prediction Reports</h2>
          <ButtonWrapper
            className="create-predictreport-btn"
            style={{ cursor: "pointer" }}
            variant="filled"
            onClick={() => createPredictionReport()}
          >
            Create Prediction Report
          </ButtonWrapper>
        </div>
        <div className="prediction_info">
          {/* {predictionReportData?.length > 0 ? `You have ${predictionReportData?.length} prediction reports.` : "You don't have any prediction reports yet."} */}
          <br />
          <div className="predictionReport_Headers">
            <div className="predict-headerLbl" style={{ width: "25%" }}>
              <p>Report Name</p>
              <PredictSorting
                className="predictReportSorter"
                data-sort=""
                onClick={() => {
                  sortPredictReportBy("Report_Name");
                }}
              />
            </div>
            <div className="predict-headerLbl" style={{ width: "15%" }}>
              <p>Sonic Profile</p>
            </div>
            <div className="predict-headerLbl" style={{ width: "10%" }}>
              <p>Asset Count</p>
              <PredictSorting
                className="predictReportSorter"
                data-sort=""
                onClick={() => {
                  sortPredictReportBy("asset_count");
                }}
              />
            </div>
            <div className="predict-headerLbl" style={{ width: "15%" }}>
              <p>Asset Name</p>
              <PredictSorting
                className="predictReportSorter"
                data-sort=""
                onClick={() => {
                  sortPredictReportBy("asset_name");
                }}
              />
            </div>
            <div className="predict-headerLbl" style={{ width: "10%" }}>
              <p>Date Created</p>
              <PredictSorting
                className="predictReportSorter"
                data-sort=""
                onClick={() => {
                  sortPredictReportBy("c_date");
                }}
              />
            </div>
            <div className="predict-headerLbl" style={{ width: "10%" }}>
              <p>Created By</p>
              <PredictSorting
                className="predictReportSorter"
                data-sort=""
                onClick={() => {
                  sortPredictReportBy("created_by");
                }}
              />
            </div>
            <div className="predict-headerLbl" style={{ width: "10%" }}>
              <p>Status</p>
              <PredictSorting
                className="predictReportSorter"
                data-sort=""
                onClick={() => {
                  sortPredictReportBy("report_status");
                }}
              />
            </div>
          </div>
          {loadingPredictionData && <SpinnerDefault />}
          {predictionReportDataSorted?.map((report, index) => (
            <div
              key={index}
              className="predictionReport-item"
              data-txtn_token={report.txn_token}
              data-report-id={report.report_id}
              data-status={report.report_status}
              onClick={() => {
                console.log("report.txn_token", report.txn_token);
                //https://demo.predict.sonic-hub.com/report-result/TVRNPSNfI3dpdGhvdXRib3RofDEy
                redirectToExternal(report.txn_token);
              }}
            >
              <div className="reportName">
                {getReportNameWithIcon(
                  report.Report_Name,
                  report.report_status
                )}
              </div>
              <div className="sonicProfile">
                <p>{report.sonic_profile}</p>
              </div>
              <div className="assetCount">
                <p>{report.asset_count}</p>
              </div>
              <div className="assetName">
                <div
                  className="innerBlock"
                  style={{
                    backgroundColor: getReportAssetBg(
                      report.asset_name,
                      report.report_asset_type_id
                    ),
                  }}
                >
                  <p>{report.asset_name}</p>
                </div>
              </div>
              <div className="createdDate">
                <p>{getReportDate(report.c_date)}</p>
              </div>
              <div className="createdBy">
                <p>{report.created_by}</p>
              </div>
              <div
                className={`reportStatus ${
                  report.report_status === 0 || report.report_status === 1
                    ? "reportStatusResume"
                    : ""
                }`}
              >
                {getReportStatus(report.report_status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PredictionReportPage;
