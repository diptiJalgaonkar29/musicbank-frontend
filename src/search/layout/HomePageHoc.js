import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Element } from 'react-scroll';
import { BrandingContext } from '../../branding/provider/BrandingContext';
import HomePageFooter from '../../common/components/Footer/HomePageFooter';
import NavBar from '../../common/components/Navbar/NavBar';
import ScrollDownButton from '../../common/components/scrollDownButton/scrollDownButton';
import '../../_styles/HomePageHocNew.css';
import LatestTracks from '../components/Latesttracks/LatestTracks';
import SearchBarWithTitleText from '../components/Searchbar/SearchBar';
import HomePageBackgroundContainer from './HomePageBackgroundContainer';



class HomePageHoc extends Component {
  renderLastAddedTracksSection() {        
    return (
      <Element
        className="SearchPage__lastAdded-section-wrapper"
        id="lastAdded"
        element="lastAdded"
      >
        <LatestTracks />
        <HomePageFooter />
      </Element>
    );
  }

  renderHeader() {
    return (
      <nav className="SearchPage__navigation">
        <NavBar />
      </nav>
    );
  }

  renderPageContent() {
    return (
      <div className="SearchPage__searchSection">
        <SearchBarWithTitleText searchedForProp={this.props.query} />
        <ScrollDownButton />
      </div>
    );
  }

  render() {
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div className="SearchPage__container">
            <HomePageBackgroundContainer config={config}>
              {this.renderHeader()}
              {this.renderPageContent()}
            </HomePageBackgroundContainer>
            {this.renderLastAddedTracksSection()}
          </div>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const mapStateToProps = state => ({
  query: state.search
});

export default connect(
  mapStateToProps,
  null
)(HomePageHoc);
