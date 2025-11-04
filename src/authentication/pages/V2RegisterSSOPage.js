import React from "react";
import V3RegisterSSO from "../components/Register/V3RegisterSSO";
import V2AuthLayout from "../components/Layout/V2AuthLayout";

const V2RegisterSSOPage = () => {
  return (
    <V2AuthLayout>
      <V3RegisterSSO />
    </V2AuthLayout>
  );
};

export default V2RegisterSSOPage;
