import React from "react";
import V3AuthLayout from "../components/Layout/V3AuthLayout";
import V3RegisterSSO from "../components/Register/V3RegisterSSO";

const V3RegisterSSOPage = () => {
  return (
    <V3AuthLayout>
      <V3RegisterSSO />
    </V3AuthLayout>
  );
};

export default V3RegisterSSOPage;
