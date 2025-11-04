import React from "react";
import PropTypes from "prop-types";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionItemTitle,
//   AccordionItemBody,
// } from "react-accessible-accordion";

import CustomRefinementList from "./components/CustomRefinementLists";
import "../../../_styles/NestedAccordion.css";

function SearchFilterWithoutHierarchy({ name, attribute }) {
  return (
    <React.Fragment>
      {/* <Accordion className="accordion">
        <AccordionItem>
          <AccordionItemTitle>
            <h4 className="u-position-relative">
              Filter By {name}
              <div className="accordion__arrow" role="presentation" />
            </h4>
          </AccordionItemTitle>
          <AccordionItemBody id="nested_accordion__body--top">
            <Accordion accordion={true} id="nested_accordion">
              <ul className="nested_accordion__body--ul">
                <CustomRefinementList attribute={attribute} operator="and" />
              </ul>
            </Accordion>
          </AccordionItemBody>
        </AccordionItem>
      </Accordion> */}
    </React.Fragment>
  );
}

SearchFilterWithoutHierarchy.propTypes = {
  name: PropTypes.string,
  attribute: PropTypes.string,
};

export default SearchFilterWithoutHierarchy;
