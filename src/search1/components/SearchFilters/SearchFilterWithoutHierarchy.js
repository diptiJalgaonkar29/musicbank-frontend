import React from "react";
import PropTypes from "prop-types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";

import CustomRefinementList from "./components/CustomRefinementLists";
import "../../_styles/NestedAccordion.css";
import TRangeSlider from "../../components/SearchFilters/components/RangeSlider";

function SearchFilterWithoutHierarchy({ name, attribute, isRangerSlider }) {
  return (
    <React.Fragment>
      <Accordion className={`accordion_sidebar ${name}`}>
        <AccordionSummary
          expandIcon={
            <IconButtonWrapper
              icon="DownArrow"
              className="accordion_expandIcon"
            />
          }
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          {isRangerSlider ? (
            <h4 className="u-position-relative">BPM (Tempo)</h4>
          ) : (
            <h4 className="u-position-relative">Filter By {name}</h4>
          )}
        </AccordionSummary>
        <AccordionDetails>
          {isRangerSlider ? (
            <TRangeSlider name="Tempo" attribute="tempo" />
          ) : (
            <ul className="nested_accordion__body--ul">
              <CustomRefinementList
                attribute={attribute}
                operator="and"
                limit={100}
              />
            </ul>
          )}
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
}

SearchFilterWithoutHierarchy.propTypes = {
  name: PropTypes.string,
  attribute: PropTypes.string,
};

export default SearchFilterWithoutHierarchy;
