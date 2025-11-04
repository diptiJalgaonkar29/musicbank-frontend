import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

import { isAuthenticated as isAuthenticatedFunc } from "../../common/utils/getUserAuthMeta";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

class PathRedirecter extends Component {
  isAuthenticated() {
    const { authentication } = this.props;
    return isAuthenticatedFunc();
  }

  renderRedirectToSearchPage() {
    const { location } = this.props;
    return (
      <Navigate to="/" state={{ from: location }} replace />
    );
  }

  render() {
    const { location } = this.props;
    const isAuthenticated = this.isAuthenticated();
    const pathIsRoot = location.pathname === "/login";
    if (isAuthenticated && pathIsRoot) {
      return this.renderRedirectToSearchPage();
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default withRouterCompat(connect(mapStateToProps, null)(PathRedirecter));
