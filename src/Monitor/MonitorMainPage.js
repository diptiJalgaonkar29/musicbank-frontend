import React, { useEffect, useState } from "react";
import MainLayout from "../common/components/MainLayout/MainLayout";
import "./MonitorMainPage.css";
import MonitorDoughnut from "./components/MonitorDoughnut/MonitorDoughnut";
import StatCard from "./components/SHStatCard/SHStatCard";
import MonitoringReportCard from "./components/MonitoringReportCard/MonitoringReportCard";
import algoliasearch from "algoliasearch/lite";

// Algolia client
const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY;
const ALGOLIA_INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME;
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
console.log(process.env,'processss');

// Helper to fetch count from Algolia
async function fetchAlgoliaCount(filter) {
  try {
    const index = searchClient.initIndex(ALGOLIA_INDEX_NAME);
    const result = await index.search("", { filters: filter, hitsPerPage: 0 });
    return result.nbHits;
  } catch (err) {
    console.error("Error fetching count:", err);
    return 0;
  }
}

export default function MonitorMainPage() {
  const serverName = "sh2Dev"; // example
  const [ready, setReady] = useState(false);
const superBrandId = localStorage.getItem("superBrandId");
const brandId = localStorage.getItem("brandId"); 
useEffect(() => {
  if (localStorage.getItem("superBrandId") && localStorage.getItem("brandId")) {
    setReady(true);
  }
}, []);
  // Compute baseFilter exactly as your working fetch API
  let baseFilter = "";
  if (serverName === "sh2Dev" || serverName === "sh2Wpp") {
    baseFilter = [
      `analysis_status=1`,
      `facet_brand_assigned:"${serverName}-${superBrandId}_${brandId}:true"`,
      `facet_isTrackActive:"${serverName}-${superBrandId}_${brandId}:true"`,
      `facet_trackStatus:"${serverName}-${superBrandId}_${brandId}:true"`,
    ].join(" AND ");
  } else {
    baseFilter = [
      `analysis_status=1`,
      `brands_assigned=${brandId}`,
      `trackStatus:true`,
      `sonichub_track_id>0`,
    ].join(" AND ");
  }

  const statsConfig = [
    { name: "Branded Tracks", type: "track", ids: [1] },
    { name: "On-Demand Tracks", type: "track", ids: [5] },
    { name: "AI Tracks", type: "track", ids: [2] },
    { name: "Custom Tracks", type: "track", ids: [4] },
    { name: "On-Request Tracks", type: "track", ids: [6] },
    { name: "Library Tracks", type: "track", ids: [3] },
    { name: "Event Sounds", type: "asset", ids: [0] }, // no id for event soun
    { name: "Soundscapes", type: "asset", ids: [10] },
    { name: "UX/UI Sounds", type: "asset", ids: [3] },
    { name: "Sonic Logos", type: "asset", ids: [2] },
    { name: "Sound Effects", type: "asset", ids: [11] },
    { name: "Podcast Sounds", type: "asset", ids: [5] },
  ];

  const monitoringReports = [
    { id: 1, title: "General Asset Statistics", lastOpened: "3 days ago" },
    { id: 2, title: "Credit Usage, Savings And Spending", lastOpened: "3 days ago" },
    { id: 3, title: "Markets And Regions", lastOpened: "3 days ago" },
    { id: 4, title: "AI Voice", lastOpened: "3 days ago" },
    { id: 5, title: "AI Music", lastOpened: "3 days ago" },
    { id: 6, title: "Trends", lastOpened: "3 days ago" },
    { id: 7, title: "Prediction", lastOpened: "3 days ago" },
  ];

  // State to store counts for each stat
  const [counts, setCounts] = useState({});

  // Fetch counts on page load
  useEffect(() => {
    if (!ready) return;
    async function fetchAllCounts() {
      const countsObj = {};
      await Promise.all(
        statsConfig.map(async (item) => {
          const typeFilter =
            item.type === "track"
              ? item.ids.map((id) => `track_type_id:${id}`).join(" OR ")
              : item.ids.map((id) => `asset_type_id:${id}`).join(" OR ");

          const finalFilter = `${baseFilter} AND (${typeFilter})`;
          const count = await fetchAlgoliaCount(finalFilter);
          countsObj[item.name] = count;
        })
      );
      setCounts(countsObj);
    }

    fetchAllCounts();
  }, [ready]);

  return (
    <MainLayout>
      <div className="Monitor-mainpage-container">
        <div className="monitor-header">
          <h1>ACME Monitor</h1>
        </div>

        <div className="monitor-content">
          <div className="left-section">
            <MonitorDoughnut />
          </div>

          <div className="right-section">
            <div className="stats-grid">
              {statsConfig.map((item, i) => (
                <StatCard
                  key={i}
                  name={item.name}
                  value={counts[item.name] ?? ""}
                />
              ))}
            </div>
          </div>
        </div>

        {/* KEEPING ALL YOUR COMMENTED CODE EXACTLY AS IS */}
        <div>
          {/* dont remove this. will be using it later */}
          {/* <h2 >Your Monitoring Reports</h2>
          <div className='monitoring-card-grid'>
            {monitoringReports.map((report, index) => (
              <MonitoringReportCard
                key={report.id}
                title={report.title}
                lastOpened={report.lastOpened}
              />
            ))}
          </div> */}
        </div>
      </div>
    </MainLayout>
  );
}
