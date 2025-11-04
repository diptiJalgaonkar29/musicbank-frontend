import { Component } from "react";
import { injectIntl } from "react-intl";

import "../../_styles/NoMatchPage.css";
import NavBar from "../../common/components/Navbar/NavBar";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { connect } from "react-redux";
import { isAuthenticated } from "../../common/utils/getUserAuthMeta";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("componentDidCatch : ", error, errorInfo);
  }

  goBackHandler = () => {
    this.props.navigate("/");
  };

  render() {
    const { hasError, error } = this.state;
    const { authentication } = this.props;

    if (hasError) {
      return (
        <>
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
                  <h2>Something went wrong</h2>
                </div>
                <div className="noMatch__Description--extra">
                  <p>{error.message && <span>Error: {error.message}</span>}</p>
                </div>
                <div className="noMatch__Description--button">
                  <ButtonWrapper onClick={this.goBackHandler}>
                    Back
                  </ButtonWrapper>
                </div>
              </div>
            </div>
          </div>
          <p>Something went wrong 😭</p>

          {error.message && <span>Here's the error: {error.message}</span>}
        </>
      );
    }

    return this.props.children;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  return {
    authentication: state.authentication,
  };
};

export default injectIntl(
  withRouterCompat(connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary))
);
