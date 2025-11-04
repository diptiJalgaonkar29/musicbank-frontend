import React from 'react';
import { isMobile } from 'react-device-detect';
import NavBar from '../../common/components/Navbar/NavBar';
import '../../_styles/SearchResultsPageHoc.css';
import '../../_styles/TrackCard.css';

const SearchResultsPageHoc = props => {
  return (
    <div
      className={
        isMobile
          ? 'searchResuts__container__mobile'
          : 'searchResuts__container'
      }
    >
      <div className="searchResuts__navbar__grid">
        <NavBar />
      </div>
      {props.children}
    </div>
  );
};

export default SearchResultsPageHoc;
