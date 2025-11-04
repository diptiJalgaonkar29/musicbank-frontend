import React from "react";
import "./TrackUsageAccordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import UsedInVideo from "../UsedInVideo/UsedInVideo";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

const TrackUsageAccordion = ({ showUsedInVideos, usedInVideoData }) => {
  if (!showUsedInVideos || !usedInVideoData || usedInVideoData?.length === 0) {
    return null;
  }

  return (
    <div className="TrackUsageAccordion_container">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Usage
        </AccordionSummary>
        <AccordionDetails>
          <div className="TrackUsageAccordion_usedIn_container">
            <p className="TrackUsageAccordion_usedIn_title">Used In</p>
            {usedInVideoData?.length !== 0 ? (
              <div className="TrackUsageAccordion_usedIn_list">
                {usedInVideoData?.map((usedInData, index) => (
                  <div
                    className="TrackUsageAccordion_usedIn_item"
                    key={`TrackUsageAccordion_usedIn_item_${index}`}
                  >
                    <UsedInVideo data={usedInData} />
                  </div>
                ))}
              </div>
            ) : (
              <span className="TrackUsageAccordion_usedIn_message">
                Not Used Yet
              </span>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TrackUsageAccordion;
