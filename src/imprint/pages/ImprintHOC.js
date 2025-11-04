import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { connect } from "react-redux";

import AuthFooter from "../../common/components/Footer/AuthFooter";
import Navbar from "../../common/components/Navbar/NavBar";
import { isAuthenticated as isAuthenticatedFunc } from "../../common/utils/getUserAuthMeta";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

const GoBack = ({ navigate }) => {
  return (
    <div className="impr-goBack-Section" onClick={() => navigate(-1)}>
      <ArrowBackIcon />
      <h3 className="impr-goBack">Go Back</h3>
    </div>
  );
};

const GoBackWithRouting = withRouterCompat(GoBack);

export default (WrappedComponent, headline) => {
  const mapStateToProps = (state) => ({
    authentication: state.authentication,
  });

  const EnhancedComponent = (props) => {
    const isAuthenticated = () => {
      const { authentication } = props;
      return isAuthenticatedFunc();
    };

    const isAuth = isAuthenticated();
    return (
      <div className="impr-page">
        {isAuth && <Navbar />}
        <div className="impr-container">
          <div className="impr-headline">
            <h1 className="impr-headline__title">{headline}</h1>
          </div>
          <div className="impr-text">
            <GoBackWithRouting />
            <WrappedComponent {...props} isAuthProp={isAuth} />
          </div>
        </div>
        <AuthFooter variant="dark" isLoggedIn={isAuth} />
      </div>
    );
  };

  return connect(mapStateToProps, null)(EnhancedComponent);
};
