import React, { useContext } from "react";
import "./TakeToAIMenu.css";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";
import { useDispatch } from "react-redux";
import {
  setCommonMessage,
  setIsOpenCommonMessageModal,
} from "../../../redux/actions/commonMessageModal";
import getConfigJson from "../../../common/utils/getConfigJson";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const TakeToAIMenu = ({
  urlToNavigate,
  flaxId,
  className = "",
  buttonText,
}) => {
  const dispatch = useDispatch();
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const handleBtnClick = () => {
    if (CONFIG?.INPROCESS_FLAX_CUE_IDS?.includes(flaxId)) {
      dispatch(setIsOpenCommonMessageModal(true));
      dispatch(
        setCommonMessage({
          title: "",
          body: "The AI is in process of ingesting this track, please wait for 24 hours.",
        })
      );
      return;
    }
    try {
      localStorage.setItem("CSLoggingOut", "false");
      window.open(urlToNavigate, "_self");
    } catch (error) {}
  };
  return (
    <>
      {!!buttonText ? (
        <div
          className="TakeToAIMenu_buttonText_container boldFamily"
          onClick={handleBtnClick}
        >
          <p className="TakeToAIMenu_buttonText">{buttonText}</p>
          <IconButtonWrapper icon="AiIcon" className={`${className}`} />
        </div>
      ) : (
        <ToolTipWrapper title={"Search similar"}>
          <IconButtonWrapper
            icon="AiIcon"
            className={`${className}`}
            title="Search similar"
            onClick={handleBtnClick}
          />
        </ToolTipWrapper>
      )}
    </>
  );
};
export default TakeToAIMenu;
