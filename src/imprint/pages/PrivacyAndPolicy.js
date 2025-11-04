import React, { Component } from "react";
import DeclineCookiesSwitch from "../../common/components/DeclineCookies/index";
import { PRIVACY_POLICY } from "../../document/constants/constants";
import { PrivacyAndPolicyContent } from "../templates/privacy-and-policy";

import "./Imprint.css";
import withNavigation from "./ImprintHOC";

const Wrapper = ({ isAuthProp }) => {
  let content = <PrivacyAndPolicyContent />;

  return (
    <div className="impr" id="impr-pp">
      {isAuthProp === true ? <DeclineCookiesSwitch /> : null}
      {content}
    </div>
  );
};

class PrivacyPolicy extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { isAuthProp } = this.props;
    return <Wrapper isAuthProp={isAuthProp} />;
  }
}

export default withNavigation(PrivacyPolicy, PRIVACY_POLICY);
