import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import FooterLinksWithRouter from "./FooterLinks/FooterLinks";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const HomePageFooter = ({ intl }) => {
  return (
    <BrandingContext.Consumer>
      {({ config }) => (
        <>
          {config.modules.showPageFooter && (
            <div className="HomePageFooter__footer">
              <p className="HomePageFooter__footer--text">
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
      )}
    </BrandingContext.Consumer>
  );
};

export default injectIntl(HomePageFooter);
