import React, {Component} from 'react';
import '../../../_styles/ScrollDownButton.css';
import {scroller} from 'react-scroll';

class ScrollDownButton extends Component {
  scrollDown() {
    scroller.scrollTo('lastAdded', {
      duration: 650,
      offset: 0,
      smooth: 'easeInOutQuart'
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="scrollDown" onClick={this.scrollDown}>
          <span/>
        </div>
      </React.Fragment>
    );
  }
}

export default ScrollDownButton;
