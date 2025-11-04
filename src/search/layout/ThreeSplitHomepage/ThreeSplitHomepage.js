import React, { Component } from "react";
import { connect } from "react-redux";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import TSPTrackSlider from "../../../browse/layout/TSPTrackSlider";
import HomePageFooter from "../../../common/components/Footer/HomePageFooter";
import NavBar from "../../../common/components/Navbar/NavBar";
import "../../../_styles/HomePageHocNew.css";
import SearchBarWithTitleText from "../../components/Searchbar/SearchBarTSP";
import ThreeSplitBackground from "./ThreeSplitBackgroundWrapper";
import "./ThreeSplitHomepage.css";

class ThreeSplitHomepage extends Component {
  renderNavBar() {
    return (
      <nav className="SearchPageTS__navigation">
        <NavBar />
      </nav>
    );
  }

  renderTitleSection(config) {
    return (
      <>
        <ThreeSplitBackground config={config}>
          <div className="SearchPageTS__SearchSection">
            <SearchBarWithTitleText />
          </div>
        </ThreeSplitBackground>
      </>
    );
  }

  renderSlider(isOpen) {
    return (
      <div
        className={
          isOpen
            ? "SearchPageTS__SliderSection extended"
            : "SearchPageTS__SliderSection"
        }
      >
        <div className="SearchPageTS__TrackSection">
          <TSPTrackSlider />
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <>
        <div className="SearchPageTS__FooterSection">
          <HomePageFooter />
        </div>
      </>
    );
  }

  componentDidMount1() {
    // <!-- CookiePro CCPA Opt-Out Script Start -->
    // <script>
    // const javascript =`<!-- CookiePro CCPA Opt-Out Script Start --><script> alert("this.is.sparta");var otCcpaScript = document.createElement('script'),script1 = document.getElementsByTagName('script')[0];console.log("script cookiepro",script1);otCcpaScript.src = 'https://cookie-cdn.cookiepro.com/ccpa-optout-solution/v1/ccpa-optout.js';otCcpaScript.async = false;otCcpaScript.type = 'text/javascript';script1.parentNode.insertBefore(otCcpaScript, script1); window.otccpaooSettings = {layout: {dialogueLocation:"left",primaryColor: "#6aaae4",secondaryColor: "var(--color-white)",button:{primary:"#6aaae4", secondary:"var(--color-white)", } },dialogue: {email: {display:false,title:"",url:"",},lspa: {accepted:false,},phone: {display:false,title:"",url:"",},dsar: {display:false,title:"",url:"",},intro: { title:"Do Not Sell My Personal Information",description:"Exercise your consumer right to opt out.",}, privacyPolicy: {title:"",url:"", }, optOut: {title:"Personalized Advertisements",description:"Turning this off will opt you out of personalized advertisements on this website.",frameworks:["iab","gam"],}, location:"us",confirmation: {text: "Confirm",}, } };</script><!-- CookiePro CCPA Opt-Out Script End -->`;
    //    new Function(javascript);
    var otCcpaScript = document.createElement("script");
    var script1 = document.getElementsByTagName("script")[0];

    otCcpaScript.src =
      "https://cookie-cdn.cookiepro.com/ccpa-optout-solution/v1/ccpa-optout.js";
    otCcpaScript.async = true;
    otCcpaScript.type = "text/javascript";
    script1.parentNode.insertBefore(otCcpaScript, script1);
    window.otccpaooSettings = {
      layout: {
        dialogueLocation: "right",
        primaryColor: "#6aaae4",
        secondaryColor: "var(--color-white)",
        button: {
          primary: "#6aaae4",
          secondary: "var(--color-white)",
        },
      },
      dialogue: {
        email: {
          display: false,
          title: "",
          url: "",
        },
        lspa: {
          accepted: false,
        },
        phone: {
          display: false,
          title: "",
          url: "",
        },
        dsar: {
          display: false,
          title: "",
          url: "",
        },
        intro: {
          title: "Do Not Sell My Personal Information",
          description: "Exercise your consumer right to opt out.",
        },
        privacyPolicy: {
          title: "",
          url: "",
        },
        optOut: {
          title: "Personalized Advertisements",
          description:
            "Turning this off will opt you out of personalized advertisements on this website.",
          frameworks: ["iab", "gam"],
        },
        location: "us",
        confirmation: {
          text: "Confirm",
        },
      },
    };
    document.head.appendChild(script1);
    // </script>
    // <!-- CookiePro CCPA Opt-Out Script End -->
  }

  render() {
    // console.log("script",window.script);
    const { isOpen } = this.props;

    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div className="SearchPageTS__container">
            {this.renderNavBar()}
            <div className="SearchPageTS__ContentWrapper">
              {this.renderTitleSection(config)}
              {this.renderSlider(isOpen)}
              {this.renderFooter()}
              {/* <a href="javascript:void(0)" data-ot-ccpa-opt-out="link" style={{display:'none'}}>Do Not Sell My Personal Information</a> */}
            </div>
            {/* <div align="right" style={{padding:'15px'}} onClick={window.script1} > */}
            {/* <Button text="Do Not Sell My Personal Information"/> */}
            {/* {<button type="button" data-ot-ccpa-opt-out="button" style={{display:'none'}} class="ot-ccpa-optout__button ot-ccpa-optout__button--light">
                           <img src="https://cookie-cdn.cookiepro.com/ccpa-optout-solution/v1/assets/icon-do-not-sell.svg"style={{width:'30px',height:'30px'}} alt="" role="presentation"/>
                               <span class="ot-ccpa-optout__button__title">Do Not Sell My Personal Information</span>                           
                       </button>} */}
            {/* </div> */}
          </div>
        )}
      </BrandingContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => ({
  query: state.search,
  isOpen: state.search.isOpen,
});

export default connect(mapStateToProps, null)(ThreeSplitHomepage);
