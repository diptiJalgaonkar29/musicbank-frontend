import { useContext } from "react";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import React from "react";
import "./SimilaritySearchMenu.css";
import IconButtonWrapper from "../../../branding/componentWrapper/IconButtonWrapper";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";

const SimilaritySearchMenu = ({
  cyaniteId,
  trackId,
  className = "",
  buttonText,
}) => {
  const { config } = useContext(BrandingContext);
  return (
    <>
      {cyaniteId !== null && config.modules.SimilaritySearchBtn && (
        <>
          {!!buttonText ? (
            <div
              className="SimilaritySearchMenu_buttonText_container boldFamily"
              onClick={() => {
                const win = window.open(
                  "/#/similar_tracks/" + cyaniteId + "-" + trackId,
                  "_self"
                );
                win.focus();
              }}
            >
              <p className="SimilaritySearchMenu_buttonText">{buttonText}</p>
              <IconButtonWrapper
                icon="SimilaritySearchSH2"
                className={`${className}`}
              />
            </div>
          ) : (
            <ToolTipWrapper title={"Search similar"}>
              <IconButtonWrapper
                icon="SimilaritySearchSH2"
                className={`${className}`}
                onClick={() => {
                  const win = window.open(
                    "/#/similar_tracks/" + cyaniteId + "-" + trackId,
                    "_self"
                  );
                  win.focus();
                }}
              />
            </ToolTipWrapper>
          )}
        </>
      )}
    </>
  );
};
export default SimilaritySearchMenu;
