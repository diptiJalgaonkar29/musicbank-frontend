import React, { Component } from "react";
import V3AuthLayout from "../components/Layout/V3AuthLayout";
import V3SetPassword from "../components/SetPassword/V3SetPassword";

class V3SetPasswordPage extends Component {
  render() {
    return (
      <V3AuthLayout>
        <V3SetPassword />
      </V3AuthLayout>
    );
  }
}

export default V3SetPasswordPage;
