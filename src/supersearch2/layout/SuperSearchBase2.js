import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import { BrandingContext } from "../../branding/provider/BrandingContext";
//import TSPTrackSlider from "../../../browse/layout/TSPTrackSlider";
import HomePageFooter from "../../common/components/Footer/HomePageFooter";
import NavBar from "../../common/components/Navbar/NavBar";
import "../../_styles/HomePageHocNew.css";

//import SearchBarWithTitleText from "../../components/Searchbar/SearchBarTSP";
//import ThreeSplitBackground from "./ThreeSplitBackgroundWrapper";
//import "./ThreeSplitHomepage.css";
import { Button } from "../../common/components/Button/Button";

//import SearchFilterSet from "../pages/SearchFilterPage"
//import SuperSearchFilter from "../pages/SuperSearchFilterPage2";
//import { CustomCurrentRefinements1 } from "../pages/SuperSearchFilterPage2";
//import CustomRefinementList from "../../search/components/SearchFilters/components/CustomRefinementLists";
//import { CurrentRefinementsSection, HiddenTagAllRefinement, ResultsForText, SearchFilters, SearchResultsPagination } from "../../search/pages/searchResult/SearchResultsPageFragments";
//import { connectHits } from 'react-instantsearch-dom';
import { RefinementList, CurrentRefinements } from "react-instantsearch-dom";
import { SSCustomRefinementBubbles } from "../components/SSCustomRefinementBubbles8";
import { SSCustomInfiniteHits } from "../components/SSCustomInfiniteHits";
import { SSCustomClearRefinements } from "../components/SSCustomClearRefinements";
import { SSCustomCurrentRefinements } from "../components/SSCustomCurrentRefinements";
//import { CustomToggleRefinement } from "../components/SSToggleRefinement";

import SpotifySearch2 from "../../cyanite/components/SpotifySearch2";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "../SuperSearchStyle.css";

var selfThis;
var currenTab = "";

class SuperSearchBase2 extends Component {
  constructor(props) {
    super(props);
    selfThis = this;
    this.childRef = React.createRef();
  }

  renderNavBar() {
    return (
      <nav className="SearchPageTS__navigation">
        <NavBar />
      </nav>
    );
  }

  renderTitleSection(config) {
    return (
      <>
        {/* <ThreeSplitBackground config={config}>
                    <div className="SearchPageTS__SearchSection">
                        <SearchBarWithTitleText /> 
                    </div>
                </ThreeSplitBackground> */}
      </>
    );
  }

  renderFooter() {
    return (
      <>
        <div className="SearchPageTS__FooterSection">
          <HomePageFooter />
        </div>
      </>
    );
  }

