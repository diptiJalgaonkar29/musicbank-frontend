import React, { Component, Fragment } from "react";
import { IntlProvider } from "react-intl";
import { flattenMessages } from "../../common/utils/messagesUtils";
import BrandingService from "../BrandingService";
import { BrandingContext } from "./BrandingContext";
import StylingProvider from "./StylingProvider";
import FallBackPage from "../../common/pages/FallBackPage";
// import { store } from "../../redux/stores/store";
// import { setConfigJson } from "../../redux/actions/configJsonActions/configJsonActions";

class BrandingProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      config: {},
      messages: {},
      theme: {},
      isBrandNameUpdate: false,
      jsonConfig: {},
    };
    this.updateBrandThemeConfig = this?.updateBrandThemeConfig?.bind(this);
    this.updateSuperBrandThemeConfig =
      this?.updateSuperBrandThemeConfig?.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });

    BrandingService.get()
      .then(async (result) => {
        console.log("result********", result);
        if (!result) return;
        const { modules, messages, theme, jsonConfig } = result;
        this.setState({
          config: { modules },
          theme,
          messages,
          isLoading: false,
          jsonConfig,
        });
      })
      .catch((error) => {
        console.log("error", error?.message);
      });
  }

  async updateBrandThemeConfig() {
    this.setState({
      isLoading: true,
    });
    try {
      let result = await BrandingService.get();
      console.log("updateBrandThemeConfig result********", result);
      const { modules, messages, theme, jsonConfig } = result;
      this.setState({
        config: { modules },
        theme,
        messages,
        isLoading: false,
        isBrandNameUpdate: !this?.state?.isBrandNameUpdate,
        jsonConfig,
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  async updateSuperBrandThemeConfig() {
    this.setState({
      isLoading: true,
    });
    try {
      let result = await BrandingService.get();
      console.log("updateSuperBrandThemeConfig result********", result);
      const { modules, messages, theme, jsonConfig } = result;
      this.setState({
        config: { modules },
        theme,
        messages,
        isLoading: false,
        isBrandNameUpdate: !this?.state?.isBrandNameUpdate,
        jsonConfig,
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const { children } = this.props;
    const { isLoading, messages, theme } = this.state;
    console.log("this.state", this.state);
    if (isLoading) {
      return <FallBackPage />;
    }
    return (
      <Fragment key={this?.state?.isBrandNameUpdate}>
        <BrandingContext.Provider
          value={{
            ...this.state,
            updateBrandThemeConfig: this.updateBrandThemeConfig,
            updateSuperBrandThemeConfig: this.updateSuperBrandThemeConfig,
          }}
        >
          <IntlProvider locale="en" messages={flattenMessages(messages)}>
            <StylingProvider stylingVariables={theme}>
              {children}
            </StylingProvider>
          </IntlProvider>
        </BrandingContext.Provider>
      </Fragment>
    );
  }
}

export default BrandingProvider;
