import { useState } from "react";
import "./BrandButton.css";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";

const getToolTipText = (brand) => {
  switch (brand?.status) {
    case "pending":
      return "Request pending";
    case "notexits":
      return "Request Access";
    default:
      return null;
  }
};

const BrandButton = ({ brand, handleSelectBrand, className = "" }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="BrandButton_container">
      <ToolTipWrapper title={getToolTipText(brand)}>
        <button
          key={brand?.brandId}
          disabled={brand?.status === "pending"}
          className={`brandLogo_container ${brand?.status} ${className}`}
          id={`brand_${brand?.brandId}`}
          onClick={() => {
            if (brand?.status === "pending") return;
            handleSelectBrand({
              brandId: brand?.brandId,
              brandName: brand?.brandName,
            });
          }}
        >
          {/* Skeleton Loader */}
          {isImageLoading && <div className="skeleton-loader" />}

          {/* Brand Image */}
          <img
            className={`brandLogo brand_selection_btn ${
              isImageLoading ? "hidden" : ""
            }`}
            src={
              process.env.NODE_ENV === "development"
                ? "/brandassets/common/images/default_amp_brand.png"
                : `/brandassets/common/images/${brand?.brandId}_logo.png`
            }
            alt="brand_logo"
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "/brandassets/common/images/default_amp_brand.png";
            }}
          />
        </button>

        <p className="brand_text">{brand?.brandName}</p>
      </ToolTipWrapper>
    </div>
  );
};

export default BrandButton;
