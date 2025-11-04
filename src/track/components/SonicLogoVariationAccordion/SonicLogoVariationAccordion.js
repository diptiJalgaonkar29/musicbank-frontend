import React from "react";
import "./SonicLogoVariationAccordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import UsedInVideo from "../UsedInVideo/UsedInVideo";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import EditSection from "../../pages/EditSection";
import TrackCardSmall from "../TrackPageTrackCard/TrackCardSmall";

const SonicLogoVariationAccordion = ({ variations = [] }) => {
  if (!variations || variations?.length === 0) {
    return null;
  }

  return (
    <div className="SonicLogoVariationAccordion_container">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Associated Variations
        </AccordionSummary>
        <AccordionDetails>
          <div className="SonicLogoVariationAccordion_container">
            <p className="SonicLogoVariationAccordion_title">Variations</p>
            <div className="SonicLogoVariationAccordion_container">
              {/* {editMasterProps.hasMaster || editMasterProps.hasEdits ? (
                <EditSection {...editMasterProps} />
              ) : (
                <>
                  <p className="EditMasterAccordion_title">Edits:</p>
                  <p className="EditMasterAccordion_message">No tracks found</p>
                </>
              )} */}
              <div className={"TrackPage__wrapper--edits"}>
                <div className="TrackPage__wrapper--edits--list">
                  {variations?.map((edit) => {
                    return (
                      <>
                        <div className={"TrackPage__wrapper--edits--content"}>
                          <TrackCardSmall
                            idProp={edit?.objectID}
                            indexProp={edit?.objectID?.toString()}
                            // playingIndex={playingIndex}
                            track_length={edit?.duration_in_sec}
                            track_name={edit?.track_name}
                            editTags={edit?.tag_all}
                            editImageUrl={edit?.preview_image_url}
                            editTrackUrl={edit?.preview_track_url}
                          />
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SonicLogoVariationAccordion;
