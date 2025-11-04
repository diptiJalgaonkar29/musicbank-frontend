import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { clearSearchState } from '../../../redux/actions/searchActions';

import HomePageHoc from '../../layout/HomePageHoc';

class HomePage extends Component {
  componentDidMount() {
    this.props.clearSearchState();
  }

  render() {
    return (
      <Fragment>
        <HomePageHoc />
      </Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearSearchState: () => dispatch(clearSearchState()),
  };
};

export default connect(null, mapDispatchToProps)(HomePage);
