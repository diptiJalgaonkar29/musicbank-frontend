import React from "react";
import "./TrackStyleAccordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import UsedInVideo from "../UsedInVideo/UsedInVideo";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import getSortedLabelledTagsArray from "../../../common/utils/getSortedLabelledTagsArray";

const TrackStyleAccordion = ({
  keyTag,
  bpm,
  instrumentTags,
  topEventTags,
  topMovementTags,
  emotionTags,
  genreTags,
}) => {
  console.log(
    "keyTag",
    !!keyTag,
    keyTag,
    bpm,
    instrumentTags,
    topEventTags,
    emotionTags,
    genreTags
  );
  return (
    <div className="TrackStyleAccordion_container">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Track Style
        </AccordionSummary>
        <AccordionDetails>
          <div className="TrackStyleAccordionDetails">
            <div className="TrackStyleAccordionDetails_left">
              {genreTags?.length > 0 && !!genreTags?.toString() && (
                <div className="TrackStyleAccordionDetails_genre_tags">
                  <p className="trackDetailHighlightedTitle">Track Genres</p>
                  <div className="tag_chip_container">
                    {genreTags?.map((genre) => (
                      <span className="tag_chip">{genre}</span>
                    ))}
                  </div>
                </div>
              )}
              {emotionTags?.length > 0 && (
                <div className="TrackStyleAccordionDetails_emotion_tags">
                  <p className="trackDetailHighlightedTitle">Top Emotions</p>
                  <div className="tag_chip_container">
                    {getSortedLabelledTagsArray(
                      emotionTags,
                      "AMP_MOOD_TAGS"
                    )?.map((genre) => (
                      <span className="tag_chip">{genre}</span>
                    ))}
                  </div>
                </div>
              )}
              {instrumentTags?.length > 0 && (
                <div className="TrackStyleAccordionDetails_instruments_tags">
                  <p className="trackDetailHighlightedTitle">Instruments</p>
                  <div className="tag_chip_container">
                    {getSortedLabelledTagsArray(
                      instrumentTags,
                      "INSTRUMENTS"
                    )?.map((genre) => (
                      <span className="tag_chip">{genre}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="TrackStyleAccordionDetails_right">
              {topEventTags?.length > 0 && (
                <div className="TrackStyleAccordionDetails_event_tags">
                  <p className="trackDetailHighlightedTitle">Top 3 Events</p>
                  <div className="tag_chip_container">
                    {topEventTags?.map((genre) => (
                      <span className="tag_chip">{genre}</span>
                    ))}
                  </div>
                </div>
              )}
              {topMovementTags?.length > 0 && (
                <div className="TrackStyleAccordionDetails_movement_tags">
                  <p className="trackDetailHighlightedTitle">Top 3 Moments</p>
                  <div className="tag_chip_container">
                    {topMovementTags?.map((genre) => (
                      <span className="tag_chip">{genre}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="TrackStyleAccordionDetails_bpm_key_tags">
                {(!!bpm || bpm > 0) && (
                  <div className="TrackStyleAccordionDetails_bpm_tags">
                    <p className="trackDetailHighlightedTitle">BPM</p>
                    <span className="tag_chip">{bpm}</span>
                  </div>
                )}
                {!!keyTag && keyTag.length > 0 && (
                  <div className="TrackStyleAccordionDetails_key_tags">
                    <p className="trackDetailHighlightedTitle">Key</p>
                    <span className="tag_chip">{keyTag}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TrackStyleAccordion;
