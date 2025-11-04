import React from "react";
import "./BackButton.css";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import { withRouterCompat } from "../../utils/withRouterCompat";


const BackButton = ({ navigate, handleClick, id }) => {
  console.log("handleClick", handleClick);
  const goBack = () => {
    handleClick ? handleClick?.() : navigate(-1);
  };

  return (
    <div className={`BackButton_container`} id={id} onClick={goBack}>
      <IconButtonWrapper icon="LeftArrow" />
    </div>
  );
};

export default withRouterCompat(BackButton);
