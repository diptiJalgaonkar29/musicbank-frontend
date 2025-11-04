import React from "react";
import "../_styles/SearchResultsPageHoc.css";
import "../components/Trackcard/TrackCard.css";
import { ResponsiveTabletViewCondition768 } from "../../common/utils/ResponsiveTabletViewCondition";

const SearchResultsPageHoc = (props) => {
  return (
    <div
      className={
        ResponsiveTabletViewCondition768()
          ? "searchResuts__container__mobile"
          : "searchResuts__container"
      }
    >
      {/* <div className="searchResuts__navbar__grid">
        <NavBar />
      </div> */}
      {props.children}
    </div>
  );
};

export default SearchResultsPageHoc;
