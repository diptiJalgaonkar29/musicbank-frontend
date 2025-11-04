import PropTypes from "prop-types";
import React from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CustomRefinementList from "./CustomRefinementLists";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";

export function AccordionElement({ name, attribute }) {
  return (
    <React.Fragment>
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
        <h3 style={{ display: "flex", lineHeight: "26px" }}>
          <div
            className="accordion__arrow"
            id="accordion__arrow__nested"
            role="presentation"
            style={{ marginRight: "5px" }}
          />
          {name}
        </h3>
      </AccordionSummary>
      <AccordionDetails>
        <ul className="nested_accordion__body--ul">
          <CustomRefinementList
            attribute={attribute}
            operator="and"
            limit={100}
          />
        </ul>
      </AccordionDetails>
      {/* <AccordionItemTitle id="nested_accordion__title" key={name}>
        <div id="nested_accordion__title--text">
          <h3 style={{display:'flex', lineHeight:'26px'}}>
            <div
              className="accordion__arrow"
              id="accordion__arrow__nested"
              role="presentation"
              style={{marginRight:'5px'}}
            />
            {name}
          </h3>
          
        </div>
      </AccordionItemTitle>

      <AccordionItemBody id="nested_accordion__body--top">
        <ul className="nested_accordion__body--ul">
          <CustomRefinementList attribute={attribute} operator="and" limit={100}  />
        </ul>
      </AccordionItemBody> */}
    </React.Fragment>
  );
}

AccordionElement.propTypes = {
  name: PropTypes.string,
  attribute: PropTypes.string,
};
