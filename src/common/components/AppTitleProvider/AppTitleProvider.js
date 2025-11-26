import React, { Component } from "react";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import getSuperBrandName from "../../utils/getSuperBrandName";
import { brandConstants } from "../../utils/brandConstants";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

class AppTitleProvider extends Component {
  applyDocumentTitle(title) {
    const superBrandName = getSuperBrandName();
    // console.log("window", window.location.hash, getSuperBrandName());
    let pageTitle = "Sonic Hub";
    let pageHash = window.location.hash;
    // let brandNameTitle = getSuperBrandName().toUpperCase(); //capitalizeFirstLetter(getSuperBrandName());
    let brandNameTitle = [
      brandConstants.SONIC_SPACE,
      brandConstants.AMP,
    ].includes(superBrandName)
      ? "Sonic Hub"
      : capitalizeFirstLetter(superBrandName);
    brandNameTitle =
      brandConstants.SHELL == superBrandName
        ? "Shell AI Voice Generator"
        : brandNameTitle;
    switch (pageHash) {
      case "#/login":
        pageTitle = "Login";
        break;
      case "#/":
        pageTitle = "Home";
        break;
      case "#/recover-password":
        pageTitle = "Recover Password";
        break;
      case "#/wpp-design":
        pageTitle = "WPP Design Page";
        break;
      case "#/register":
        pageTitle = "Register";
        break;
      case "#/set-password":
        pageTitle = "Set Password";
        break;
      case "#/profile":
        pageTitle = "User Profile";
        break;
      case (pageHash.match(/^#\/search_results/) || {}).input:
        pageTitle = "Search";
        break;
      case "#/browse":
        pageTitle = "Browse";
        break;
      case (pageHash.match(/^#\/mymusic/) || {}).input:
        pageTitle = "My Music";
        break;
      case (pageHash.match(/^#\/track_page/) || {}).input:
        pageTitle = "Track Details";
        break;
      case "#/supersearch/":
        pageTitle = "SuperSearch";
        break;
      case (pageHash.match(/^#\/similar_tracks/) || {}).input:
        pageTitle = "Similarity Search";
        break;
      case "#/documents/guidelines":
        pageTitle = "Guidelines";
        break;
      case "#/documents/templates":
        pageTitle = "Templates";
        break;
      case "#/documents/faq":
        pageTitle = "FAQ";
        break;
      case "#/basket/":
        pageTitle = "Basket";
        break;
      case (pageHash.match(/^#\/ai_search/) || {}).input:
        pageTitle = "AI Search";
        break;
      case "#/projects/":
        pageTitle = "Projects";
        break;
      case (pageHash.match(/^#\/track-download/) || {}).input:
        pageTitle = "Projects";
        break;
      case "#/download_basket_form/":
        pageTitle = "Download Form";
        break;
      case "#/credit-request/":
        pageTitle = "Token Request";
        break;
      default:
        pageTitle = "";
        break;
    }
    if (pageTitle) {
      document.title = pageTitle + " | " + brandNameTitle;
    } else {
      document.title = brandNameTitle;
    }
  }

  render() {
    return (
      <BrandingContext.Consumer>
        {({ messages }) =>
          this.applyDocumentTitle(messages?.app?.document?.title)
        }
      </BrandingContext.Consumer>
    );
  }
}

export default AppTitleProvider;
