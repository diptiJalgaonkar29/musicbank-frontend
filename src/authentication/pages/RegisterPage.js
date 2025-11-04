import React from "react";
import V2Register from "../components/Register/V2Register";
import V2AuthLayout from "../components/Layout/V2AuthLayout";

const RegisterPage = () => {
  return (
    <V2AuthLayout>
      <V2Register />
    </V2AuthLayout>
  );
};

export default RegisterPage;
