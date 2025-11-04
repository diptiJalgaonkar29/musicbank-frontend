import React, { Component } from "react";

import { Consumer } from "../../constants/constants";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import AsyncService from "../../../networking/services/AsyncService";
import { withRouterCompat } from "../../../common/utils/withRouterCompat";

class DocumentsSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      availableCategories: [], // category names from API
    };
  }

  componentDidMount() {
    this.fetchAvailableCategories();
  }

  fetchAvailableCategories() {
    AsyncService.loadData(`/documents/count`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const categories = res.data.map((item) =>
            item.category.toLowerCase()
          );
          // this.setState({ availableCategories: categories });
          this.setState({ availableCategories: categories }, () => {
            if (categories.length === 1) {
              const onlyCategory = categories[0];
              this.handleSelectCategory(onlyCategory, true); // or false, depending on your use case
            }
          });
        }
      })
      .catch((error) => {
        console.log("Error fetching available categories:", error);
      });
  }

  handleSelectCategory = (category, isFetchData) => {
    console.log("category", category);
    const categoryLowerCase = category.toLowerCase();

    if (this.state.category === categoryLowerCase) {
      return; // Already selected
    }

    this.setState(
      {
        category: categoryLowerCase,
      },
      () => {
        if (categoryLowerCase !== "report") {
          this.props.fetchDocumentByCategoryData(
            categoryLowerCase,
            isFetchData
          );
        }
        this.props.navigate(`/documents/${categoryLowerCase}`);
      }
    );
  };

  render() {
    const { category } = this.props;
    const { availableCategories } = this.state;
    console.log("availableCategories", availableCategories);

    return (
      <div className="DocumentsPage__sidebar">
        <ul className="DocumentsPage__sidebar--list">
          <BrandingContext.Consumer>
            {({ config }) =>
              Consumer(config.modules.showReport).map((categoryMeta) => {
                const isAvailable = availableCategories.includes(
                  categoryMeta.route.toLowerCase()
                );
                return (
                  categoryMeta.isVisible &&
                  isAvailable && (
                    <li
                      className="DocumentsPage__Item"
                      key={categoryMeta.id}
                      onClick={() => {
                        this.handleSelectCategory(
                          categoryMeta.route,
                          categoryMeta.isFetchData
                        );
                      }}
                    >
                      <p
                        className={
                          category &&
                            category.toLowerCase() ===
                            categoryMeta.route.toLowerCase()
                            ? "activeColor"
                            : " "
                        }
                      >
                        {categoryMeta.label}
                      </p>
                    </li>
                  )
                );
              })
            }
          </BrandingContext.Consumer>
        </ul>
      </div>
    );
  }
}

export default withRouterCompat(DocumentsSidebar);
