import PropTypes from "prop-types";
import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
// import "../../../_styles/NestedAccordion.css";
import "../../_styles/NestedAccordion.css";
import { AccordionElement } from "./components/AccordionElement";

function SearchFilterWithOneHierachy({ name, elements }) {
  const NestedContent = (
    <React.Fragment>
      {elements.map((el) => {
        return (
          <AccordionSummary
            aria-controls="panel2a-content"
            id="panel2a-header"
            key={el.name}
          >
            <AccordionElement
              name={el.name}
              attribute={el.attribute}
              key={el.name}
            />
          </AccordionSummary>
        );
      })}
    </React.Fragment>
  );

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
          <Accordion>{NestedContent}</Accordion>
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
}

SearchFilterWithOneHierachy.propTypes = {
  name: PropTypes.string,
  elements: PropTypes.array,
};

export default SearchFilterWithOneHierachy;
