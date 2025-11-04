import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import {
  PRIVACY_POLICY,
  PRIVACY_POLICY_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
  TERMS_OF_USE,
} from "../../../document/constants/constants";
import "../../../imprint/pages/Imprint.css";
import { PrivacyAndPolicyContent } from "../../../imprint/templates/privacy-and-policy";
import "./V3Acceptance.css";

import TypographyWrapper from "../../../branding/componentWrapper/TypographyWrapper";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { getBrandAssetBaseUrl } from "../../../common/utils/getBrandAssetMeta";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";
// import RadioWrapper from "../../../branding/componentWrapper/RadioWrapper";

const enumNutzungsbedingungen = "zugang";
const enumPrivacyPolicy = "privacy";

const Nutzungsbedingungen = ({ clickOnNutzungen }) => {
  return (
    <span className="login-ac-anchor hover-cursor" onClick={clickOnNutzungen}>
      &nbsp;
      <span style={{ textDecoration: "underline" }}>
        <TypographyWrapper
          type="xs-body"
          slot="span"
          textID="auth.acceptanceWindow.last"
          className="tiplink"
        ></TypographyWrapper>
        {/* <FormattedMessage id="auth.acceptanceWindow.last" /> */}
      </span>
    </span>
  );
};

const RenderText = ({ clickOnNutzungenHandler }) => {
  return (
    <>
      <p className="login-ac-p">
        <span>
          <TypographyWrapper
            type="xs-body"
            slot="span"
            textID="auth.acceptanceWindow.first"
            className="tip"
          ></TypographyWrapper>
          {/* <FormattedMessage id="auth.acceptanceWindow.first" /> */}
        </span>
        <Nutzungsbedingungen clickOnNutzungen={clickOnNutzungenHandler} />
        {/* <FormattedMessage id="auth.acceptanceWindow.last" /> */}
      </p>
    </>
  );
};

const SeeFullPageButton = ({ navigate, type }) => {
  const pushRouterTo =
    type === enumPrivacyPolicy
      ? PRIVACY_POLICY_ROUTE
      : TERMS_AND_CONDITIONS_ROUTE;
  return (
    <div
      className="goForward-Section"
      onClick={() => navigate(pushRouterTo)}
    >
      <p className="goForward">See Full Page</p>
      <ArrowForwardIcon />
    </div>
  );
};

const SeeFullPageButtonWithRouting = withRouterCompat(SeeFullPageButton);

const SimpleDialog = ({ open, close, type }) => {
  let origin = document.location.origin;
  let termsOfUserIframeUrl = `${getBrandAssetBaseUrl()}/html/termsOfUse.html`;
  const content =
    type === enumPrivacyPolicy ? (
      <PrivacyAndPolicyContent />
    ) : (
      <>
        <iframe
          src={termsOfUserIframeUrl}
          className="terms_of_use_modal_iframe"
        />
      </>
    );

  const title = type === enumPrivacyPolicy ? PRIVACY_POLICY : TERMS_OF_USE;

  return (
    <ModalWrapper
      isOpen={open}
      onClose={close}
      title={title}
      aria-labelledby="data-policy-dialog"
      className="data-policy-dialog"
    >
      {content}
      <div className="data_policy_dialog_btn_container">
        <ButtonWrapper onClick={close}>Close</ButtonWrapper>
      </div>
    </ModalWrapper>
  );
};

export default class V3AcceptanceSection extends Component {
  state = {
    open: false,
    type: null,
  };

  openDialogHandler = (type) => {
    this.setState({
      open: true,
      type,
    });
  };

  closeDialogHandler = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { open, type } = this.state;
    const { handleCheckBox, children } = this.props;
    const { openDialogHandler, closeDialogHandler } = this;

    return (
      <>
        <SimpleDialog open={open} type={type} close={closeDialogHandler} />
        <div className="login-ac-container-V3">
          {!!children ? (
            <>{children}</>
          ) : (
            <input
              required
              id="login-requirement"
              className="login-ac-input"
              type="checkbox"
              checked={handleCheckBox}
              aria-label="accept-data-protection"
            />
            // <RadioWrapper
            //   required
            //   id="login-requirement"
            //   className="login-ac-input"
            //   type="checkbox"
            //   checked={handleCheckBox}
            //   aria-label="accept-data-protection"
            // />
          )}

          <label htmlFor="login-requirement">
            <RenderText
              clickOnNutzungenHandler={openDialogHandler.bind(
                this,
                enumNutzungsbedingungen
              )}
            />
          </label>
        </div>
      </>
    );
  }
}
