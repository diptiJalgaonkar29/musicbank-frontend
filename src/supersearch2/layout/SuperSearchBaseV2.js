import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import "../../_styles/HomePageHocNew.css";
import "../../_styles/Theming/__TYPOGRAPHY.css";
import { SSCustomRefinementBubbles } from "../components/SSCustomRefinementBubbles11";
import { SSCustomCurrentRefinements } from "../components/SSCustomCurrentRefinements";
//import { CustomToggleRefinement } from "../components/SSToggleRefinement";

import { setRefinementItem } from "../../redux/actions/searchActions/index";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "../SuperSearchStyle11.css";
import SpotifySearch3 from "../../cyanite/components/SpotifySearch3";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import useTabWrapper from "../../branding/componentWrapper/TabWrapper/Hooks/useTabWrapper";
import TabHeaderWrapper from "../../branding/componentWrapper/TabWrapper/TabHeaderWrapper";
import TabHeaderItemWrapper from "../../branding/componentWrapper/TabWrapper/TabHeaderItemWrapper";

const algoliasearch = require("algoliasearch");

var selfThis;
var currenTab = "";
var tagSetArr = [];
var clearedOnce = false;

const RenderTaxonomySSBaseStructure = ({ selfThis, config }) => {
  const [isSSToggleChecked, setIsSSToggleChecked] = useState(false);

  //for tabs - https://github.com/reactjs/react-tabs
  //https://reactcommunity.org/react-tabs/
  const { value, handleChange } = useTabWrapper();
  return (
    <>
      <div className="gsearch-container taxonomy-gsearch-container">
        <div className="gsearch-container-inner">
          <div className="search_rp">
            {config.modules.SpotifySearchBox && (
              <SpotifySearch3 fromSS={true} />
            )}
            {/* <SSToggle
              isSSToggleChecked={isSSToggleChecked}
              setIsSSToggleChecked={setIsSSToggleChecked}
            /> */}
            {/* <div style={{ display: "none" }}>
              <ToggleRefinement
                attribute="trackStatus"
                label="trackStatus"
                value={true}
                defaultRefinement={true}
              />
            </div> */}
          </div>
          <div className="title_lp">
            <div className="supersearchTitleBlock">
              <span
                className="main-subtitle boldFamily"
                name="scroll-to-point-search-mobile"
              >
                <FormattedMessage id="supersearch.page.titleSubtextHighlight" />
              </span>
              <span
                className="main-subtitle-subtext"
                name="scroll-to-point-search-mobile"
              >
                <FormattedMessage
                  id="supersearch.page.titleSubtextSmall"
                  className="titleSubHighlight"
                />
              </span>
            </div>
          </div>
          <div className="gsearchBubbleDiv mtop20">
            <div className="clearfix"></div>
            <div className="clearfix"></div>
            {isSSToggleChecked ? (
              <Tabs>
                <div className="tabs">
                  <TabList className="tab-header gsearch-tabrow">
                    <Tab
                      key="th_1"
                      className="gsearch-tabcol sonic-logo-tab"
                      selectedClassName="divSelect ss-activeTab-tag_mood"
                    >
                      <span className="gsearch-tabbtn">Moods</span>
                    </Tab>
                  </TabList>
                </div>
                <div className={`tab-content`}>
                  <TabPanel
                    key="tc_1"
                    forceRender={true}
                    className="tab-child"
                    selectedClassName="showTabPanel"
                  >
                    <SSCustomRefinementBubbles
                      attribute="tag_soniclogo_mainmood_ids"
                      ssFilterTag="tag_soniclogo_mainmood_ids"
                      operator="and"
                      key="ss_sonic_logo_mood"
                      limit={100}
                      ssBaseRef={selfThis.childRef}
                      currenTab={currenTab}
                      allTags={tagSetArr?.tag_soniclogo_mainmood_ids}
                    />
                  </TabPanel>
                </div>
              </Tabs>
            ) : (
              <>
                <>
                  <TabHeaderWrapper value={value} onChange={handleChange}>
                    <TabHeaderItemWrapper label="Moods" index={0} />
                    <TabHeaderItemWrapper label="Genre" index={1} />
                    <TabHeaderItemWrapper label="Tempo" index={2} />
                  </TabHeaderWrapper>
                  <div style={{ display: value === 0 ? "block" : "none" }}>
                    <SSCustomRefinementBubbles
                      attribute="tag_amp_mainmood_ids"
                      ssFilterTag="tag_amp_mainmood_ids"
                      operator="and"
                      key="ss_mood"
                      limit={100}
                      ssBaseRef={selfThis.childRef}
                      currenTab={currenTab}
                      allTags={tagSetArr?.tag_amp_mainmood_ids}
                    />
                  </div>
                  <div style={{ display: value === 1 ? "block" : "none" }}>
                    <SSCustomRefinementBubbles
                      attribute="tag_genre"
                      ssFilterTag="tag_genre"
                      operator="and"
                      key="ss_genre"
                      limit={100}
                      ssBaseRef={selfThis.childRef}
                      currenTab={currenTab}
                      allTags={tagSetArr?.tag_genre}
                    />
                  </div>
                  <div style={{ display: value === 2 ? "block" : "none" }}>
                    <SSCustomRefinementBubbles
                      attribute="tag_tempo"
                      ssFilterTag="tag_tempo"
                      operator="and"
                      key="ss_tempo"
                      limit={100}
                      ssBaseRef={selfThis.childRef}
                      currenTab={currenTab}
                      allTags={tagSetArr?.tag_tempo}
                    />
                  </div>
                </>
                {/* <Tabs
                  onSelect={(index, lastIndex, event) => {
                    currenTab = index;
                    let tabContainerElement =
                      document.getElementsByClassName("react-tabs")?.[0];
                    if (tabContainerElement) {
                      tabContainerElement.classList.remove(
                        `ss-active-index-${lastIndex}`
                      );
                      tabContainerElement.classList.add(
                        `ss-active-index-${index}`
                      );
                    }
                    if (selfThis.childRef.current !== null)
                      selfThis.childRef.current.updateMasonary();
                  }}
                >
                  <div className="tabs">
                    <TabList className="tab-header gsearch-tabrow">
                      <Tab
                        key="th_1"
                        className="gsearch-tabcol"
                        selectedClassName="divSelect ss-activeTab-tag_mood"
                      >
                        <span className="gsearch-tabbtn">Moods</span>
                      </Tab>
                      <Tab
                        key="th_2"
                        className="gsearch-tabcol"
                        selectedClassName="divSelect ss-activeTab-tag_genre"
                      >
                        <span className="gsearch-tabbtn">Genre</span>
                      </Tab>
                      <Tab
                        key="th_3"
                        className="gsearch-tabcol"
                        selectedClassName="divSelect ss-activeTab-tag_tempo"
                      >
                        <span className="gsearch-tabbtn">Tempo</span>
                      </Tab>
                    </TabList>
                  </div>
                  <div className={`tab-content`}>
                    <TabPanel
                      key="tc_1"
                      forceRender={true}
                      className="tab-child"
                      selectedClassName="showTabPanel"
                    >
                      <SSCustomRefinementBubbles
                        attribute="tag_amp_mainmood_ids"
                        ssFilterTag="tag_amp_mainmood_ids"
                        operator="and"
                        key="ss_mood"
                        limit={100}
                        ssBaseRef={selfThis.childRef}
                        currenTab={currenTab}
                        allTags={tagSetArr?.tag_amp_mainmood_ids}
                      />
                    </TabPanel>
                    <TabPanel
                      key="tc_2"
                      forceRender={true}
                      className="tab-child"
                      selectedClassName="showTabPanel"
                    >
                      <SSCustomRefinementBubbles
                        attribute="tag_genre"
                        ssFilterTag="tag_genre"
                        operator="and"
                        key="ss_genre"
                        limit={100}
                        ssBaseRef={selfThis.childRef}
                        currenTab={currenTab}
                        allTags={tagSetArr?.tag_genre}
                      />
                    </TabPanel>
                    <TabPanel
                      key="tc_3"
                      forceRender={true}
                      className="tab-child"
                      selectedClassName="showTabPanel"
                    >
                      <SSCustomRefinementBubbles
                        attribute="tag_tempo"
                        ssFilterTag="tag_tempo"
                        operator="and"
                        key="ss_tempo"
                        limit={100}
                        ssBaseRef={selfThis.childRef}
                        currenTab={currenTab}
                        allTags={tagSetArr?.tag_tempo}
                      />
                    </TabPanel>
                  </div>
                </Tabs> */}
              </>
            )}
            <div className="clearfix"></div>
            <SSCustomCurrentRefinements ssBaseRef={selfThis.childRef} />
            <div className="clearfix"></div>
            <div className="mtop20">
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix">&nbsp;</div>
      </div>
    </>
  );
};

