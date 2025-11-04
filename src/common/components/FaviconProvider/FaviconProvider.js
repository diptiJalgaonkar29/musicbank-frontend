import React, { Component } from "react";
import Favicon from "react-favicon";
import { ASSET_PATHS, getBrandAssetPath } from "../../utils/getBrandAssetMeta";

class FaviconProvider extends Component {
  render() {
    return <Favicon url={getBrandAssetPath(ASSET_PATHS?.FAVICON_PATH)} />;
  }
}

export default FaviconProvider;
