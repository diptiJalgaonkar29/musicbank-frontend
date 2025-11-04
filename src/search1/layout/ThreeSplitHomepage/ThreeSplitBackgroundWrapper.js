import React, { Component } from "react";
// import NumberUtils from "../../../common/utils/NumberUtils";
import "../../_styles/CustomSearchForAll.css";
import SpotifySearch3 from "../../../cyanite/components/SpotifySearch3";
import { TitleHomepage } from "../../components/Searchbar/Title";

class ThreeSplitBackgroundWrapper extends Component {
  render() {
    const { config } = this.props;

    return (
      <React.Fragment>
        <div className="SearchPageTS__TitleSection SearchPageTS__TitleSection__Custom">
          <div className="SearchPageTS__SearchSection SearchPageTS__SearchSection__Custom">
            <div className="SearchPageTS__SearchSectionInner__Custom">
              <TitleHomepage />
            </div>
          </div>
          <div className="SearchPageTS__LogoSection SearchPageTS__LogoSection__Custom">
            <div className="gotoSuperSearchFooter">
              {config.modules.SpotifySearchBox && (
                <>
                  <div className="homePageSearch__Holder">
                    <div className="homePageSearch__HolderInner">
                      <SpotifySearch3 fromSS={true} />
                    </div>
                  </div>
                  <br />
                </>
              )}
            </div>
          </div>
          <div className="clearBothWelcome"></div>
        </div>
        <div className="clearBothWelcome"></div>
      </React.Fragment>
    );
  }
}

export default ThreeSplitBackgroundWrapper;