const RenderSSBaseStructure = ({ selfThis, config }) => {
  //for tabs - https://github.com/reactjs/react-tabs
  //https://reactcommunity.org/react-tabs/

  // useEffect(() => {
  //   const tagClient = algoliasearch(
  //     getAlogilaMeta()?.appID,
  //     getAlogilaMeta()?.token
  //   );
  //   const tagIndex = tagClient.initIndex(getAlogilaMeta()?.index);

  //   if (tagSetArr.length == 0) {
  //     tagIndex
  //       .search("", {
  //         //facets: [*],
  //         facets: ["tag_tonality", "tag_feelings", "tag_genre"],
  //       })
  //       .then((res) => {
  //         console.log("facetres789789", res.facets);
  //         tagSetArr = res.facets;
  //         trackExternalAPICalls({
  //           url: "",
  //           requestData: JSON.stringify({
  //             facets: ["tag_tonality", "tag_feelings", "tag_genre"],
  //           }),
  //           usedFor: "search",
  //           serviceBy: "Algolia",
  //           statusCode: 200,
  //           statusMessage: "",
  //         });
  //       })
  //       .catch((error) => {
  //         console.log("error searching tag index", error);
  //         trackExternalAPICalls({
  //           url: "",
  //           requestData: JSON.stringify({
  //             facets: ["tag_tonality", "tag_feelings", "tag_genre"],
  //           }),
  //           usedFor: "search",
  //           serviceBy: "Algolia",
  //           statusCode: 400,
  //           statusMessage: error,
  //         });
  //       });
  //   }
  // }, []);

  return (
    <>
      <div className="gsearch-container">
        <div className="gsearch-container-inner">
          {config.modules.SpotifySearchBox && (
            <div className="search_rp">
              <SpotifySearch3 fromSS={true} />
            </div>
          )}
          <div className="title_lp">
            <div className="supersearchTitleBlock">
              <span
                className="main-subtitle"
                name="scroll-to-point-search-mobile"
              >
                <FormattedMessage id="supersearch.page.titleSubtext" />
              </span>
              <span
                className="main-subtitle-Highlight"
                name="scroll-to-point-search-mobile"
              >
                <FormattedMessage
                  id="supersearch.page.titleSubtextHighlight"
                  className="titleSubHighlight"
                />
              </span>
              <span className="main-subtitle">.</span>
              <span
                className="main-subtitle-subtext"
                name="scroll-to-point-search-mobile"
              >
                <FormattedMessage
                  id="supersearch.page.titleSubtextSmall"
                  className="titleSubHighlight"
                />
              </span>
            </div>
          </div>
          <div className="gsearchBubbleDiv mtop20">
            <div className="clearfix"></div>
            <div className="clearfix"></div>

            <Tabs
              onSelect={(index, lastIndex, event) => {
                currenTab = index;
                let tabContainerElement =
                  document.getElementsByClassName("react-tabs")?.[0];
                if (tabContainerElement) {
                  tabContainerElement.classList.remove(
                    `ss-active-index-${lastIndex}`
                  );
                  tabContainerElement.classList.add(`ss-active-index-${index}`);
                }
                if (selfThis.childRef.current !== null)
                  selfThis.childRef.current.updateMasonary();
              }}
            >
              <div className="tabs">
                <TabList className="tab-header gsearch-tabrow">
                  <Tab
                    key="th_1"
                    className="gsearch-tabcol"
                    selectedClassName="divSelect ss-activeTab-tag_tonality"
                  >
                    <span className="gsearch-tabbtn ">Tonality</span>
                  </Tab>
                  <Tab
                    key="th_2"
                    className="gsearch-tabcol"
                    selectedClassName="divSelect ss-activeTab-tag_genre"
                  >
                    <span className="gsearch-tabbtn ">Genre</span>
                  </Tab>
                  <Tab
                    key="th_3"
                    className="gsearch-tabcol"
                    selectedClassName="divSelect ss-activeTab-tag_feelings"
                  >
                    <span className="gsearch-tabbtn ">Moods</span>
                  </Tab>
                </TabList>
              </div>
              <div className={`tab-content`}>
                <TabPanel
                  key="tc_1"
                  forceRender={true}
                  className="tab-child"
                  selectedClassName="showTabPanel"
                >
                  <SSCustomRefinementBubbles
                    attribute="tag_tonality"
                    ssFilterTag="tag_tonality"
                    operator="and"
                    key="ss_tonality"
                    limit={100}
                    ssBaseRef={selfThis.childRef}
                    currenTab={currenTab}
                    allTags={tagSetArr?.tag_tonality}
                  />
                </TabPanel>
                <TabPanel
                  key="tc_2"
                  forceRender={true}
                  className="tab-child"
                  selectedClassName="showTabPanel"
                >
                  <SSCustomRefinementBubbles
                    attribute="tag_genre"
                    ssFilterTag="tag_genre"
                    operator="and"
                    key="ss_genre"
                    limit={100}
                    ssBaseRef={selfThis.childRef}
                    currenTab={currenTab}
                    allTags={tagSetArr?.tag_genre}
                  />
                </TabPanel>
                <TabPanel
                  key="tc_3"
                  forceRender={true}
                  className="tab-child"
                  selectedClassName="showTabPanel"
                >
                  <SSCustomRefinementBubbles
                    attribute="tag_feelings"
                    ssFilterTag="tag_feelings"
                    operator="and"
                    key="ss_feelings"
                    limit={100}
                    ssBaseRef={selfThis.childRef}
                    currenTab={currenTab}
                    allTags={tagSetArr?.tag_feelings}
                  />
                </TabPanel>
              </div>
            </Tabs>
            <div className="clearfix"></div>
            <SSCustomCurrentRefinements
              // attribute="tag_all"
              ssBaseRef={selfThis.childRef}
              //clearsQuery={true}
            />
            {/* <SSCustomClearRefinements id="baseClearTags" ssBaseRef={selfThis.childRef} /> */}

            <div className="clearfix"></div>
            {/* <SSCustomInfiniteHits key="sscinhit" />  */}
            <div className="mtop20">
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>

          <div className="clearfix"></div>
        </div>

        <div className="clearfix">&nbsp;</div>
      </div>
    </>
  );
};

