import React, { Component } from "react";
import { TERMS_OF_USE } from "../../document/constants/constants";
import { TermsOfUseContent } from "../templates/terms-of-use";
import "./Imprint.css";
import withNavigation from "./ImprintHOC";

class TermsOfUse extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    let content = <TermsOfUseContent />;

    return <>{content}</>;
  }
}

export default withNavigation(TermsOfUse, TERMS_OF_USE);
