import React from "react";
import MonitorReportsCommonHeader from "../../components/MonitorReportsCommonHeader/MonitorReportsCommonHeader";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import CommonMonitorHeading from "../../components/CommonMonitorHeading/CommonMonitorHeading";
import StatCard from "../../components/SHStatCard/SHStatCard";
import MonitorDoughnut from "../../components/MonitorDoughnut/MonitorDoughnut";
import "./GeneralAssets.css";
import FlexibleBarChart from "../../components/FlexibleBarChart/FlexibleBarChart";
import DynamicDataTable from "../../components/DynamicDataTable/DynamicDataTable";
export default function GeneralAssets() {
  const statsList = [
    {
      name: "Branded Tracks",
      value: "198",
      changedBy: "1.5%",
      status: "positive",
    },
    {
      name: "On-Demand Tracks",
      value: "43",
      changedBy: "0.3%",
      status: "positive",
    },
    {
      name: "AI Tracks",
      value: "23",
      changedBy: "-0.8%",
      status: "negative",
    },
    {
      name: "Custom Tracks",
      value: "13",
      changedBy: "2.1%",
      status: "positive",
    },
    {
      name: "On-Request Tracks",
      value: "5",
      changedBy: "-1.2%",
      status: "negative",
    },
    {
      name: "Library Tracks",
      value: "12k",
      changedBy: "0.5%",
      status: "positive",
    },
    {
      name: "Event Sounds",
      value: "23",
      changedBy: "1.0%",
      status: "positive",
    },
    {
      name: "Soundscapes",
      value: "20",
      changedBy: "-0.5%",
      status: "negative",
    },
    {
      name: "UX/UI Sounds",
      value: "11",
      changedBy: "0.2%",
      status: "positive",
    },
    { name: "Sonic Logos", value: "3", changedBy: "0%", status: "neutral" },
    {
      name: "Sound Effects",
      value: "3",
      changedBy: "1.1%",
      status: "positive",
    },
    {
      name: "Podcast Sounds",
      value: "6",
      changedBy: "-0.4%",
      status: "negative",
    },
  ];
  const totalUsage = [
    {
      name: "Branded Tracks",
      value: "198",
      changedBy: "1.5%",
      status: "positive",
    },
    {
      name: "On-Demand Tracks",
      value: "43",
      changedBy: "0.3%",
      status: "positive",
    },
    {
      name: "AI Tracks",
      value: "23",
      changedBy: "-0.8%",
      status: "negative",
    },
    {
      name: "Custom Tracks",
      value: "13",
      changedBy: "2.1%",
      status: "positive",
    },
    {
      name: "On-Request Tracks",
      value: "5",
      changedBy: "-1.2%",
      status: "negative",
    },
    {
      name: "Library Tracks",
      value: "12k",
      changedBy: "0.5%",
      status: "positive",
    },
  ];
  const barData = {
    // X-axis Labels (e.g., Months)
    labels: [
      "Aug 2023",
      "Sep 2023",
      "Oct 2023",
      "Nov 2023",
      "Dec 2023",
      "Jan 2024",
      "Feb 2024",
      "Mar 2024",
      "Apr 2024",
      "May 2024",
    ],

    // Datasets (Each object is a segment in the stack)
    datasets: [
      {
        label: "On-Request Tracks",
        data: [2000, 2500, 1000, 2000, 2800, 900, 2500, 2200, 2900, 1600],
        backgroundColor: "#9b59b6", // Purple
      },
      {
        label: "Library Tracks",
        data: [500, 400, 300, 300, 400, 500, 300, 400, 500, 200],
        backgroundColor: "#2ecc71", // Green
      },
      {
        label: "Branded Tracks",
        data: [150, 200, 50, 70, 100, 80, 50, 120, 90, 60],
        backgroundColor: "#3498db", // Blue
      },
      {
        label: "AI Tracks",
        data: [100, 150, 30, 40, 60, 50, 30, 80, 70, 40],
        backgroundColor: "#e74c3c", // Red
      },
      {
        label: "Custom Tracks",
        data: [50, 80, 40, 60, 20, 10, 50, 40, 30, 70],
        backgroundColor: "#f1c40f", // Yellow
      },
    ],
  };
  const tableDataExample = [
    {
      "Track Type": "Branded Tracks",
      "1. Aug 2023": 153,
      "1. Sep 2023": 303,
      "1. Oct 2023": 225,
      "1. Nov 2023": 131,
      "1. Dec 2023": 219,
      "1. Jan 2024": 188,
      "1. Feb 2024": 152,
      "1. Mar 2024": 317,
      "1. Apr 2024": 150,
      "1. May 2024": 214,
    },
    {
      "Track Type": "AI Tracks",
      "1. Aug 2023": 58,
      "1. Sep 2023": 79,
      "1. Oct 2023": 87,
      "1. Nov 2023": 105,
      "1. Dec 2023": 108,
      "1. Jan 2024": 16,
      "1. Feb 2024": 75,
      "1. Mar 2024": 42,
      "1. Apr 2024": 55,
      "1. May 2024": 41,
    },
    {
      "Track Type": "On-Request Tracks",
      "1. Aug 2023": 17,
      "1. Sep 2023": 17,
      "1. Oct 2023": 11,
      "1. Nov 2023": 17,
      "1. Dec 2023": 1,
      "1. Jan 2024": 17,
      "1. Feb 2024": 5,
      "1. Mar 2024": 41,
      "1. Apr 2024": 40,
      "1. May 2024": 30,
    },
    {
      "Track Type": "Library Tracks",
      "1. Aug 2023": 2169,
      "1. Sep 2023": 2456,
      "1. Oct 2023": 865,
      "1. Nov 2023": 1998,
      "1. Dec 2023": 2796,
      "1. Jan 2024": 600,
      "1. Feb 2024": 2745,
      "1. Mar 2024": 2465,
      "1. Apr 2024": 2912,
      "1. May 2024": 1412,
    },
  ];
  const projectData = {
    // X-axis Labels (Months)
    labels: [
      "1. Aug 2023",
      "1. Sep 2023",
      "1. Oct 2023",
      "1. Nov 2023",
      "1. Dec 2023",
      "1. Jan 2024",
      "1. Feb 2024",
      "1. Mar 2024",
    ],

    // Datasets
    datasets: [
      {
        label: "Projects Created",
        // Data points matching the height of the blue bars in the image
        data: [45, 85, 48, 45, 35, 55, 58, 45],
        backgroundColor: "#0096BB", // Teal/Blue color for 'Projects Created'
        barThickness: 20, // Custom thickness for a sleek look
      },
      {
        label: "Projects Completed",
        // Data points matching the height of the purple bars in the image
        data: [36, 72, 40, 29, 28, 48, 49, 39],
        backgroundColor: "#A742AA", // Purple color for 'Projects Completed'
        barThickness: 20, // Custom thickness
      },
    ],
  };

  const trackListData = [
    {
        "Overall": "S1_Immortalis No Choirs",
        "Branded Tracks": "Dark Soul",
        "AI Tracks": "Hour Glass Avalanche",
        "On-Request Tracks": "Crimson Horizon",
        "Custom Tracks": "Solar Flare Tango",
        "Library Tracks": "Obsidian Mirror",
        "On-Demand Tracks": "Terraform"
    },
    {
        "Overall": "Get Some Drums Bass",
        "Branded Tracks": "Detroit Funk City",
        "AI Tracks": "I'm Not Crazy Date Me Inst",
        "On-Request Tracks": "Neon City Dreams",
        "Custom Tracks": "Velvet Static",
        "Library Tracks": "Forgotten Arcade",
        "On-Demand Tracks": "Pulse of the Algorithm"
    },
    {
        "Overall": "Amusing Cannibal",
        "Branded Tracks": "Diadem",
        "AI Tracks": "Into The Tent",
        "On-Request Tracks": "Whispers of the Ancient Grove",
        "Custom Tracks": "The Cartographer's Lament",
        "Library Tracks": "The Serpent's Coil",
        "On-Demand Tracks": "The Lighthouse Keeper's Dream"
    },
    {
        "Overall": "Suzy Cute",
        "Branded Tracks": "Easy Morning",
        "AI Tracks": "Invictus",
        "On-Request Tracks": "Lost Signal",
        "Custom Tracks": "Sapphire Depths",
        "Library Tracks": "Ghost Orchid",
        "On-Demand Tracks": "Cobalt Soul"
    },
    {
        "Overall": "Grass Widow",
        "Branded Tracks": "Echoes From The Snow",
        "AI Tracks": "March To War",
        "On-Request Tracks": "Midnight Bloom",
        "Custom Tracks": "Rust & Stardust",
        "Library Tracks": "Clockwork Lullaby",
        "On-Demand Tracks": "Solar Sail"
    },
    {
        "Overall": "Bear Bones",
        "Branded Tracks": "End Of Daze",
        "AI Tracks": "New Perspective A",
        "On-Request Tracks": "Echoes in the Void",
        "Custom Tracks": "Binary Sunset",
        "Library Tracks": "Distant Nebula",
        "On-Demand Tracks": "Forgotten Futures"
    },
    {
        "Overall": "I'm Not Crazy Date Me",
        "Branded Tracks": "Event Level Nine",
        "AI Tracks": "New Perspective B",
        "On-Request Tracks": "Fractured Reflections",
        "Custom Tracks": "Ephemeral Echoes",
        "Library Tracks": "Fractal Forest",
        "On-Demand Tracks": "Chromatic Cascade"
    },
    {
        "Overall": "Goodie Good Feeling",
        "Branded Tracks": "Finding Paradise",
        "AI Tracks": "Now With Even More Whiteness",
        "On-Request Tracks": "Sunken Cathedral",
        "Custom Tracks": "Concrete Jungle Fever",
        "Library Tracks": "Urban Alchemist",
        "On-Demand Tracks": "Neon Graveyard"
    },
    {
        "Overall": "Gonna Have A Good Time",
        "Branded Tracks": "Fists Of The Gods",
        "AI Tracks": "Positional Advantage",
        "On-Request Tracks": "Electric Serenade",
        "Custom Tracks": "Aurora Borealis Beat",
        "Library Tracks": "Northern Lights Brigade",
        "On-Demand Tracks": "Binary Code Blues"
    },
    {
        "Overall": "Feeling Good Drums Bass",
        "Branded Tracks": "Fists Of The Gods Perc Only",
        "AI Tracks": "Positional Advantage Perc Only",
        "On-Request Tracks": "Drifting Sands",
        "Custom Tracks": "Distant Shores Calling",
        "Library Tracks": "Siren's Song (Remix)",
        "On-Demand Tracks": "Nomad's Journey"
    },
];
  return (
    <MainLayout>
      <div style={{ marginBottom: "5rem" }}>
        <MonitorReportsCommonHeader />
        <CommonMonitorHeading
          leftText="Breakdown of Asset Downloads"
          rightText="Compared to Last Time Period"
        />

        <div className="" style={{ marginBottom: "4rem" }}>
          <div className="reports-dashboard-stat-container-grid">
            {statsList.map((item, i) => (
              <StatCard
                key={i}
                name={item.name}
                value={item.value}
                status={item.status}
                changedBy={item.changedBy}
              />
            ))}
          </div>
        </div>

        <CommonMonitorHeading
          leftText={"Top Mood and Genre"}
          dateRange={"Date Range: 1. Aug 2023 - 1. May 2024"}
        />

        <div className="assests-pie-chartContainer">
          <MonitorDoughnut />
        </div>

        <div className="track-type-Container">
          <CommonMonitorHeading
            leftText="Track Download Types Distribution"
            rightText="Date Range: 1. Aug 2023 - 1. May 2024"
          />

          <div className="track-type-stack-bar">
            <FlexibleBarChart
              chartData={barData}
              type="bar"
              stacked={true} // Crucial for stacked appearance
            />

            <div>
              <DynamicDataTable data={tableDataExample} />
            </div>
          </div>

          <div>
            <div className="monitor-normal-heading-container">
              {/* Left Content */}
              <div className="heading-normal-left-text">{"Total Usage"}</div>

              {/* Right Content (Conditional) */}
              <div className="heading-normal-right-text">
                {"Date Range: 1. Aug 2023 - 1. May 2024"}
              </div>
            </div>
          </div>
        </div>

        <div className="total-usage-container">
          <div className="reports-dashboard-stat-container-grid">
            {totalUsage.map((item, i) => (
              <StatCard
                key={i}
                name={item.name}
                value={item.value}
                status={item.status}
                changedBy={item.changedBy}
                oneLine={true}
              />
            ))}
          </div>
        </div>

        <div>
          <CommonMonitorHeading
            leftText={"Projects Created vs. Completed"}
            dateRange={"Date Range: 1. Aug 2023 - 1. May 2024"}
          />

          <div className="track-type-stack-bar">
            <FlexibleBarChart
              chartData={projectData}
              type="bar"
              stacked={false} // Crucial for stacked appearance
            />

            <div>
              <DynamicDataTable data={tableDataExample} />
            </div>
          </div>
        </div>


        <div>
            <CommonMonitorHeading
                leftText={"Billboard: Top 20 Track Downloads by Type"}
                dateRange={"Date Range: 1. Aug 2023 - 1. May 2024"}
                />

            <div>
              <DynamicDataTable data={trackListData} 
              showSrNo = {true}
              hideToggle = {true} firstChildBg={false} borders={true} 
              headerBg={true} />
            </div>


        </div>


      </div>
    </MainLayout>
  );
}
