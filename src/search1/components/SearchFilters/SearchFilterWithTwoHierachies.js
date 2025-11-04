import PropTypes from "prop-types";
import React, { Component } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { generateUniqueID } from "../../../common/utils/generateUniqueID";
import AlgoliaService from "../../../networking/services/AlgoliaService";
import "../../_styles/NestedAccordion.css";
import CustomRefinementList from "./components/CustomRefinementLists";
import CustomRefineTitle from "./components/CustomRefinementTitle";
import trackExternalAPICalls from "../../../common/services/trackExternalAPICalls";

class SearchFilterWithTwoHierachies extends Component {
  state = {
    NestedContent: null,
  };

  componentDidMount() {
    const { attribute } = this.props;

    AlgoliaService.getClient().getSettings((error, content) => {
      if (error) {
        console.log("getClient error", error);
        trackExternalAPICalls({
          url: "",
          requestData: JSON.stringify({}),
          usedFor: "getClient",
          serviceBy: "Algolia",
          statusCode: error?.statusCode || "404",
          statusMessage: error?.message,
        });
        console.error("Error fetching settings from Algolia:", error);
        return;
      }

      trackExternalAPICalls({
        url: "",
        requestData: JSON.stringify({}),
        usedFor: "getClient",
        serviceBy: "Algolia",
        statusCode: 200,
        statusMessage: "",
      });
      const data = content.attributesForFaceting;
      const filteredData = data.filter((country) =>
        country.startsWith(`${attribute}_h1`)
      );
      const splittedFilteredArray = filteredData.map((item) => item.split("."));

      let NestedContent = splittedFilteredArray.map((item, index) => {
        return (
          <React.Fragment key={generateUniqueID()}>
            <AccordionSummary
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <CustomRefineTitle
                attribute={`${attribute}_h1.${item[1]}`}
                id={generateUniqueID()}
                attributeName={`${item[1]}`}
              />
            </AccordionSummary>
            <AccordionDetails>
              <ul className="nested_accordion__body--ul" key={index}>
                <CustomRefinementList
                  attribute={`${attribute}_h2.${item[1]}`}
                  operator="and"
                  limit={100}
                />
              </ul>
            </AccordionDetails>
          </React.Fragment>
        );
      });

      this.setState({
        NestedContent,
      });
    });
  }

  render() {
    const { NestedContent } = this.state;
    const { name } = this.props;

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
            <Accordion accordion={true}>
              {NestedContent ? NestedContent : null}
            </Accordion>
          </AccordionDetails>
        </Accordion>
      </React.Fragment>
    );
  }
}

SearchFilterWithTwoHierachies.propTypes = {
  name: PropTypes.string,
  // attribute: PropTypes.array,
};

export default SearchFilterWithTwoHierachies;
