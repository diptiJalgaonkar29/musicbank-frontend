import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./ProjectDownload.css";
import { setDownloadBasketMeta } from "../redux/actions/trackDownloads/tracksDownload";
import { showError, showSuccess } from "../redux/actions/notificationActions";
import { ReactComponent as File } from "../projectcommon/file.svg";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import AsyncService from "../networking/services/AsyncService";
import MainLayout from "../common/components/MainLayout/MainLayout";
import TrackList from "./TrackList";
import ModalWrapper from "../branding/componentWrapper/ModalWrapper";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import MediaService from "../common/services/MediaService";
import getSuperBrandId from "../common/utils/getSuperBrandId";
import moment from "moment";
import _ from "lodash";
import JSZip from "jszip";
import { useParams, useNavigate } from "react-router-dom";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FormattedMessage } from "react-intl";
import { getUserId } from "../common/utils/getUserAuthMeta";

function SimpleDialog({ open, setOpen, downloadHandler, loader }) {
  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={setOpen}
      onClose={() => setOpen(false)}
      className="download-confirmation-dialog"
    >
      <div
        style={{
          color: "var(--color-white)",
        }}
      >
        {loader && (
          <h2 style={{ fontSize: "24px", lineHeight: "32px", fontWeight: 700 }}>
            <FormattedMessage id="trackDetail.dowloadWAV.downloadPopup" />
          </h2>
        )}
        <p style={{ fontSize: "16px", lineHeight: "22px", fontWeight: 400 }}>
          <FormattedMessage id="trackDetail.dowloadWAV.alertDownloadPopup" />
        </p>

        <div className="projectDownload_btnContainer">
          <ButtonWrapper onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </ButtonWrapper>
          <ButtonWrapper
            variant="filled"
            onClick={downloadHandler}
            disabled={loader}
          >
            <FormattedMessage id="trackDetail.dowloadWAV.accept" />
          </ButtonWrapper>
        </div>
      </div>
    </ModalWrapper>
  );
}

function DownloadCompleted({ open, setOpen }) {
  const navigate = useNavigate();
  const manualClose = () => {
    setOpen(false);
    navigate("/projects/");
  };

  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={setOpen}
      onClose={manualClose}
      title={"Downloading tracks..."}
      className="download-confirmation-dialog"
    >
      <div
        style={{
          color: "var(--color-white)",
        }}
      >
        <p style={{ fontSize: "16px", lineHeight: "22px", fontWeight: 400 }}>
          You can wait or navigate to other pages while download completes.
        </p>
      </div>
    </ModalWrapper>
  );
}

