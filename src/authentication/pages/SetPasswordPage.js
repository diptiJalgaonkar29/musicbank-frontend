import React, { Component } from "react";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import V2SetPassword from "../components/SetPassword/V2SetPassword";
import V2AuthLayout from "../components/Layout/V2AuthLayout";

class SetPasswordPage extends Component {
  render() {
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <V2AuthLayout>
            <V2SetPassword />
          </V2AuthLayout>
        )}
      </BrandingContext.Consumer>
    );
  }
}

export default SetPasswordPage;
