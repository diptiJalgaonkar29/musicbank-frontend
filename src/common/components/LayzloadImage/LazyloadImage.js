import React from 'react';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LazyImage = ({...props}) => (
  <div className="LtTc_img_container">
    <LazyLoadImage
      alt={props.alt}
      height={props.height}
      effect="blur"
      src={props.src} // use normal <img> attributes as props
      width={props.width}
      style={{
        borderRadius: props.borderRadius ? props.borderRadius : '0'
      }}
    />
  </div>
);

export default LazyImage;
