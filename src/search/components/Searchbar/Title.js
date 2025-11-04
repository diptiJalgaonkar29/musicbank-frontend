import React from 'react';
import { FormattedMessage } from 'react-intl';
import '../../../_styles/Theming/__TYPOGRAPHY.css';

export const TitleHomepage = () => {
  return (
    <h3 className="main-title-tsp">
      <FormattedMessage id="home.page.titleMain" />
      <br />
      <span className="main-subtitle" name="scroll-to-point-search-mobile">
        <FormattedMessage id="home.page.titleSub" />
      </span>
    </h3>
  );
};

export const TitleNewSearch = () => {
  return (
    <h3 className="heading--3">
      <FormattedMessage id="results.newSearch.title" />
    </h3>
  );
};
