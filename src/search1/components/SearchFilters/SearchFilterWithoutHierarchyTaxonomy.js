import React from "react";
import PropTypes from "prop-types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import "../../_styles/NestedAccordion.css";
import CustomRefinementListsTaxonomy from "./components/CustomRefinementListsTaxonomy";

function SearchFilterWithoutHierarchyTaxonomy({ name, attribute }) {
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
          <h4 className="u-position-relative">Filter By {name}</h4>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="nested_accordion__body--ul">
            <CustomRefinementListsTaxonomy
              attribute={attribute}
              operator="and"
              limit={100}
            />
          </ul>
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
}

SearchFilterWithoutHierarchyTaxonomy.propTypes = {
  name: PropTypes.string,
  attribute: PropTypes.string,
};

export default SearchFilterWithoutHierarchyTaxonomy;
