import React from "react";
import "./MasterEditsAccordion.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import EditSection from "../../pages/EditSection";

const MasterEditsAccordion = (editMasterProps) => {
  if (!editMasterProps.hasMaster && !editMasterProps.hasEdits) return null;
  return (
    <div className="MasterEditsAccordion">
      <Accordion>
        <AccordionSummary
          expandIcon={<IconButtonWrapper icon="DownArrow" />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          Associated Edits/Master
        </AccordionSummary>
        <AccordionDetails>
          <div className="EditMasterAccordion_container">
            {editMasterProps.hasMaster || editMasterProps.hasEdits ? (
              <EditSection {...editMasterProps} />
            ) : (
              <>
                <p className="EditMasterAccordion_title">Edits</p>
                <p className="EditMasterAccordion_message">No tracks found</p>
              </>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default MasterEditsAccordion;
