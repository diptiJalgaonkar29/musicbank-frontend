import React, { Component } from 'react';
import { PRIVACY_POLICY } from '../../document/constants/constants';
import { CookieStatementContent } from '../templates/cookie-statement';
import './Imprint.css';
import withNavigation from './ImprintHOC';

class PrivacyPolicy extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return <CookieStatementContent />;
  }
}

export default withNavigation(PrivacyPolicy, PRIVACY_POLICY);
