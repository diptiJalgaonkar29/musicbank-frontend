import React, { Component } from "react";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import "../../_styles/Fallback.css";
import NavBar from "../components/Navbar/NavBar";
import { SpinnerDefault } from "../components/Spinner/Spinner";

export default class FallBackPage extends Component {
  renderHeader() {
    return (
      <div className="fallback__navbar">
        <NavBar />
      </div>
    );
  }

  renderBody() {
    return (
      <div className="fallback_body">
        <SpinnerDefault />
      </div>
    );
  }

  render() {
    return (
      <div className="fallback__container">
        {/* {this.renderHeader()} */}
        {this.renderBody()}
      </div>
    );
  }
}
