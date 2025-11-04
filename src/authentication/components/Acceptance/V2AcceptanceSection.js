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
import { TermsOfUseContent } from "../../../imprint/templates/terms-of-use";
import "./V2Acceptance.css";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";
const enumNutzungsbedingungen = "zugang";
const enumPrivacyPolicy = "privacy";

const Nutzungsbedingungen = ({ clickOnNutzungen }) => {
  return (
    <span className="login-ac-anchor hover-cursor" onClick={clickOnNutzungen}>
      &nbsp;
      <span style={{ textDecoration: "underline" }}>
        <FormattedMessage id="auth.acceptanceWindow.last" />
      </span>
    </span>
  );
};

const RenderText = ({ clickOnNutzungenHandler }) => {
  return (
    <>
      <p className="login-ac-p">
        <span>
          <FormattedMessage id="auth.acceptanceWindow.first" />
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
  const content =
    type === enumPrivacyPolicy ? (
      <PrivacyAndPolicyContent />
    ) : (
      <TermsOfUseContent />
    );

  const title = type === enumPrivacyPolicy ? PRIVACY_POLICY : TERMS_OF_USE;

  return (
    <Dialog
      aria-labelledby="data-policy-dialog"
      open={open}
      onClose={close}
      fullWidth={true}
      maxWidth="xl"
    >
      <DialogTitle id="data-policy-dialog" dividers>
        {title}
      </DialogTitle>

      <DialogContent dividers>
        <SeeFullPageButtonWithRouting type={type} />
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default class V2AcceptanceSection extends Component {
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
    const { handleCheckBox } = this.props;
    const { openDialogHandler, closeDialogHandler } = this;

    return (
      <>
        <SimpleDialog open={open} type={type} close={closeDialogHandler} />
        <div className="login-ac-container-V2">
          <input
            required
            id="login-requirement"
            className="login-ac-input"
            type="checkbox"
            checked={handleCheckBox}
            aria-label="accept-data-protection"
          ></input>
          <label htmlFor="login-requirement">
            <RenderText
              clickOnNutzungenHandler={openDialogHandler.bind(
                this,
                enumNutzungsbedingungen
              )}
            />
          </label>

          <p className="login-ac-pp">
            We appreciate you visiting our website and your interest in the
            products we offer. Protecting your personal data is very important
            to us. In this{" "}
            <span
              onClick={openDialogHandler.bind(this, enumPrivacyPolicy)}
              className="login-ac-anchor-pp hover-cursor"
            >
              {PRIVACY_POLICY}
            </span>
            , we explain how we collect your personal information, what we do
            with it, for what purposes and on what legal foundation we do so,
            and what rights you have on that basis.
          </p>
        </div>
      </>
    );
  }
}
