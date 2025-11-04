import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import FooterLinksWithRouter from "./FooterLinks/FooterLinks";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const TrackPageFooter = ({ intl }) => {
  return (
    <BrandingContext.Consumer>
      {({ config }) => (
        <>
          {config.modules.showPageFooter && (
            <div className="TrackPage__footer">
              <p className="TrackPage__footer--text">
                <FooterLinksWithRouter />
                {config.modules.showDisclaimerText && (
                  <>
                    <br />
                    <br />
                    <FormattedMessage id="app.footer.main" />
                    :&nbsp;
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

export default injectIntl(TrackPageFooter);
