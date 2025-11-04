import React, { Component } from "react";
import V3AuthLayout from "../components/Layout/V3AuthLayout";
import V3RecoverPassword from "../components/RecoverPassword/V3RecoverPassword";

class V3RecoverPasswordPage extends Component {
  render() {
    return (
      <V3AuthLayout>
        <V3RecoverPassword />
      </V3AuthLayout>
    );
  }
}

export default V3RecoverPasswordPage;