class SuperSearchBaseV2 extends Component {
  constructor(props) {
    super(props);
    selfThis = this;
    //this.clearedOnce = false
    this.childRef = React.createRef();
  }

  clearAllTagsOnce() {
    // console.log("clearAllTagsOnce");
    try {
      if (document.getElementsByClassName("gsTagClearAll").length > 0) {
        if (tagSetArr.length > 0 && clearedOnce) {
          document.getElementsByClassName("gsTagClearAll")[0].click();
          clearedOnce = true;
        }
      }
    } catch (error) {}
  }

  componentWillMount() {
    // console.log("clearAllTagsOnce - componentWillMount -localStorage");
    //localStorage.removeItem("persist:root");
  }

  componentDidMount() {
    // console.log("clearAll - chk - componentDidMount", clearedOnce);
    //localStorage.removeItem("persist:root");
  }

  componentWillUpdate() {
    // console.log("clearAll - chk - componentWillUpdate", clearedOnce);
  }

  shouldComponentUpdate() {
    // console.log("clearAll - chk - shouldComponentUpdate", clearedOnce);
  }

  componentDidUpdate() {
    // console.log(
    //   "clearAll - chk - componentDidUpdate",
    //   clearedOnce,
    //   selfThis.childRef.current.clearedOnce
    // );
  }

  handleCallback = (track_name, artist_name, track_image, search_type) => {
    this.setState({
      SpotifyTrackName: track_name,
      SpotifyTrackArtist: artist_name,
      SpotifyTrackImage: track_image,
      SpotifyTrackType: search_type,
    });
  };

  render() {
    const { isOpen } = this.props;

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <MainLayout>
            <div
              className="SearchPageTS__container"
              id="SuperSearchPageTS__container"
            >
              <div className="SS_SearchPageTS__ContentWrapper">
                {process.env.REACT_APP_TAXONOMY_ALGOLIA_COMMON_SERVER ? (
                  <RenderTaxonomySSBaseStructure
                    selfThis={selfThis}
                    config={config}
                  />
                ) : (
                  <RenderSSBaseStructure selfThis={selfThis} config={config} />
                )}
              </div>
            </div>
          </MainLayout>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRefinementItem: (refinementArray) =>
      dispatch(setRefinementItem(refinementArray)),
  };
};

const mapStateToProps = (state) => ({
  query: state.search,
  isOpen: state.search.isOpen,
});

export default connect(mapStateToProps, mapDispatchToProps)(SuperSearchBaseV2);
