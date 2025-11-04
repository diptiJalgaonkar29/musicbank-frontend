import withStyles from "@mui/styles/withStyles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrandingContext } from "../../branding/provider/BrandingContext";

import NavBar from "../../common/components/Navbar/NavBar";

const styles = () => ({
  wrapper: {
    display: "block",
    width: "90%",
    margin: "auto",
    paddingTop: "20px",
  },
  voice_left: {
    display: "block",
    width: "28%",
    float: "left",
  },
  voice_right: {
    display: "block",
    width: "70%",
    float: "right",
  },
  login_right_img: {
    width: "90%",
    maxWidth: "600px",
  },
});

class VoicePage extends Component {
  constructor(props) {
    super(props);
  }
  state = {};

  render() {
    const { classes, tracksCart } = this.props;
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div>
            <div className="voicePage__container">
              <div className="voicePage__navbar">
                <NavBar />
              </div>
              <div
                className={classes.wrapper}
                style={{ color: "var(--color-white)" }}
              >
                <h4></h4>
                {console.log("cart", tracksCart)}
                {tracksCart.map((tracks, i) => {
                  return (
                    <div>
                      <p>{tracks[1]}</p>
                      <p>{tracks[2]}</p>
                      <p>{tracks[3]}</p>
                      <p>{tracks[4]}</p>
                      <p>{tracks[5]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => {
  return { tracksCart: state.tracksCart };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(VoicePage));
