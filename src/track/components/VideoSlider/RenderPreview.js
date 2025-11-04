import React, { Component } from 'react';
import Iframe from 'react-iframe';

const iframeSettings = {
  width: '100%',
  height: 'auto',
  position: 'realtive',
  display: 'initial'
};

function getPlatformUrl(platformType, videoID) {
  switch (platformType) {
  case 'youtube':
    return `https://www.youtube.com/embed/${videoID}?autoplay=1&mute=0&modestbranding=1&playsinline=0&controls=1&rel=1&fs=1;start=0;`;
  case 'vimeo':
    return `https://player.vimeo.com/video/${videoID}?autoplay=1&muted=0&loop=1&autopause=0&controls=1`;
  default:
    return null;
  }
}

class RenderPreview extends Component {
    renderIframe = (platformType, videoID, heightProp) => {
      let generatedUrl = getPlatformUrl(platformType, videoID);

      if (generatedUrl !== null) {
        return (
          <Iframe
            frameBorder="0"
            controls="3"
            allowFullScreen
            url={generatedUrl}
            width={iframeSettings.width}
            height={heightProp ? heightProp : iframeSettings.height}
            position={iframeSettings.position}
            display={iframeSettings.display}
            id="video-iframe"
          />
        );
      } else {
        return null;
      }
    };

    render() {
      const { platformProp, videoIdProp, heightProp } = this.props;
      return <>{this.renderIframe(platformProp, videoIdProp, heightProp)}</>;
    }
}

export default RenderPreview;
