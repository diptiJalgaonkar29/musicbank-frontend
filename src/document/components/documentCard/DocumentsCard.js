import React, { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MediaService from "../../../common/services/MediaService";
import { baseUrlPDF } from "../../constants/constants";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";
import VideoPopup from "../../pages/VideoPopup";
import IconWrapper from "../../../branding/componentWrapper/IconWrapper";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import AsyncService from "../../../networking/services/AsyncService";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import ToolTipWrapper from "../../../branding/componentWrapper/ToolTipWrapper";

function downloadBlob(blobUrl, fileName) {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

function getFileExtension(fileName) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop() : "";
}

class DocumentsCard extends Component {
  state = {
    imageData: null,
    isLoading: true,
    mediaData: null,
    videoUrl: "",
    isPopupOpen: false,
    isDownloading: false,
  };

  componentDidMount() {
    this.loadImage();
  }

  handleOnClick = () => {
    const { document } = this.props;

    if (
      document.pdf.endsWith(".mp4") ||
      document.pdf.endsWith(".pdf")
      //  ||
      // document.pdf.endsWith(".docx") || // added docx
      // document.pdf.endsWith(".doc")
    ) {
      this.setState({
        isPopupOpen: true,
        videoUrl: `${baseUrlPDF}?BrandName=${getSuperBrandId()}&fileName=${
          document.pdf
        }`,
      });
    } else {
      this.handleOnDownload();
    }
  };

  handleOnDownload = (e) => {
    try {
      this.setState({ isDownloading: true });
      e?.stopPropagation();
      const { document } = this.props;
      AsyncService.loadBlob(
        `${baseUrlPDF}?BrandName=${getSuperBrandId()}&fileName=${
          document.pdf
        }`?.replace("api", "")
      )
        .then((res) => {
          console.log("res.data?.type", res.data);
          const url = URL.createObjectURL(res.data);
          const fileName = `${getSuperBrandName()}_document_${new Date().toJSON()}.${getFileExtension(
            document.pdf
          )}`;
          console.log("fileName", fileName);
          downloadBlob(url, fileName);
        })
        .catch((error) => console.log("error", error))
        .finally(() => this.setState({ isDownloading: false }));
    } catch (error) {
      console.log("error", error);
      this.setState({ isDownloading: false });
    }
  };

  loadImage() {
    const { document } = this.props;
    MediaService.getDocumentImage(document.image)
      .then((res) => {
        this.setState({
          imageData: res,
          isLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          imageData: null,
          isLoading: false,
        });
      });
  }
  handleClosePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  render() {
    const { document } = this.props;
    const { imageData, isLoading, isPopupOpen, videoUrl, isDownloading } =
      this.state;

    return (
      <>
        <div className="DocumentsPage__cardsItem" onClick={this.handleOnClick}>
          <div className="DocumentsPage__anchor" rel="noopener noreferrer">
            <div className="DocumentsPage__card">
              {isLoading ? (
                <div className="DocumentsPage__card__loader">
                  <SpinnerDefault />
                </div>
              ) : (
                <LazyLoadImage
                  className="DocumentsPage__card--img"
                  src={imageData}
                  placeholder={
                    <div className="DocumentsPage__card__loader">
                      <SpinnerDefault />
                    </div>
                  }
                  effect="blur"
                  alt={`PDF_${document.title}`}
                />
              )}
              <div className="DocumentsPage__card--info">
                <ToolTipWrapper title={document.title}>
                  <p className="DocumentsPage__card--title boldFamily">
                    {document.title}
                  </p>
                </ToolTipWrapper>
                {/* {!!document.description && ( */}
                <ToolTipWrapper title={document.description}>
                  <div className="DocumentsPage__card--description boldFamily">
                    {document.description || "-"}
                  </div>
                </ToolTipWrapper>
                {/* )} */}
                {!document.pdf.endsWith(".mp4") && (
                  <div className="DocumentsPage__card--download">
                    <button
                      className="DocumentsPage__card--download-button"
                      onClick={this.handleOnDownload}
                    >
                      {isDownloading ? (
                        <span>Downloading...</span>
                      ) : (
                        <>
                          <span>
                            Download <IconWrapper icon="Download2" />
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isPopupOpen && (
          <VideoPopup
            videoUrl={videoUrl}
            title={document.title}
            isPopupOpen={isPopupOpen}
            onClose={this.handleClosePopup}
          />
        )}
      </>
    );
  }
}

export default DocumentsCard;
