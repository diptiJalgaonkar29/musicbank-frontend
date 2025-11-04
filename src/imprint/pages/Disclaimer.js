import React, { Component } from 'react';
import { DISCLAIMER } from '../../document/constants/constants';
import { DisclaimerContent } from '../templates/disclaimer';
import './Imprint.css';
import withNavigation from './ImprintHOC';


class Impressum extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return <DisclaimerContent />;
  }
}

export default withNavigation(Impressum, DISCLAIMER);
