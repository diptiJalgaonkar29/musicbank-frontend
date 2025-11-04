import React, { memo } from "react";
import { FormattedMessage } from "react-intl";
import "./HomePageV3Header.css";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../../static/search2.0.svg";
import SmartInputBox from "../../../common/components/SmartInputBox/SmartInputBox";
import { ReactComponent as SimilaritySearch } from "../../../static/SonicSimilaritySearch.svg";
const HomePageV3Header = () => {
  const navigate = useNavigate();
  const AISearchButtons = memo(({ navigate }) => (
    <div className="AISearchButtons">
      <button
        className="toggleBtn selectedBtn"
        onClick={() => navigate("/AISearchScreen", { state: { type: "ai" } })}
      >
        <SearchIcon className="SearchIcon" />
        <span>AI Search</span>
      </button>
      <button
        className="toggleBtn"
        onClick={() =>
          navigate("/AISearchScreen", { state: { type: "similarity" } })
        }
      >
        <SimilaritySearch className="SimilarityIcon" />
        <span>Similarity Search</span>
      </button>
    </div>
  ));
  return (
    <div className="HomePageV3Header_container">
      <div className="HomePageV3Header_top" style={{ display: "flex" }}>
        <AISearchButtons navigate={navigate} />

        <div
          className="HomePageV3Header_left"
          style={{ textAlign: "right", width: "100%" }}
        >
          <p className="homePageV3_title">
            <span>
              <FormattedMessage id="home.page.titleSubtext" />
            </span>
            <span className="highlight">
              <FormattedMessage
                id="home.page.titleSubtextHighlight"
                className="homePageV3-titleSubHighlight"
              />
            </span>
          </p>
        </div>
      </div>
      <div className="HomePageSmartInputBox">
        <SmartInputBox
          placeholder="Search tracks by name, artist, genre, or vibe (e.g., 'chill jazz')"
          rightButtons={[]}
          value=""
          onChange={() => {}}
          homePage={true}
          onUserInteract={() =>
            navigate("/AISearchScreen", { state: { type: "ai" } })
          }
        />
      </div>
    </div>
  );
};
export default HomePageV3Header;
