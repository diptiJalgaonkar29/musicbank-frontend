import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import "./AuthFooter.css";
import FooterLinksWithRouter from "./FooterLinks/FooterLinks";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const ExtendedAuthFooter = ({ intl }) => {
  return (
    <>
      <FormattedMessage id="app.footer.main" />
      &nbsp;
      <a href={`mailto:${intl.messages["app.footer.email"]}`}>
        <FormattedMessage id="app.footer.email" />
      </a>
    </>
  );
};
const ConnectedExtendedAuthFooter = injectIntl(ExtendedAuthFooter);

const AuthFooter = ({ variant, isLoggedIn }) => {
  return (
    <BrandingContext.Consumer>
      {({ config }) => (
        <>
          {config.modules.showPageFooter && (
            <div
              className="authFooter"
              style={{
                backgroundColor:
                  variant === "dark"
                    ? "var(--login-background-color)"
                    : "transparent",
              }}
            >
              <p
                style={{
                  color: "var(--color-white)",
                }}
              >
                <FooterLinksWithRouter />
                {isLoggedIn && <ConnectedExtendedAuthFooter />}
              </p>
            </div>
          )}
        </>
      )}
    </BrandingContext.Consumer>
  );
};

export default AuthFooter;
