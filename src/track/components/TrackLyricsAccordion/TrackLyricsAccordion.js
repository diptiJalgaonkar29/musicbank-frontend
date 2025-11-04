import React from "react";
import "./TrackLyricsAccordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

const TrackLyricsAccordion = ({
  showTrackLyrics,
  trackLyrics,
  HTMLDescription2,
}) => {
  if (!showTrackLyrics || !trackLyrics) {
    return null;
  }

  return (
    <div className="TrackLyricsAccordion">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Lyrics
        </AccordionSummary>
        <AccordionDetails>
          <div className="TrackLyricsAccordion_container">
            {!!trackLyrics ? (
              <div className="TpTc__descBlocks">
                {HTMLDescription2 ? (
                  <div className="TpTc__descriptionHolder">
                    <span
                      id="TpTc__description--quotes"
                      className="TpTc__ckDescription"
                      dangerouslySetInnerHTML={{
                        __html: trackLyrics,
                      }}
                    />
                  </div>
                ) : (
                  <span>
                    <q
                      id="TpTc__description--quotes"
                      className="TpTc__ckDescription"
                      dangerouslySetInnerHTML={{
                        __html: trackLyrics,
                      }}
                    />
                  </span>
                )}
              </div>
            ) : (
              <span className="TrackLyricsAccordion_message">
                Lyrics not available
              </span>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TrackLyricsAccordion;
