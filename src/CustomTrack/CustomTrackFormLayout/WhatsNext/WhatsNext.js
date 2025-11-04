import { Form, Formik } from "formik";
import React, { useState } from "react";
import "./WhatsNext.css";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { ReactComponent as DownloadIcon } from "../../../static/download-icon.svg";
import { FormattedMessage } from "react-intl";
import AsyncService from "../../../networking/services/AsyncService";
import MediaService from "../../../common/services/MediaService";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";

const WhatsNext = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const hash = window.location.hash;
      const queryString = hash.includes("?") ? hash.split("?")[1] : "";
      const params = new URLSearchParams(queryString);
      const id = params.get("id");

      const response = await AsyncService.loadData(
        `customtracks/generate-pdf/${id}`
      );

      const pdfFile = await MediaService.getCustomTrackVisualAsset(
        response.data,
        id
      );

      const link = document.createElement("a");
      link.href = pdfFile;
      link.setAttribute("download", response.data);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(pdfFile);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="whatsnext-container">
      <Formik initialValues={{ link: "" }}>
        {({ values, setFieldValue }) => (
          <Form>
            <div>
              <div className="whatsnext-header">
                <FormattedMessage id={"CustomTrackForm.ThankyouTitle"} />
              </div>
              <div className="whatsnext-subtitle">
                <FormattedMessage id={"CustomTrackForm.whathappensnext"} />
                <br />
                <FormattedMessage id={"CustomTrackForm.thankyouPoint1"} />
                <br />
                {/* <FormattedMessage id={"CustomTrackForm.thankyouPoint2"} /> */}
                <p style={{ marginTop: "0px" }}>
                  2. If you need any urgent assistance, please contact{" "}
                  <a
                    style={{
                      color: "var(--color-white)",
                      fontWeight: 600,
                    }}
                    href="mailto:sonicspace@ampcontact.com"
                  >
                    sonicspace@ampcontact.com
                  </a>
                  .
                </p>

                <br />
              </div>
            </div>
            {isDownloading ? (
              <div className="download-loader">
                <SpinnerDefault />
              </div>
            ) : (
              <ButtonWrapper
                variant="filled"
                className="download_btn"
                onClick={downloadPDF}
              >
                <DownloadIcon className="download-icon" />
                <FormattedMessage id={"CustomTrackForm.downloadBrief"} />
              </ButtonWrapper>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WhatsNext;
