import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import FooterLinksWithRouter from "./FooterLinks/FooterLinks";
import "./Footer.css";

const Footer = ({ intl, config }) => {
  return (
    <>
      {config.modules.showPageFooter && (
        <div className="common_footer">
          <p className="footer--text">
            <FooterLinksWithRouter />
            {config.modules.showDisclaimerText && (
              <>
                <br />
                <br />
                <FormattedMessage id="app.footer.main" />
                &nbsp;
                <a href={`mailto:${intl.messages["app.footer.email"]}`}>
                  <FormattedMessage id="app.footer.email" />
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default injectIntl(Footer);
