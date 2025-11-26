import React, { useContext, useEffect, useState } from "react";
import MenuWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuWrapper";
import MenuItemWrapper from "../../../../branding/componentWrapper/MenuWrapper/MenuItemWrapper";
import { FormattedMessage } from "react-intl";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import IconButtonWrapper from "../../../../branding/componentWrapper/IconButtonWrapper";
import "./TokenMenu.css";
import { Divider } from "@mui/material";
import { BrandingContext } from "../../../../branding/provider/BrandingContext";
import AsyncService from "../../../../networking/services/AsyncService";
import { getUserMeta } from "../../../utils/getUserAuthMeta";
import { useDispatch } from "react-redux";
import { resetCustomTrackForm } from "../../../../redux/actions/customTrackForm/customTrackForm";
import { brandConstants } from "../../../utils/brandConstants";
import getSuperBrandName from "../../../utils/getSuperBrandName";
import IconWrapper from "../../../../branding/componentWrapper/IconWrapper"; 
const TokenMenu = () => {
  const [anchorEl, setisMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [creditDetails, setCreditDetails] = useState(null);
  // ✅ Utility: resolve CSS variables or return plain color
  const resolveColor = (colorVar) => {
    if (!colorVar) return colorVar;

    // Handle var(--color-name)
    if (colorVar.startsWith("var(")) {
      const name = colorVar.slice(4, -1).trim();
      return (
        getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          ?.trim() || colorVar
      );
    }

    // Handle --color-name
    if (colorVar.startsWith("--")) {
      return (
        getComputedStyle(document.documentElement)
          .getPropertyValue(colorVar)
          ?.trim() || colorVar
      );
    }

    // Already hex/rgb
    return colorVar;
  };

    const fetchCreditDetails = async () => {
    try {
      const res = await AsyncService.loadData(
        "/credit/creditDetails",
      );

      console.log(res.data,'/credit/creditDetails');
      
      setCreditDetails(res.data);

    } catch (err) {
      console.error("Credit API Error:", err);
    }
  };

  useEffect(() => {
    console.log(creditDetails,'creditDetails');
    
    fetchCreditDetails();
  }, []);

  const consumed = parseInt(creditDetails?.creditUsed ?? 0, 10);
  const total = parseInt(creditDetails?.creditAssigned ?? 0, 10);

  const consumedPercent = total > 0 ? (consumed / total) * 100 : 0;
  const remainingTokens = total - consumed;

  // console.log(consumedPercent, consumed, total, remainingTokens, "consumedPercent");

  const fillColor =
    remainingTokens <= parseInt(window.globalConfig.LOWEST_TOKEN_LIMIT ?? 10, 10)
      ? resolveColor("--color-token-alert")
      : resolveColor("--color-token-consumed"); // green
 
  return (
    <>
      <div
        onClick={(e) => setisMenuOpen(e.currentTarget)} 
      >
        <div>
          <div className="token-button-wrapper">
            {" "}
            <span>{consumed}</span>
            <IconWrapper icon={'CoinIcon'} />{" "}
          </div>
        </div>
      </div>
        <MenuWrapper
        id="token_menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setisMenuOpen(false)}
        PaperProps={{
          style: {
            overflow: "visible",
            maxWidth: "260px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="token_popup_container">
          <div className="token_header">
            <IconWrapper icon={'CoinIcon'} />
            <span>Tokens</span>
          </div>

          <div className="token_row">
            <span>Brand</span>
            <span className="token_value">{creditDetails?.totalBrandCredit}</span>
          </div>

          <div className="token_row">
            <span>Your Quota</span>
            <span className="token_value">{consumed} / {total}</span>
          </div>

          <div className="token_progress_bar">
            <div
              className="token_progress_fill"
              style={{
                width: `${consumedPercent}%`,
                backgroundColor: fillColor,
              }}
            ></div>
          </div>

          <div
            className="token_refill_btn"
            onClick={() => navigate("/credit-request")}
          >
            Refill Quota
          </div>
        </div>
      </MenuWrapper>
    </>
  );
};

export default TokenMenu;
