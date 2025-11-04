import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";

import "../../_styles/NoMatchPage.css";
import NavBar from "../../common/components/Navbar/NavBar";
import { useSelector } from "react-redux";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { isAuthenticated } from "../../common/utils/getUserAuthMeta";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

const NoMatchPage = ({ navigate, intl }) => {
  const goBackHandler = () => {
    navigate("/");
  };

  return (
    <div className="container">
      {isAuthenticated() && (
        <div className="header">
          <nav className="navbar__grid">
            <NavBar />
          </nav>
        </div>
      )}

      <div className="noMatch__Description">
        <div className="noMatch__Description--wrapper">
          <div className="noMatch__Description--heading">
            <h2>
              <FormattedMessage id="app.noMatch.title" />
            </h2>
          </div>
          <div className="noMatch__Description--extra">
            <p>
              <FormattedMessage id="app.noMatch.body" />
            </p>
          </div>
          <div className="noMatch__Description--button">
            <ButtonWrapper onClick={goBackHandler}>Back to home</ButtonWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(withRouterCompat(NoMatchPage));