export default function ProjectDownload() {
  let { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let printRef = useRef(null);
  const [trackData, setTrackData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creditValue, setCreditValue] = useState({});
  const [creditLoading, setCreditLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [creditRequest, setCreditRequest] = useState("");
  const [brandType, setBrandType] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const getDownloadProjectById = useCallback(() => {
    AsyncService.loadData(`/project/getByProjectId/${projectId}`)
      .then((response) => {
        setTrackData(response?.data);

        const initialCreditValue = {};
        _.forEach(response?.data, (track) => {
          _.forEach(track?.trackInfo, (ID) => {
            const getTypeValue =
              _.find(track?.audioType, { trackId: ID?.trackId })?.credit || 0;

            initialCreditValue[ID?.trackId] = {
              value: getTypeValue,
              trackId: ID?.trackId,
              ID: track?.id,
              count: track?.downloaded_trackids?.includes(ID?.trackId)
                ? 0
                : getTypeValue === 1
                ? ID?.paid
                : getTypeValue === 2
                ? ID?.radio
                : ID?.unpaid,
            };
          });
        });

        setCreditValue(initialCreditValue);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  const handleRedirect = () => {
    navigate("/credit-request/");
  };

  const totalCredits = useMemo(
    () =>
      Object?.values(creditValue)?.reduce(
        (sum, credit) => sum + credit?.count,
        0
      ),
    [creditValue]
  );

  const handleChangeCredit = useCallback(
    (trackId, value, ID, count) => {
      setCreditLoading(true);

      const requestObject = {
        trackId,
        value,
        ID,
      };

      AsyncService?.putData(
        "projectTracks/updateCreditInProject",
        requestObject
      )
        .then((response) => {
          setCreditValue((prev) => {
            const updatedCredits = { ...prev };
            updatedCredits[trackId] = { value, trackId, ID, count };
            return updatedCredits;
          });
          getDownloadProjectById();
          setCreditLoading(false);
        })
        .catch((Err) => {
          console.log(Err);
          setCreditValue({});
          setCreditLoading(false);
        })
        .finally(() => {
          setCreditLoading(false);
        });
    },
    [creditValue, setCreditValue, setCreditLoading]
  );

  const mergedTrackData = useMemo(() => {
    return trackData.map((track) => {
      const mergedTrackInfo = track?.trackInfo?.map((trackInfo) => {
        const audioType = _.find(track?.audioType, {
          trackId: trackInfo?.trackId,
        });
        return { ...trackInfo, ...audioType };
      });

      return { ...track, trackInfo: mergedTrackInfo };
    });
  }, [trackData]);

  const getNameFormat = useCallback((_trackobj, ext) => {
    let name = _trackobj.id + "_" + _trackobj.name.replaceAll(" ", "-") + ext;
    return name;
  }, []);

  const handleDownloadFiles = async () => {
    setIsDownloaded(true);
    const tracks = _.flatMap(mergedTrackData, (item) => generateURL(item));

    const data = {
      track: _.flatMap(mergedTrackData, (item) =>
        _.map(item?.trackInfo, (trk) => ({
          projectId,
          trackValue:
            trk?.credit === 0
              ? trk?.unpaid
              : trk?.credit === 2
              ? trk?.radio
              : trk?.paid,
          trackId: trk?.trackId,
          credit: trk?.credit,
          status: "completed",
          brandType,
        }))
      ),
    };

    AsyncService?.postData("/transaction/updateTransaction", data?.track)
      .then((response) => {
        if (response.status === 200) {
          downloadFileZip(response?.data, tracks);
          // setOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showError("Something went wrong!"));
        setOpen(false);
      })
      .finally(() => {
        setIsLoading(false);
        setOpen(false);
      });
  };

  const generateURL = useCallback(
    (_trackOverAll) =>
      _trackOverAll?.trackInfo?.flatMap((track) => {
        const types = track?.type?.split(",");
        return types?.map((type) => {
          switch (type?.trim()) {
            case "MP3":
              return {
                id: track?.trackId,
                url: track?.preview_track_url,
                name: track?.title,
                type: "MP3",
              };
            case "WAV":
              return {
                id: track?.trackId,
                url: track?.track_url,
                name: track?.title,
                type: "WAV",
              };
            case "STEM":
              return {
                id: track?.trackId,
                url: track?.stems_zip_wav_url,
                name: track?.title,
                type: "STEM",
              };
            default:
              return {
                id: track?.trackId,
                url: track?.preview_track_url,
                name: track?.title,
                type: "MP3",
              };
          }
        });
      }),
    []
  );

  const downloadFileZip = useCallback(async (filename, _tObject) => {
    dispatch(
      setDownloadBasketMeta({
        trackDownloadingPercent: 1,
        showTrackDownloadingProgress: true,
        isTrackDownloadingInBG: true,
      })
    );

    const zip = new JSZip();
    let count = 0;
    let isErrorWhileDownloadingFewFiles = false;

    const zipFilename =
      filename ||
      `${getUserId()}-${getSuperBrandId()}-downloadtracks-${new Date()?.toJSON()}`;

    // Generate PDF and add it to the ZIP
    try {
      const pdfBlob = await generatePdfFromResponse(zipFilename);
      zip.file(`${zipFilename}.pdf`, pdfBlob);
    } catch (error) {
      console.error("Error adding PDF to ZIP:", error);
    }

    for (const trackobj of _tObject || []) {
      let fileName = "";
      let fileUrl;
      try {
        if (trackobj?.url?.includes(".mp3")) {
          fileName = getNameFormat(trackobj, ".mp3");
          fileUrl = await MediaService?.getMp3(trackobj.url);
        } else if (trackobj.url?.includes(".wav")) {
          fileName = getNameFormat(trackobj, ".wav");
          fileUrl = await MediaService?.getWav(trackobj.url);
        } else if (trackobj.url?.includes(".zip")) {
          fileName = getNameFormat(trackobj, ".zip");
          fileUrl = await MediaService?.getStem(trackobj.url);
        } else if (trackobj.url?.includes(".txt")) {
          fileName = getNameFormat(trackobj, ".txt");
          fileUrl = await MediaService?.getTrackLyrics(trackobj.url);
        }

        if (fileUrl) {
          const file = await JSZipUtils?.getBinaryContent(fileUrl);
          zip.file(fileName, file, { binary: true });
        }
      } catch (error) {
        isErrorWhileDownloadingFewFiles = true;
        setOpen(false);
        setIsLoading(false);
        dispatch(showError("Something went wrong!"));
        console.log("Download error", error);
      }

      count++;
      dispatch(
        setDownloadBasketMeta({
          trackDownloadingPercent: (count / _tObject?.length) * 100,
        })
      );
    }

    // Generate PDF and add it to the ZIP
    try {
      const pdfBlob = await generatePdfFromResponse(zipFilename);
      zip.file(`${zipFilename}.pdf`, pdfBlob);
    } catch (error) {
      console.error("Error adding PDF to ZIP:", error);
    }

    // Finalizing ZIP download
    zip
      .generateAsync({ type: "blob" })
      .then((content) => {
        saveAs(content, `${zipFilename}.zip`);
        getDownloadProjectById();
        getCreditInfoByCompanyOrBrand();
        setIsLoading(false);
        setOpen(false);
        setIsDownloaded(false);
        navigate("/projects/");

        dispatch(
          setDownloadBasketMeta({
            trackDownloadingPercent: 100,
            showTrackDownloadingProgress: false,
            isTrackDownloadingInBG: true,
          })
        );

        dispatch(
          showSuccess(
            isErrorWhileDownloadingFewFiles
              ? "Tracks downloaded successfully, but some files failed."
              : "Tracks downloaded successfully"
          )
        );
      })
      .catch((err) => {
        setOpen(false);
        setIsLoading(false);
        dispatch(showError("Something went wrong!"));
        console.log(err);
      });
  }, []);

  const generatePdfFromResponse = useCallback(
    (fileName) => {
      return new Promise((resolve, reject) => {
        const input = printRef?.current;
        if (!input) {
          console.error("printRef is not defined or does not exist.");
          return reject("printRef is not defined.");
        }

        const bgColor = getComputedStyle(document.body).getPropertyValue(
          "--color-bg"
        );

        const hiddenElements = document.querySelectorAll(".isPrintDisable");
        hiddenElements.forEach((el) => (el.style.visibility = "hidden"));

        const originalPadding = input.style.padding || "";
        input.style.padding = "20px";

        html2canvas(input, {
          backgroundColor: bgColor,
          allowTaint: true,
          scale: 2,
        })
          .then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg");
            const imgWidth = 240;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const doc = new jsPDF({
              orientation: imgHeight < imgWidth ? "landscape" : "portrait",
              unit: "px",
              format: [imgWidth, imgHeight],
            });

            doc.addImage(imgData, "jpeg", 0, 0, imgWidth, imgHeight);
            const pdfBlob = doc.output("blob");

            resolve(pdfBlob);
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
            reject(error);
          })
          .finally(() => {
            input.style.padding = originalPadding;
            hiddenElements.forEach((el) => (el.style.visibility = ""));
            setIsLoading(false);
          });
      });
    },
    [printRef]
  );

  const getCreditInfoByCompanyOrBrand = useCallback(() => {
    let userId = Number(localStorage?.getItem("brandId"));

    if (!userId) return;
    AsyncService.loadData("users/getUserInternalOrExternalUser")
      .then((response) => {
        setBrandType(response?.data?.companyType);
        // 1 = "internal" & 2 = "external"
        AsyncService?.loadData(
          `credit/getCreditOfBrand?${
            response?.data?.companyType === 1 ? "brandId" : "companyId"
          }=${response?.data?.companyType === 1 ? userId : response?.data?.id}`
        )
          .then((creditResponse) => {
            setCreditRequest(creditResponse?.data?.creditremaining);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [creditRequest, brandType]);

  useEffect(() => {
    getDownloadProjectById();
    getCreditInfoByCompanyOrBrand();
  }, []);

  return (
    <MainLayout>
      {isLoading ? (
        <div className="loader-container">
          <SpinnerDefault />
        </div>
      ) : (
        <div className="project-download" ref={printRef}>
          {trackData?.length > 0 ? (
            mergedTrackData?.map((track) => {
              const localTime = moment
                .utc(track?.changeTimestamp || track?.newTimestamp)
                .local();
              const timeAgo = localTime.fromNow();
              return (
                <div className="project-download-container" key={track?.id}>
                  <>
                    <header className="project-download-header">
                      <div className="project-download-header-left">
                        <File width={"20px"} height={"20px"} />
                        <div>
                          <h1 className="project-title">{track?.name}</h1>
                          <p className="update-info">Updated {timeAgo}</p>
                        </div>
                      </div>
                      <ButtonWrapper
                        className="isPrintDisable "
                        style={{ cursor: "not-allowed" }}
                        variant="filledSecondary"
                      >
                        Add contributors
                      </ButtonWrapper>
                    </header>

                    {track?.trackInfo?.length > 0 ? (
                      <div className="content">
                        <main className="tracks">
                          <h2>Your tracks</h2>
                          {track?.trackInfo.map((tracksInfo, idx) => {
                            return (
                              <TrackList
                                key={tracksInfo?.trackId}
                                details={tracksInfo}
                                handleChangeCredit={handleChangeCredit}
                                index={idx}
                                creditValue={creditValue}
                                projectId={track?.id}
                                status={track?.status}
                                audioType={track?.audioType}
                                newData={getDownloadProjectById}
                                loading={creditLoading}
                                downloadedTracks={track?.downloaded_trackids}
                              />
                            );
                          })}
                        </main>
                        <aside className="sidebar">
                          <div className="credit-card">
                            <h2>Total</h2>
                            <div className="total-credits">
                              {" "}
                              {totalCredits} Tokens
                            </div>
                            <div
                              className={
                                totalCredits < creditRequest
                                  ? "wallet-credits"
                                  : "less-credits"
                              }
                            >
                              Tokens in your wallet: {creditRequest || 0}
                              {track?.status !== "completed" && (
                                <ButtonWrapper
                                  className="request-credits isPrintDisable"
                                  onClick={handleRedirect}
                                >
                                  Request Tokens
                                </ButtonWrapper>
                              )}
                            </div>
                            <ButtonWrapper
                              className="download-btn isPrintDisable"
                              // onClick={() =>
                              //   handlePreviewModal({ projectId, id: track })
                              // }
                              disabled={
                                track?.status !== "completed"
                                  ? totalCredits > creditRequest
                                  : false
                              }
                              onClick={() =>
                                track?.status === "completed"
                                  ? handleDownloadFiles()
                                  : setOpen(true)
                              }
                              // disabled={
                              //   track?.status === "completed" || totalCredits > creditRequest
                              // }
                            >
                              Download
                            </ButtonWrapper>
                          </div>
                        </aside>
                      </div>
                    ) : (
                      <h3 className="no_filtered_data_text">
                        No tracks found !
                      </h3>
                    )}
                    <SimpleDialog
                      open={open}
                      setOpen={setOpen}
                      downloadHandler={handleDownloadFiles}
                      loader={isLoading}
                    />
                    <DownloadCompleted
                      open={isDownloaded}
                      setOpen={setIsDownloaded}
                    />
                  </>
                </div>
              );
            })
          ) : (
            <h3 className="no_filtered_data_text">No projects found!</h3>
          )}
        </div>
      )}
    </MainLayout>
  );
}