  renderSSBaseStructure() {
    //for tabs - https://github.com/reactjs/react-tabs
    //https://reactcommunity.org/react-tabs/

    return (
      <>
        <div className="gsearch-container">
          <div className="gsearch-container-inner">
            <h2>
              Welcome to Sonic Hub.
              <br />
              <span>Pick a tag!</span>
            </h2>
            <div className="gsearchBubbleDiv mtop20">
              <div className="clearfix"></div>
              <div className="clearfix"></div>

              <Tabs
                selectedTabClassName="divSelect"
                onSelect={(index) => {
                  currenTab = index;
                  console.log(index);
                  if (selfThis.childRef.current !== null)
                    selfThis.childRef.current.updateMasonary();
                }}
              >
                <div className="tabs">
                  <TabList className="tab-header gsearch-tabrow">
                    <Tab key="th_1" className="gsearch-tabcol">
                      <span className="gsearch-tabbtn ">Tonality</span>
                    </Tab>
                    <Tab key="th_2" className="gsearch-tabcol">
                      <span className="gsearch-tabbtn ">Genre</span>
                    </Tab>
                    <Tab key="th_3" className="gsearch-tabcol">
                      <span className="gsearch-tabbtn ">Moods</span>
                    </Tab>
                  </TabList>
                </div>
                <div className="tab-content">
                  <TabPanel
                    key="tc_1"
                    forceRender={true}
                    className="tab-child"
                    selectedClassName="showTabPanel"
                  >
                    {/* <RefinementList attribute="tag_tonality" operator="and" />  */}
                    {/* <SuperSearchFilter ssFilterTag="tag_tonality" operator="and" key="ss_tonality" /> */}
                    <SSCustomRefinementBubbles
                      attribute="tag_tonality"
                      ssFilterTag="tag_tonality"
                      operator="and"
                      key="ss_tonality"
                      limit={100}
                      ssBaseRef={selfThis.childRef}
                      currenTab={currenTab}
                      ref={this.child}
                    />
                  </TabPanel>
                  <TabPanel
                    key="tc_2"
                    forceRender={true}
                    className="tab-child"
                    selectedClassName="showTabPanel"
                  >
                    {/* <RefinementList attribute="tag_genre" operator="and" />  */}
                    {/* <SuperSearchFilter ssFilterTag="tag_genre" operator="and" key="ss_genre" /> */}
                    <SSCustomRefinementBubbles
                      attribute="tag_genre"
                      ssFilterTag="tag_genre"
                      operator="and"
                      key="ss_genre"
                      limit={100}
                      ssBaseRef={selfThis.childRef}
                      currenTab={currenTab}
                    />
                  </TabPanel>
                  <TabPanel
                    key="tc_3"
                    forceRender={true}
                    className="tab-child"
                    selectedClassName="showTabPanel"
                  >
                    {/* <RefinementList attribute="tag_feelings" operator="and" />   */}
                    {/* <SuperSearchFilter ssFilterTag="tag_feelings" operator="and" key="ss_feelings" /> */}
                    <SSCustomRefinementBubbles
                      attribute="tag_feelings"
                      ssFilterTag="tag_feelings"
                      operator="and"
                      key="ss_feelings"
                      limit={100}
                      ssBaseRef={selfThis.childRef}
                      currenTab={currenTab}
                    />
                  </TabPanel>
                </div>
              </Tabs>
              <div className="clearfix"></div>
              {/* <CurrentRefinements key="SSrefinelist" /> */}
              <SSCustomCurrentRefinements
                // attribute="tag_all"
                ssBaseRef={selfThis.childRef}
              />

              {/* <SSCustomClearRefinements ssBaseRef={selfThis.childRef} /> */}

              <div className="clearfix"></div>

              <SSCustomInfiniteHits key="sscinhit" />

              <div className="mtop20">
                {/* <Tabs>
                                    <TabPanel name="Tonality" key="1">
                                        <div className="mtop20">
                                            <div className="gsearch-bubble-container">
                                                <button className="gsearch-bubble-prev"></button>
                                                <div className="gsearch-bubble-ui">
                                                    {// <SearchFilterSet /> 
                                                    }
                                                    <SuperSearchFilter ssFilterTag="tag_tonality" operator="and" key="ss_tonality" />

                                                </div>
                                                <button className="gsearch-bubble-next"></button>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel name="Genre" key="2">
                                        <div className="mtop20">
                                            <div className="gsearch-bubble-container">
                                                <button className="gsearch-bubble-prev"></button>
                                                <div className="gsearch-bubble-ui">
                                                    {// <SearchFilterSet />
                                                    }
                                                    <SuperSearchFilter ssFilterTag="tag_genre" operator="and" key="ss_genre" />

                                                </div>
                                                <button className="gsearch-bubble-next"></button>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel name="Mood" key="3">
                                        <div className="mtop20">
                                            <div className="gsearch-bubble-container">
                                                <button className="gsearch-bubble-prev"></button>
                                                <div className="gsearch-bubble-ui">
                                                    {// <SearchFilterSet /> 
                                                    }
                                                    <SuperSearchFilter ssFilterTag="tag_feelings" operator="and" key="ss_feelings" />
                                                </div>
                                                <button className="gsearch-bubble-next"></button>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </TabPanel>
                                </Tabs> */}

                <div className="clearfix"></div>
              </div>

              <div className="clearfix"></div>

              <div className="clearfix"></div>
            </div>

            <div className="clearfix"></div>

            <div className="clearfix"></div>

            <div className="mtop20">
              <div className="gsearchTracksTag_L">
                <div className="divFlex gsearchTracksTagsDiv">
                  <div className="divPosRBorder">
                    <span className="iconSpotifyActive"></span>
                    <input
                      type="text"
                      placeholder="Search Spotify Tracks..."
                      name=""
                      id=""
                      className="inputGSearch inputTracksGSearch"
                    />
                    <span className="iconRemoveInputVal"></span>
                    <div className="clearfix"></div>
                  </div>
                  <div className="clearfix"></div>
                  {/* <div className="st-similar-autosearch spotify">
                                        <SpotifySearch2 fetchSimilarFromSpotify={this.fetchSimilarFromSpotify} />
                                    </div> */}
                  <button className="btnApplyActive">Apply</button>
                  <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="gsearchTracksTag_R">
                <div className="divFlex gsearchTracksTagsDiv">
                  <div className="divPosRBorder">
                    <span className="iconTagActive"></span>
                    <input
                      type="text"
                      placeholder="Search for tags..."
                      name=""
                      id=""
                      className="inputGSearch inputTagsGSearch"
                    />
                    <span className="iconRemoveInputVal"></span>
                    <div className="clearfix"></div>
                  </div>
                  <button className="btnApplyActive">Apply</button>
                  <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="clearfix"></div>
            </div>

            <div className="clearfix"></div>
          </div>

          <div className="clearfix">&nbsp;</div>
        </div>
      </>
    );
  }

  render() {
    const { isOpen } = this.props;

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div className="SearchPageTS__container">
            {this.renderNavBar()}
            <div className="SS_SearchPageTS__ContentWrapper">
              {/* this.renderTitleSection(config) */}
              {this.renderSSBaseStructure()}
              {this.renderFooter()}
            </div>
          </div>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => ({
  query: state.search,
  isOpen: state.search.isOpen,
});

export default connect(mapStateToProps, null)(SuperSearchBase2);
