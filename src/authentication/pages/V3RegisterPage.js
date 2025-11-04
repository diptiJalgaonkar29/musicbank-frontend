import React from "react";
import V3Register from "../components/Register/V3Register";
import V3AuthLayout from "../components/Layout/V3AuthLayout";

const V3RegisterPage = () => {
  return (
    <V3AuthLayout>
      <V3Register />
    </V3AuthLayout>
  );
};

export default V3RegisterPage;
