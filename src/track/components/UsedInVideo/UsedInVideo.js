import React, { useContext, useEffect, useState } from "react";
import "./UsedInVideo.css";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import AsyncService from "../../../networking/services/AsyncService";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";
import {
  ASSET_PATHS,
  getBrandAssetPath,
} from "../../../common/utils/getBrandAssetMeta";

const UsedInVideo = ({ data }) => {
  let { id, name, description, usedInUrl, imageFile } = data;
  const [imgSrc, setImgSrc] = useState("");
  const { config } = useContext(BrandingContext);

  const getUsedInVideoCoverImage = (imageFile) => {
    AsyncService.loadBlob(`/newVideo/${imageFile}`)
      .then((res) => {
        const coverImgURL = URL.createObjectURL(res.data);
        setImgSrc(coverImgURL);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  useEffect(() => {
    if (
      !imageFile ||
      ["default_usedin.png", "default_sonicspace.png"].includes(imageFile)
    ) {
      setImgSrc(getBrandAssetPath(ASSET_PATHS?.FALLBACK_LOGO_PATH));
      return;
    }
    getUsedInVideoCoverImage(imageFile);
  }, [imageFile]);

  return (
    <div className="used_in_video_container">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="cover-image"
          className={`cover_image ${
            ["default_usedin.png", "default_sonicspace.png"].includes(imageFile)
              ? "default_usedin_img"
              : ""
          }`}
          id={`used-in-cover-img-${id}`}
        />
      ) : (
        <div className="cover_image_skeleton">
          <SpinnerDefault />
        </div>
      )}
      <div className="used_in_content">
        <a href={usedInUrl} target="_blank" className="used_in_title">
          {name}
        </a>

        <div
          className="used_in_description"
          dangerouslySetInnerHTML={{ __html: description }}
          // title={description}
        />
      </div>
    </div>
  );
};
export default UsedInVideo;
