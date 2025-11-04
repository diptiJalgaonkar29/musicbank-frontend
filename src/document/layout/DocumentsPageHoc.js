import React, { Component } from "react";
import { BrandingContext } from "../../branding/provider/BrandingContext";

import DocumentsSidebar from "../components/sidebar/DocumentsSidebar";
import DocumentsPage from "../pages/DocumentsPage";
import DocumentService from "../services/DocumentService";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import ReportForm from "../components/reportForm/ReportForm";
import {
  Spinner,
  SpinnerDefault,
} from "../../common/components/Spinner/Spinner";
import BackButton from "../../common/components/backButton/BackButton";
import getConfigJson from "../../common/utils/getConfigJson";
//import "./DocumentsPageHoc.css";
import "./DocumentsPageHocV2.css";
import appendCSUrlParams from "../../common/utils/appendCSUrlParams";
import { connect } from "react-redux";
import { withRouterCompat } from "../../common/utils/withRouterCompat";

//ref: https://prawira.medium.com/react-conditional-import-conditional-css-import-110cc58e0da6

// const UISetV1 = React.lazy(() => import("./UISetV1"));
// const UISetV2 = React.lazy(() => import("./UISetV2"));

// const ThemeSelector = ({ config, children }) => {
//   return (
//     <>
//       <React.Suspense fallback={<></>}>
//         {config.modules.UpdateUItoV2 ? <UISetV2 /> : <UISetV1 />}
//       </React.Suspense>
//       {children}
//     </>
//   );
// };

class DocumentsPageHoc extends Component {
  state = {
    loading: false,
    documentByCategoryData: null,
  };

  componentDidMount() {
    const category = this.props.match.params.category;

    if (category === "report") {
      return;
    }
    this.fetchDocumentByCategoryData(category);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.category !== this.props.match.params.category) {
      const category = this.props.match.params.category;

      if (category === "report") {
        return;
      }
      this.fetchDocumentByCategoryData(category);
    }
  }

  fetchDocumentByCategoryData = (category) => {
    if (!category) return;
    const lowerCaseCategoy = category.toLowerCase();
    this.setState({ loading: true, documentByCategoryData: null });
    DocumentService.loadByCategory(lowerCaseCategoy)
      .then((res) => {
        this.setState({
          loading: false,
          documentByCategoryData: res,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  renderContent = () => {
    const { documentByCategoryData } = this.state;
    return (
      <DocumentsPage
        category={this.props.match.params.category}
        documentByCategoryData={documentByCategoryData}
      />
    );
  };

  renderLoading = () => {
    return (
      <div className="DocumentsPage__container__v2__Loading">
        <SpinnerDefault />
      </div>
    );
  };

  render() {
    const { documentByCategoryData, loading } = this.state;
    const ssAccess = this.props?.userMeta?.ssAccess;

    return (
      <>
        <BrandingContext.Consumer>
          {({ config, jsonConfig }) => (
            <MainLayout isUnregistered={!ssAccess}>
              {!ssAccess && (
                <BackButton
                  id="document_backButton_container"
                  handleClick={() =>
                    window.open(
                      `${
                        process.env.NODE_ENV === "development"
                          ? "http://localhost:3098"
                          : jsonConfig?.CS_BASE_URL
                      }?${appendCSUrlParams()}`,
                      "_self"
                    )
                  }
                />
              )}

              <div
                className={`${
                  config.modules?.UpdateUItoV2
                    ? "DocumentsPage__container__v2"
                    : "DocumentsPage__container"
                }`}
              >
                <React.Fragment>
                  <DocumentsSidebar
                    category={this.props.match.params.category}
                    fetchDocumentByCategoryData={
                      this.fetchDocumentByCategoryData
                    }
                  />
                  <div className="DocumentsPage__content">
                    {this.props.match.params.category === "report" ? (
                      <ReportForm />
                    ) : (
                      <>
                        {loading === true && documentByCategoryData === null
                          ? this.renderLoading()
                          : this.renderContent()}
                      </>
                    )}
                  </div>
                </React.Fragment>
              </div>
              {/* </ThemeSelector> */}
            </MainLayout>
          )}
        </BrandingContext.Consumer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userMeta: state.userMeta,
  };
};

export default withRouterCompat(connect(mapStateToProps, null)(DocumentsPageHoc));
