import React, { Component, useEffect, useMemo, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import "../../_styles/HomePageHocNew.css";
import "../../_styles/Theming/__TYPOGRAPHY.css";
import { setRefinementItem } from "../../redux/actions/searchActions/index";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "../SuperSearchStyle11.css";
import SpotifySearch3 from "../../cyanite/components/SpotifySearch3";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import useTabWrapper from "../../branding/componentWrapper/TabWrapper/Hooks/useTabWrapper";
import TabHeaderWrapper from "../../branding/componentWrapper/TabWrapper/TabHeaderWrapper";
import TabHeaderItemWrapper from "../../branding/componentWrapper/TabWrapper/TabHeaderItemWrapper";
import SSCustomRefinementBubbles11DB from "../components/SSCustomRefinementBubbles11DB";
import AsyncService from "../../networking/services/AsyncService";
import ChipWrapper from "../../branding/componentWrapper/ChipWrapper";
import {
  resetSuperSearchTrackFilters,
  setSuperSearchTrackFilters,
  updateSuperSearchTrackFilters,
} from "../../redux/actions/trackFilterActions/trackFilterActions";
import _ from "lodash";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { withRouterCompat } from "../../common/utils/withRouterCompat";


var selfThis;
var currenTab = "";
var tagSetArr = [];
var clearedOnce = false;

const refineLabels = {
  tag_amp_mainmood: "Moods",
  tag_amp_mainmood_ids: "Moods",
  tag_genre: "Genre",
  tag_tempo: "Tempo",
  tag_soniclogo_mainmood: "Moods",
  tag_soniclogo_mainmood_ids: "Moods",
};

const groupDataByAttribute = (data) => {
  return data.reduce((acc, item) => {
    if (!acc[item.attribute]) {
      acc[item.attribute] = [];
    }
    acc[item.attribute].push(item);
    return acc;
  }, {});
};

const RenderTaxonomySSBaseStructure = withRouterCompat(
  ({ selfThis, config, navigate }) => {
    const [isSSToggleChecked, setIsSSToggleChecked] = useState(false);
    const [SSData, setSSData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { superSearchTrackFilters: trackFilters } = useSelector(
      (state) => state.trackFilters
    );
    const dispatch = useDispatch();

    const filterItemsMemo = useMemo(() => trackFilters, [trackFilters]);

    const removeFilteredTag = (attribute, value) => {
      if (attribute === "tempo") {
        dispatch(setSuperSearchTrackFilters({ tempo: [] }));
        return;
      }
      const updatedArray = _.filter(
        trackFilters[attribute],
        (x) => x.value !== value
      );
      dispatch(setSuperSearchTrackFilters({ [attribute]: updatedArray }));
    };

    const filteredTags = useMemo(() => {
      let formattedData = _(trackFilters)
        ?.map((values, attribute) =>
          values?.map((tag) => ({ attribute, ...tag }))
        )
        ?.flatten()
        .value();
      return formattedData;
    }, [trackFilters]);

    const getSSData = async () => {
      const formData = new FormData();
      if (trackFilters?.tag_tempo?.length > 0) {
        formData.append("tag_tempo", trackFilters?.tag_tempo?.[0]?.value);
      }
      if (trackFilters?.tag_amp_mainmood_ids?.length > 0) {
        formData.append(
          "tag_amp_mainmood_ids",
          JSON.stringify(
            trackFilters?.tag_amp_mainmood_ids?.map((x) => x.value)
          )
        );
      }
      if (trackFilters?.tag_genre?.length > 0) {
        formData.append(
          "tag_genre",
          JSON.stringify(trackFilters?.tag_genre?.map((x) => x.value))
        );
      }
      try {
        let SSMeta = await AsyncService.postFormData(
          `/trackMeta/superSearch`,
          formData
        );
        // console.log("SSMeta", SSMeta);
        setSSData(SSMeta?.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      getSSData();
    }, [filterItemsMemo]);

    //for tabs - https://github.com/reactjs/react-tabs
    //https://reactcommunity.org/react-tabs/
    const { value, handleChange } = useTabWrapper();

    const groupedData = groupDataByAttribute(filteredTags);

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
                      <SSCustomRefinementBubbles11DB
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
                      <SSCustomRefinementBubbles11DB
                        attribute="tag_amp_mainmood_ids"
                        allTags={SSData?.amp_main_mood_tag_master}
                        filteredTags={filteredTags}
                      />
                    </div>
                    <div style={{ display: value === 1 ? "block" : "none" }}>
                      <SSCustomRefinementBubbles11DB
                        attribute="tag_genre"
                        allTags={SSData?.GenreList}
                        filteredTags={filteredTags}
                      />
                    </div>
                    <div style={{ display: value === 2 ? "block" : "none" }}>
                      <SSCustomRefinementBubbles11DB
                        attribute="tag_tempo"
                        allTags={SSData?.tag_tempo}
                        filteredTags={filteredTags}
                      />
                    </div>
                  </>
                </>
              )}
              <div className="clearfix"></div>
              <div className="supersearchfilteredTagsBlock">
                {filteredTags?.length > 0 && (
                  <div className="supersearch_filteredTags_container">
                    {Object.entries(groupedData)?.map(([attribute, data]) => (
                      <>
                        <span className="supersearch_filteredTags_title">
                          {refineLabels[attribute]}:
                        </span>
                        {data?.map(({ label, value }) => (
                          <>
                            <ChipWrapper
                              key={label}
                              label={label}
                              className={`${attribute}`}
                              onClose={() => {
                                removeFilteredTag(attribute, value);
                              }}
                            />
                          </>
                        ))}
                      </>
                    ))}
                    <button
                      onClick={() => {
                        dispatch(resetSuperSearchTrackFilters());
                      }}
                      className="supersearch_clear_all_filters_btn"
                    >
                      <ChipWrapper
                        label={"Clear All"}
                        className="supersearch_clear_all_filters_btn_chip"
                      />
                    </button>
                  </div>
                )}
                <ButtonWrapper
                  onClick={() => {
                    dispatch(updateSuperSearchTrackFilters());
                    setTimeout(() => {
                      navigate("/search_results");
                    }, 150);
                  }}
                >
                  Search ({SSData?.total || 0})
                </ButtonWrapper>
              </div>
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
  }
);

const RenderSSBaseStructure = ({ selfThis, config }) => {
  //for tabs - https://github.com/reactjs/react-tabs
  //https://reactcommunity.org/react-tabs/

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
                  <SSCustomRefinementBubbles11DB
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
                  <SSCustomRefinementBubbles11DB
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
                  <SSCustomRefinementBubbles11DB
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

class SuperSearchPageV2DB extends Component {
  constructor(props) {
    super(props);
    // console.log("SuperSearchPageV2DB called");
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuperSearchPageV2DB);
