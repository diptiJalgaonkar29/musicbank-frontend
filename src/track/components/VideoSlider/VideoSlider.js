import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';
import React, { Component, useEffect, useState } from 'react';

import Swiper from 'swiper';
import '../../../document/layout/DocumentsPageHoc.css';
import RenderPreview from './RenderPreview';
import './VideoCard.css';
import './VideoSlider.css';
import { ResponsiveTabletViewCondition768 } from '../../../common/utils/ResponsiveTabletViewCondition';
import { BrandingContext } from '../../../branding/provider/BrandingContext';

//getTumbnailFromVimeo
const getTumbnail = async (embed_id) => {
  const response = await fetch(
    `https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${embed_id}`
  );
  const json = await response.json();
  return json.thumbnail_url;
};

// generate Tumbnail from Video ID
const generateTumbnailString = async (embed_id, platform) => {
  switch (platform) {
    case 'youtube':
      return `https://img.youtube.com/vi/${embed_id}/mqdefault.jpg`;
    case 'vimeo': {
      const data = await getTumbnail(embed_id);
      return data;
    }
    default:
      return null;
  }
};

const VideoCardWithTumbnail = ({
  id,
  embed_id,
  platform,
  title,
  description,
}) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    async function fetchTumbanil(embed_id, platform) {
      const imgsrc = await generateTumbnailString(embed_id, platform);
      setImageSrc(imgsrc);
    }
    fetchTumbanil(embed_id, platform);
  }, [imageSrc, embed_id, platform]);

  return (
    <BrandingContext.Consumer>
      {({ config }) => (
        <div className='video-card'>
          <div
            className={
              ResponsiveTabletViewCondition768()
                ? 'video-overlay--mobile'
                : 'video-overlay'
            }
          >
            <div className='play-icon'>
              <div className='play-icon-container'>
                <PlayCircleOutline style={{ fontSize: 60 }} />
              </div>
            </div>
          </div>
          {!imageSrc ? (
            <div
              className='video-card--img'
              style={{ width: '100%', height: '30rem' }}
            ></div>
          ) : (
            <img
              className='video-card--img'
              src={imageSrc}
              alt='video-tumbnail'
              width='100%'
              height='auto'
              data-index={id}
            />
          )}
          <div className='video-card--title'>
            <span>{title ? title : 'no Title'}</span>
          </div>
          {!config.modules.UpdateUItoV2 && (
            <div className='video-card--description'>
              <span>{description ? description : ''}</span>
            </div>
          )}
        </div>
      )}
    </BrandingContext.Consumer>
  );
};

export default class VideoSlider extends Component {
  state = {
    activeIframe: null,
  };

  componentDidMount() {
    new Swiper('.swiper-container', {
      slidesPerView: ResponsiveTabletViewCondition768() ? 'auto' : 3,
      centeredSlides: false,
      roundLengths: true,
      // grabCursor: true,
      direction: 'vertical',
      allowTouchMove: 'false',
      enabled: 'false',
      spaceBetween: 30,
      slidesPerGroup: 2,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        hideOnClick: true,
      },
      on: {
        click: (e) => {
          const id = e.target.dataset.index;
          this.setClickedID(id);
        },
      },
    });
  }

  setClickedID = (id) => {
    this.setState({
      activeIframe: +id,
    });
  };

  renderVideoCard = (embed_id, platform, title, description) => {
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <div className='video-card'>
            <div className='video-iframe-container'>
              <RenderPreview
                showPreview
                platformProp={platform}
                videoIdProp={embed_id}
              />
            </div>
            <div className='video-card--title'>
              <span>{title ? title : 'no Title'}</span>
            </div>
            {!config.modules.UpdateUItoV2 && (
              <div className='video-card--description'>
                <span>{description ? description : ''}</span>
              </div>
            )}
          </div>
        )}
      </BrandingContext.Consumer>
    );
  };

  renderIframeOrTumbnailHandler = (
    id,
    embed_id,
    platform,
    title,
    description
  ) => {
    const { activeIframe } = this.state;
    if (activeIframe && activeIframe === id) {
      // Case if User Clicked on a Tumbnail
      return this.renderVideoCard(embed_id, platform, title, description);
    } else if (activeIframe !== id) {
      // Case if User Clicked on an Iframe
      return (
        <VideoCardWithTumbnail
          id={id}
          embed_id={embed_id}
          platform={platform}
          title={title}
          description={description}
        />
      );
    }
  };

  render() {
    return (
      <>
        <div
          className={
            ResponsiveTabletViewCondition768() ? 'outer-mobile' : 'outer-web'
          }
        >
          <div className='swiper-container'>
            <div className='swiper-wrapper'>
              {this.props.videosProp &&
                this.props.videosProp.map((video, index) => {
                  return (
                    <div className='swiper-slide' key={video.embed_id}>
                      {this.renderIframeOrTumbnailHandler(
                        index + 1,
                        video.embed_id,
                        video.platform,
                        video.title,
                        video.description
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className='swiper-button-next'></div>
          <div className='swiper-button-prev'></div>
        </div>
      </>
    );
  }
}
