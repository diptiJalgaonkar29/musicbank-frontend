import React, { Component, useContext, useState } from "react";
import { SpinnerDefault } from "../../common/components/Spinner/Spinner";
import DocumentsCard from "../components/documentCard/DocumentsCard";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import getConfigJson from "../../common/utils/getConfigJson";
import VideoPopup from "./VideoPopup";
import IconButtonWrapper from "../../branding/componentWrapper/IconButtonWrapper";

const IntroVideoDocumentCard = () => {
  const { jsonConfig: CONFIG } = useContext(BrandingContext);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const vdoSrc = `${document.location.origin}${CONFIG?.INTRO_VIDEO_RELATIVE_PATH}`;

  const handleVideoPlay = () => {
    const url = vdoSrc;
    // Uncomment the next line if you want to use the relative path from the configuration
    // const url = `${document.location.origin}${CONFIG?.INTRO_VIDEO_RELATIVE_PATH}`;
    setVideoUrl(url);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <li className="DocumentsPage__cardsItem">
        <div className="DocumentsPage__anchor" rel="noopener noreferrer">
          <div
            className="DocumentsPage__card"
            style={{
              position: "relative",
              width: "100%",
              height: "180px",
              borderRadius: "30px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.5)",
            }}
          >
            <video
              id="introvid"
              width="100%"
              height="100%"
              controls
              preload="auto"
              controlsList="nodownload noplaybackrate"
              // onPlay={handleVideoPlay}
            >
              <source
                src={
                  // "https://devmb.sonicspace.sonic-hub.com/taxonomydata/mercedes/introvideo.mp4"
                  `${document.location.origin}${CONFIG?.INTRO_VIDEO_RELATIVE_PATH}`
                }
                type="video/mp4"
              />
              {/* {console.log(
              "video",
              `${document.location.origin}${CONFIG?.INTRO_VIDEO_RELATIVE_PATH}`
            )} */}
            </video>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleVideoPlay}
            >
              <IconButtonWrapper id="vButton" icon={"videoPlay"} />
            </div>
          </div>
        </div>
      </li>
      {!!isPopupOpen && (
        <VideoPopup videoUrl={videoUrl} onClose={handleClosePopup} />
      )}
    </>
  );
};

const RenderDocuments = ({ documentByCategoryData, category, config }) => {
  if (config?.modules?.ShowIntroVideo && category === "guidelines") {
    return (
      <ul className="DocumentsPage__cards">
        <IntroVideoDocumentCard />
        {documentByCategoryData?.map((document) => (
          <DocumentsCard key={document.id} document={document} />
        ))}
      </ul>
    );
  }
  if (documentByCategoryData.length === 0) {
    return (
      <div className="DocumentsPage__content--noContent">
        <p>No Documents</p>
      </div>
    );
  }
  return (
    <ul className="DocumentsPage__cards">
      {documentByCategoryData?.map((document) => (
        <DocumentsCard key={document.id} document={document} />
      ))}
    </ul>
  );
};

class DocumentsPage extends Component {
  render() {
    const { documentByCategoryData, category } = this.props;
    return (
      <BrandingContext.Consumer>
        {({ config }) => (
          <>
            {documentByCategoryData === null ? (
              <div className="DocumentsPage__content--loading">
                <SpinnerDefault />
              </div>
            ) : (
              <RenderDocuments
                documentByCategoryData={documentByCategoryData}
                category={category}
                config={config}
              />
            )}
          </>
        )}
      </BrandingContext.Consumer>
    );
  }
}

export default DocumentsPage;
