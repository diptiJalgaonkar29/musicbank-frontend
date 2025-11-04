import PropTypes from "prop-types";
import React from "react";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionItemBody,
//   AccordionItemTitle,
// } from "react-accessible-accordion";
import "../../../_styles/NestedAccordion.css";
import { AccordionElement } from "./components/AccordionElement";

function SearchFilterWithOneHierachy({ name, elements }) {
  const NestedContent = (
    <React.Fragment>
      {elements.map((el) => {
        return (
          <></>
          // <AccordionItem key={el.name}>
          //   <AccordionElement
          //     name={el.name}
          //     attribute={el.attribute}
          //     key={el.name}
          //   />
          // </AccordionItem>
        );
      })}
    </React.Fragment>
  );

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
              {NestedContent}
            </Accordion>
          </AccordionItemBody>
        </AccordionItem>
      </Accordion> */}
    </React.Fragment>
  );
}

SearchFilterWithOneHierachy.propTypes = {
  name: PropTypes.string,
  elements: PropTypes.array,
};

export default SearchFilterWithOneHierachy;
