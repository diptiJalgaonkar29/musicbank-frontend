import PropTypes from "prop-types";
import React from "react";
// import { AccordionItemBody, AccordionItemTitle } from 'react-accessible-accordion';
import CustomRefinementList from "./CustomRefinementLists";

export function AccordionElement({ name, attribute }) {
  return (
    <React.Fragment>
      {/* <AccordionItemTitle id="nested_accordion__title" key={name}>
        <div id="nested_accordion__title--text">
          <h3>{name}</h3>
          <div
            className="accordion__arrow"
            id="accordion__arrow__nested"
            role="presentation"
          />
        </div>
      </AccordionItemTitle>

      <AccordionItemBody id="nested_accordion__body--top">
        <ul className="nested_accordion__body--ul">
          <CustomRefinementList attribute={attribute} operator="and" />
        </ul>
      </AccordionItemBody> */}
    </React.Fragment>
  );
}

AccordionElement.propTypes = {
  name: PropTypes.string,
  attribute: PropTypes.string,
};
