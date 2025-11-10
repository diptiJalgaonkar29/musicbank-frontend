import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ModalWrapper from "../../branding/componentWrapper/ModalWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import _, { get } from "lodash";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../projectDownloadV1/projectDownloadV1.css";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import { SpinnerDefault } from "../../common/components/Spinner/Spinner";
import {
  showError,
  showSuccess,
} from "../../redux/actions/notificationActions";
import AsyncService from "../../networking/services/AsyncService";
import { setDownloadBasketMeta } from "../../redux/actions/trackDownloads/tracksDownload";
import getSuperBrandId from "../../common/utils/getSuperBrandId";
import MediaService from "../../common/services/MediaService";
import { getUserId } from "../../common/utils/getUserAuthMeta";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { ReactComponent as Download } from "../../static/DownloadNewIcon.svg";
import { ReactComponent as DollarIcon } from "../../static/dollarIcon.svg";
import { ReactComponent as FileIcon } from "../../projectcommon/file.svg";
import IconWrapper from "../../branding/componentWrapper/IconWrapper";
import TrackList from "../TrackList";
import { ErrorMessage, Field, Form, Formik } from "formik";
import CheckboxWrapper from "../../branding/componentWrapper/CheckboxWrapper";
import EditProjectInfoModal from "../../common/components/EditProjectInfoModal/EditProjectInfoModal";
import ToolTipWrapper from "../../branding/componentWrapper/ToolTipWrapper";
import { ReactComponent as SimilarityBlack } from "../../static/Icon.svg";
import * as Yup from "yup";
import InputWrapper from "../../branding/componentWrapper/InputWrapper";
import useDebouncedSocialMediaAPI from "../util/useDebouncedHandleChange";
import getMediaBucketPath from "../../common/utils/getMediaBucketPath";
import getTrackDetails from "../../common/utils/getTrackDetails";
import PredictionReportPage from "../../PredictionReport/PredictionReportPage";
import { Tooltip } from "@mui/material";
import getTrackDetailsByAlgoliaId from "./../../common/utils/getTrackDetailsByAlgoliaId";
import getSuperBrandName from "../../common/utils/getSuperBrandName";
import { brandConstants } from "../../common/utils/brandConstants";
import { BrandingContext } from "../../branding/provider/BrandingContext";

const validationSchema = (meta) => {
  return Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });
};

const socialMediaMap = {
  1: "Instagram",
  2: "Youtube",
  3: "Google Ads",
  4: "Facebook",
  5: "Tik Tok",
  6: "Content Marketing",
  7: "Channel",
  8: "Social Media Marketing",
};

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

function AddContributors({ open, setOpen, projectDisplayName }) {
  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={setOpen}
      onClose={() => setOpen(false)}
      className="add-contributor-dialog"
    >
      <Formik
        initialValues={{
          email: "",
        }}
        validateOnMount
        validationSchema={validationSchema}
      >
        {({ isSubmitting, values, isValid, handleSubmit, dirty, errors }) => (
          <Form className="add_contributor__content" onSubmit={handleSubmit}>
            <h3 className="tittle">Add a collaborator to -</h3>
            <h3 className="project_contributor">{projectDisplayName}</h3>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Collaborator Email *
              </label>
              <Field
                type="text"
                id="email"
                name="email"
                placeholder="Write an email address"
                component={InputWrapper}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="report_form_error"
              />
            </div>
            <div className="projectDownload_btnContainer">
              <ButtonWrapper onClick={() => setOpen(false)} variant="outlined">
                Cancel
              </ButtonWrapper>
              <ButtonWrapper
                variant="filled"
                disabled={isSubmitting || !isValid}
              >
                <FormattedMessage id="trackDetail.dowloadWAV.add" />
              </ButtonWrapper>
            </div>
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
}

function TokenNotValidModal({ open, close }) {
  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={close}
      onClose={close}
      className="download-confirmation-dialog"
    >
      <div
        style={{
          color: "var(--color-white)",
        }}
      >
        <p style={{ fontSize: "16px", lineHeight: "22px", fontWeight: 400 }}>
          <FormattedMessage id="trackDetail.dowloadWAV.tokenValidationErrorMssg" />
        </p>

        <div className="projectDownload_btnContainer">
          <ButtonWrapper variant="filled" onClick={close}>
            Okay
          </ButtonWrapper>
        </div>
      </div>
    </ModalWrapper>
  );
}

// get token from URL
const url = window.location.hash;
const match = url.match(/token=([^&]+)/);
const token = match ? match[1] : null;

function ProjectDownloadV1() {
  let { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  let printRef = useRef(null);
  const [trackData, setTrackData] = useState([]);
  const [selected, setSelected] = useState("Tracks");
  const [isLoading, setIsLoading] = useState(true);
  const [creditValue, setCreditValue] = useState({});
  const [creditLoading, setCreditLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [creditRequest, setCreditRequest] = useState("");
  const [brandType, setBrandType] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [editProjectInfo, setEditProjectInfo] = useState({});
  const [isAddContributorsOpen, setIsAddContributorsOpen] = useState(false);
  const [tokenModal, setTokenModal] = useState(false);
  const projectIdSplitter = (projectId || "")?.split("&")[0];
  const [retriveDataFromTokenByAPi, setRetriveDataFromTokenApi] = useState([]);
  let serverName = "";
  //console.log("Using Algolia index:", indexName, brandId);
  if (getSuperBrandName() === brandConstants.WPP) {
    const { config } = React.useContext(BrandingContext);
    serverName = config.modules.ServerName;
  } else {
    serverName = window.globalConfig?.SERVER_NAME;
  }
  const getDownloadProjectById = useCallback(async () => {
    try {
      // Step 1: Fetch project data
      const Response = await AsyncService.loadData(
        `/project/getByProjectId/${projectIdSplitter}?token=${token || "ss"}`
      );

      // Step 2: Extract all audioType entries
      const allAudioTypes = Response?.data?.flatMap((e) => e?.audioType || []);

      const getTrackIDsFromResponse =
        allAudioTypes
          ?.filter((a) => !a?.algoliaId && a?.trackId)
          ?.map((a) => a.trackId) || [];

      const getAlgoliaIdsFromResponse =
        allAudioTypes?.filter((a) => !!a?.algoliaId)?.map((a) => a.algoliaId) ||
        [];

      // Step 3: Fetch Algolia details (parallel)
      const [algoliaResponseByTrackId, algoliaResponseByAlgoliaId] =
        await Promise.all([
          getTrackIDsFromResponse.length > 0
            ? getTrackDetails(getTrackIDsFromResponse)
            : [],
          getAlgoliaIdsFromResponse.length > 0
            ? getTrackDetailsByAlgoliaId(getAlgoliaIdsFromResponse)
            : [],
        ]);

      // Step 4: Combine both Algolia responses
      const algoliaResponse = [
        ...(algoliaResponseByTrackId || []),
        ...(algoliaResponseByAlgoliaId || []),
      ];

      // Step 5: Merge Algolia data per audioType entry
      const mergedAudioType = allAudioTypes.map((track) => {
        let match = null;

        if (track?.algoliaId) {
          // ✅ Match by Algolia objectID
          match = algoliaResponse.find(
            (alg) => String(alg?.objectID) === String(track?.algoliaId)
          );
        } else {
          // ✅ Match by SonicHub Track ID
          match = algoliaResponse.find(
            (alg) => String(alg?.sonichub_track_id) === String(track?.trackId)
          );
        }

        return { ...track, ...(match || {}) };
      });

      // Step 6: Token check
      setTokenModal(
        !!Response?.data?.[0]?.txn_token &&
          Response?.data?.[0]?.txn_token === "Token_not_valid"
      );

      // Step 7: Set merged track data
      setTrackData([
        {
          ...Response?.data?.[0],
          algoliaResponse: mergedAudioType,
        },
      ]);

      // Step 8: Build initialCreditValue
      const initialCreditValue = {};

      Response?.data?.forEach((project) => {
        project?.audioType?.forEach((trackInfoId) => {
          mergedAudioType?.forEach((ar) => {
            //console.log("ar--->", ar);
            // ✅ Use correct ID logic for mapping
            const matchedTrackId = ar?.sonichub_track_id || ar?.trackId;

            // ✅ Find corresponding audioType entry
            const typeEntry =
              project?.audioType?.find(
                (item) =>
                  String(item.algoliaId) === String(ar?.objectID) ||
                  String(item.trackId) === String(matchedTrackId)
              ) || {};

            const getTypeValue = typeEntry.credit || 0;
            const getSocialMedia =
              getTypeValue == 0
                ? typeEntry.socialMedia
                : typeEntry?.socialMediaPaid || "";

            const convertToOptionFormat = (getSocialMedia || "")
              .split(",")
              .map((id) => ({
                label: socialMediaMap[id.trim()],
                value: Number(id.trim()),
              }))
              .filter((item) => item.label);

            // ✅ Safely assign credit data
            initialCreditValue[matchedTrackId] = {
              value: getTypeValue,
              trackId: matchedTrackId,
              ID: project?.id,
              count:
                project?.downloaded_trackids?.includes(matchedTrackId) &&
                project?.status !== "active"
                  ? 0
                  : getTypeValue === 1
                  ? ar?.track_type_id != 6 && ar?.track_type_id != 5
                    ? 0
                    : trackInfoId?.paid > 0
                    ? trackInfoId?.paid
                    : project?.brandCredit?.paid
                  : getTypeValue === 2
                  ? ar?.track_type_id != 6 && ar?.track_type_id != 5
                    ? 0
                    : trackInfoId?.radio > 0
                    ? trackInfoId?.radio
                    : project?.brandCredit?.radio
                  : ar?.track_type_id != 6 && ar?.track_type_id != 5
                  ? 0
                  : trackInfoId?.unpaid > 0
                  ? trackInfoId?.unpaid
                  : project?.brandCredit?.unpaid,
              socialMedia: convertToOptionFormat,
            };
          });
        });
      });

      setCreditValue(initialCreditValue);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
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
    (trackId, value, ID, sonicTrackId, facetTrackId, algoliaId, count) => {
      setCreditLoading(true);

      const requestObject = {
        trackId:
          serverName === "sh2Dev" || serverName === "sh2Wpp"
            ? facetTrackId
            : sonicTrackId,
        value,
        ID,
        // sonicTrackId,

        algoliaId,
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
      let mergedTrackInfo = [];

      mergedTrackInfo = track?.audioType?.map((audioType) => {
        // ✅ Find matching Algolia response entry
        const AlgoliaResponseData =
          _.find(track?.algoliaResponse, (alg) => {
            if (audioType?.algoliaId) {
              // Match by Algolia ID
              return String(alg?.objectID) === String(audioType?.algoliaId);
            } else {
              // Match by SonicHub track ID
              return (
                String(alg?.sonichub_track_id) === String(audioType?.trackId)
              );
            }
          }) || {};

        const audioTypeSplitter = audioType?.type?.split(",") || [];

        const fileMap = {
          MP3: getMediaBucketPath(
            AlgoliaResponseData?.mp3_track,
            AlgoliaResponseData?.source_id,
            "download"
          ),
          WAV: getMediaBucketPath(
            AlgoliaResponseData?.wav_track,
            AlgoliaResponseData?.source_id,
            "download"
          ),
          STEM: getMediaBucketPath(
            AlgoliaResponseData?.stems_zip,
            AlgoliaResponseData?.source_id,
            "download"
          ),
        };

        const downloadURL = audioTypeSplitter
          .map((type) => fileMap[type])
          .filter(Boolean)
          .flat();

        return {
          trackId: AlgoliaResponseData?.sonichub_track_id,
          facetTrackId:
            serverName === "sh2Dev" || serverName === "sh2Wpp"
              ? Number(
                  Array.isArray(AlgoliaResponseData?.facet_sonic_track_id)
                    ? AlgoliaResponseData.facet_sonic_track_id
                        .find((id) => id.startsWith(serverName + ":"))
                        ?.split(":")[1] || 0
                    : 0
                )
              : Number(AlgoliaResponseData?.sonichub_track_id) || null,
          sonichub_track_id: AlgoliaResponseData?.sonichub_track_id,
          source_id: AlgoliaResponseData?.source_id,
          type: audioType.type || null,
          credit: audioType.credit ?? null,
          socialMedia: audioType.socialMedia ?? null,

          // ✅ Credits handling (on-demand / on-request)
          paid:
            AlgoliaResponseData?.track_type_id != 6 &&
            AlgoliaResponseData?.track_type_id != 5
              ? 0
              : audioType.paid > 0
              ? audioType.paid
              : track.brandCredit?.paid,

          unpaid:
            AlgoliaResponseData?.track_type_id != 6 &&
            AlgoliaResponseData?.track_type_id != 5
              ? 0
              : audioType.unpaid > 0
              ? audioType.unpaid
              : track.brandCredit?.unpaid,

          radio:
            AlgoliaResponseData?.track_type_id != 6 &&
            AlgoliaResponseData?.track_type_id != 5
              ? 0
              : audioType.radio > 0
              ? audioType.radio
              : track.brandCredit?.radio,

          title: AlgoliaResponseData?.track_name,
          preview_image_url: getMediaBucketPath(
            AlgoliaResponseData?.preview_image,
            AlgoliaResponseData?.source_id,
            "image"
          ),
          cyanite_id: AlgoliaResponseData?.cyanite_id,
          track_type_id: AlgoliaResponseData?.track_type_id,
          duration: AlgoliaResponseData?.duration_in_sec,
          preview_track_url: AlgoliaResponseData?.mp3_track,
          objectId: AlgoliaResponseData?.objectID,
          strotswar_track_id: AlgoliaResponseData?.strotswar_track_id,
          track_mediatypes: AlgoliaResponseData?.track_mediatypes,
          asset_type_id: AlgoliaResponseData?.asset_type_id,
          mp3_tracksignature: AlgoliaResponseData?.mp3_tracksignature,
          downloadURL,
          genre_tags: AlgoliaResponseData?.amp_genre_tags?.tag_names?.slice(
            0,
            5
          ),
          amp_all_mood_tags:
            AlgoliaResponseData?.amp_all_mood_tags?.tag_names?.slice(0, 5),
          bpm: AlgoliaResponseData?.bpm,
          tag_key: AlgoliaResponseData?.tag_key,
          instrument_vocal_data: AlgoliaResponseData?.instrument_vocal_data,
          waveImage: AlgoliaResponseData?.wave_form_js,
        };
      });

      return {
        ...track,
        trackInfo: mergedTrackInfo,
      };
    });
  }, [trackData]);

  const getTrackDetailsByFilePath = async (path) => {
    console.log("getTrackDetailsByFilePath path", path);
    try {
      const getPathResponse = await AsyncService.postData(
        "downloadTrack/downloadTrackByPath",
        path
      );
      console.log("getPathResponse", getPathResponse);

      return getPathResponse?.data;
    } catch (error) {
      showError("Something went wrong.");
    }
  };

  const handleDownloadFiles = async () => {
    setIsDownloaded(true);

    const getTrackFromInit = mergedTrackData.flatMap((item) =>
      (item?.trackInfo || []).flatMap((trk) => trk?.downloadURL)
    );

    const tracks = await getTrackDetailsByFilePath(getTrackFromInit);
    console.log("projectdownloadv1:: tracks", tracks);

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
          trackType: trk?.credit,
          status: "completed",
          brandType,
        }))
      ),
    };
    console.log("projectdownloadv1--tracks", tracks);
    if (tracks?.length == 0) return;

    AsyncService?.postData("/transaction/updateTransaction", data?.track)
      .then((response) => {
        console.log(response?.data);
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

  const downloadFileZip = useCallback(async (filename, _tObject) => {
    console.log(filename, _tObject);
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
    // try {
    //   const pdfBlob = await generatePdfFromResponse(zipFilename);
    //   zip.file(`${zipFilename}.pdf`, pdfBlob);
    // } catch (error) {
    //   console.error("Error adding PDF to ZIP:", error);
    // }

    for (const trackobj of _tObject || []) {
      let fileName = "";
      let fileUrl;
      try {
        if (trackobj?.includes(".mp3")) {
          fileName = trackobj?.split("/")?.pop();
          fileUrl = trackobj;
        } else if (trackobj.includes(".wav")) {
          fileName = trackobj?.split("/")?.pop();
          fileUrl = trackobj;
        } else if (trackobj.includes(".zip")) {
          fileName = trackobj?.split("/")?.pop();
          fileUrl = trackobj;
        } else if (trackobj.includes(".txt")) {
          fileName = trackobj?.split("/")?.pop();
          fileUrl = trackobj;
        }

        console.log("fileName", fileName);
        console.log("fileUrl", fileUrl);

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
        return;
      }

      count++;
      dispatch(
        setDownloadBasketMeta({
          trackDownloadingPercent: (count / _tObject?.length) * 100,
        })
      );
    }

    // Generate PDF and add it to the ZIP
    // try {
    // 	const pdfBlob = await generatePdfFromResponse(zipFilename);
    // 	zip.file(`${zipFilename}.pdf`, pdfBlob);
    // } catch (error) {
    // 	console.error("Error adding PDF to ZIP:", error);
    // }

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
              : "Your project was successfully downloaded!"
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
          useCORS: true, // allow cross-origin images
          allowTaint: false, // must be false with useCORS
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
    setCreditLoading(true);
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
            setCreditLoading(false);
          })
          .catch((error) => {
            setCreditLoading(false);
            console.log(error);
          });
      })
      .catch((err) => {
        setCreditLoading(false);
        console.log(err);
      })
      .finally(() => {
        setCreditLoading(false);
      });
  }, [creditRequest, brandType]);

  const openEditProjectModal = (e, project) => {
    console.log("project", project);
    e.stopPropagation();
    setEditProjectInfo({
      isOpen: true,
      name: project?.name,
      projectID: project?.id,
      description: project?.description,
      status: project?.status,
      project_logo: "",
    });
  };

  const debouncedApiCall = useDebouncedSocialMediaAPI(2000);

  const handleChangeForSocialMedia = useCallback(
    (e, trackId, algoliaId, ID, type) => {
      setCreditValue((prev) => {
        const updatedCredits = { ...prev };
        updatedCredits[trackId] = {
          ...updatedCredits[trackId],
          socialMedia: e,
        };
        return updatedCredits;
      });

      // 🔹 Debounce API call only
      debouncedApiCall(trackId, algoliaId, e, ID, type, getDownloadProjectById);
    },
    [debouncedApiCall]
  );

  const hasInvalidSocialMedia = Object?.values(creditValue)?.some((entry) =>
    entry?.value === 2
      ? false
      : !Array?.isArray(entry.socialMedia) || entry.socialMedia.length === 0
  );

  const getDetailsFromPredictToken = () => {
    AsyncService.loadData(`predict/getCountOfTransactions?token=${token}`)
      .then((predictData) => {
        setRetriveDataFromTokenApi(
          predictData?.data[0].txn_token === "Token_not_valid"
            ? []
            : predictData?.data
        );
      })
      .catch((err) => {
        console.log("err", err);
        setRetriveDataFromTokenApi([]);
      });
  };

  const redirectToExternal = (token) => {
    const form = document.createElement("form");
    form.method = "POST";
    //form.action = "https://demo.predict.sonic-hub.com/predict-login";
    form.action = window.globalConfig?.PREDICT_BASE_URL + "/predict-login";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "txn_token";
    input.value = token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit(); // 🚀 sends user away to external site
  };

  const handleCallPrdictAPi = (Ids, Index) => {
    const getDataByIds = Index?.filter((t) =>
      //Ids?.includes(t.trackId)) // exclude API IDs
      //?.map((e) => ({
      Ids?.some((id) => id.trackId === t.facetTrackId)
    )?.map((e) => ({
      projectId: projectIdSplitter,
      assetType: e?.asset_type_id,
      assetName: (e?.preview_track_url || "")?.split("/")[1],
      assetSourceId: e?.strotswar_track_id,
      d_link: getMediaBucketPath(
        e?.preview_track_url,
        e?.strotswar_track_id,
        "download"
      ),
      algoliaTrackId: e?.objectId,
      sonicTrackId: e?.trackId,
      source: 1,
    }));

    if (token?.length > 4) {
      // If token already exists
      const updatedPredictData = getDataByIds.map((item) => ({
        ...item,
        txnToken: token,
      }));
      AsyncService.postData(
        "predict/updateAssetOfPrediction",
        updatedPredictData
      )
        .then((updateDataToPredict) => {
          // we have two option first set from api txt_token or take from url
          redirectToExternal(token);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      // console.log('getDataByIds', getDataByIds)
      // Call your API to generate a txn_token
      AsyncService.postData("predict/addTransaction", getDataByIds)
        .then((response) => {
          console.log("addtransaction -response", response);
          redirectToExternal(response?.data); // use the token you got
        })
        .catch((err) => {
          console.log("error", err);
          showError("Something went wrong.");
        });
    }
  };

  useEffect(() => {
    getDownloadProjectById();
    getCreditInfoByCompanyOrBrand();
    if (!tokenModal) {
      getDetailsFromPredictToken();
    }
  }, []);

  const handleRedirectToken = () => {
    setTokenModal(false);
    navigate("/");
  };

  return (
    <MainLayout>
      {isLoading ? (
        <div className="loader-container">
          <SpinnerDefault />
        </div>
      ) : (
        <div className="projectDownloadv1" ref={printRef}>
          {!isLoading &&
            (mergedTrackData?.length > 0 ? (
              mergedTrackData?.map((track, idx) => {
                const localTime = moment
                  .utc(track?.changeTimestamp || track?.newTimestamp)
                  .local();
                const timeAgo = localTime.fromNow();
                return (
                  <div className="campaign-interface" key={track?.id}>
                    <div className="header">
                      <div className="header-left">
                        <span
                          className="back-button"
                          onClick={() => navigate("/projects/")}
                        >
                          <span className="back-arrow">
                            <IconWrapper icon={"Back"} />
                          </span>
                          Back to Projects
                        </span>
                      </div>
                    </div>
                    <div className="project-info">
                      <div className="project-header">
                        <div className="project-icon">
                          <FileIcon />
                        </div>
                        <div className="project-details">
                          <div className="project-title">
                            <h1>{track?.name}</h1>
                            {track?.status === "active" && (
                              <button className="edit-button">
                                <IconWrapper
                                  icon="Edit"
                                  onClick={(e) =>
                                    openEditProjectModal(e, track)
                                  }
                                />
                              </button>
                            )}
                          </div>
                          <ToolTipWrapper title={track?.description}>
                            <p className="project-description">
                              {track?.description || ""}
                            </p>
                          </ToolTipWrapper>
                          <div className="project-meta">
                            <span>
                              Due Date:{" "}
                              {moment(track?.airingDate, "DD/MM/YYYY").format(
                                "DD.MM.YYYY"
                              ) || "-"}
                            </span>
                            <span>Updated {timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`credits-section ${
                          creditRequest === 0 || creditRequest < totalCredits
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="credits-display">
                          <span className="credits-icon">
                            <DollarIcon
                              style={{
                                fill:
                                  creditRequest === 0 ||
                                  creditRequest < totalCredits
                                    ? "red"
                                    : "var(--color-white)",
                                stroke:
                                  creditRequest == 0 ||
                                  creditRequest < totalCredits
                                    ? "red"
                                    : "var(--color-white)",
                              }}
                            />
                          </span>
                          <span className="credits-amount">
                            {creditRequest || 0} tokens
                          </span>
                        </div>
                        <span
                          className="request-credits-btn"
                          onClick={handleRedirect}
                        >
                          Request Tokens
                        </span>
                      </div>
                    </div>
                    <div className="nav-tabs">
                      <div className="customButton">
                        <button
                          className={`toggleBtn ${
                            selected === "Tracks" ? "selectedBtn" : ""
                          }`}
                          onClick={() => setSelected("Tracks")}
                        >
                          <span>Tracks</span>
                        </button>
                        <button
                          className={`toggleBtn ${
                            selected === "Prediction" ? "selectedBtn" : ""
                          }`}
                          onClick={() => {
                            setSelected("Prediction");
                          }}
                        >
                          <span>Prediction Reports</span>
                        </button>
                      </div>
                      <ButtonWrapper
                        className="add-contributors-btn"
                        style={{ cursor: "not-allowed" }}
                        variant="filledSecondary"
                        // onClick={() => setIsAddContributorsOpen(true)}
                      >
                        Add contributors
                      </ButtonWrapper>
                    </div>

                    {selected === "Prediction" ? (
                      <>
                        <PredictionReportPage projectId={projectId} />
                      </>
                    ) : (
                      <>
                        {track?.trackInfo?.length > 0 ? (
                          <div className="tracks-section">
                            <main className="tracks-header">
                              <h2>Your tracks</h2>
                              <Formik
                                initialValues={{
                                  selectedTracks: [],
                                  selectAll: false,
                                  sendToPredictFlag: false,
                                }}
                                enableReinitialize
                              >
                                {({ values, setFieldValue }) => {
                                  console.log("values", values);
                                  const apiTrackIds =
                                    retriveDataFromTokenByAPi?.flatMap((item) =>
                                      Array.isArray(item.tracks)
                                        ? item.tracks
                                        : []
                                    ) || [];
                                  const apiAssetTypes =
                                    retriveDataFromTokenByAPi?.flatMap((item) =>
                                      Array.isArray(item.AssetType)
                                        ? item.AssetType
                                        : []
                                    ) || [];

                                  // unique
                                  const uniqApiTrackIds = [
                                    ...new Set(apiTrackIds),
                                  ];
                                  const uniqApiAssetTypes = [
                                    ...new Set(apiAssetTypes),
                                  ];

                                  // if API has an asset type, only allow that type; otherwise allow any
                                  const allowedAssetType =
                                    uniqApiAssetTypes.length > 0
                                      ? uniqApiAssetTypes[0]
                                      : null;

                                  // compute which trackIds are selectable (not in API and matching asset type if required)
                                  const selectableIdsAll = (
                                    track?.trackInfo || []
                                  )
                                    .filter((t) => {
                                      const notInApi = !uniqApiTrackIds.some(
                                        (id) => id.trackId === t.facetTrackId
                                      ); // exclude API IDs

                                      const assetOk = allowedAssetType
                                        ? t.asset_type_id === allowedAssetType
                                        : true;

                                      return notInApi && assetOk;
                                    })
                                    .map((t) => ({
                                      trackId: t.facetTrackId,
                                      algoliaId: t.objectID, // or t.objectId — depends on your data key
                                    }));

                                  // ---- handleSelectAll: select only selectableIdsAll, or clear
                                  const handleSelectAll = (e) => {
                                    const isChecked = e.target.checked;
                                    setFieldValue("selectAll", isChecked);

                                    if (isChecked) {
                                      setFieldValue(
                                        "selectedTracks",
                                        selectableIdsAll
                                      );
                                    } else {
                                      // clear everything (unselect)
                                      setFieldValue("selectedTracks", []);
                                    }
                                  };

                                  // ---- sync selectAll when user checks/unchecks individual boxes
                                  useEffect(() => {
                                    // recompute selectableIds (in case track or API changed)
                                    const selectableIds =
                                      selectableIdsAll || [];

                                    const isAllSelected =
                                      selectableIds.length > 0 &&
                                      values.selectedTracks.length ===
                                        selectableIds.length;

                                    // set selectAll only when it differs (prevents infinite loop)
                                    if (values.selectAll !== isAllSelected) {
                                      setFieldValue("selectAll", isAllSelected);
                                    }

                                    // optional: compute sendToPredictFlag (your existing asset-type check)

                                    console.log(
                                      "selectedTracks",
                                      values.selectedTracks
                                    );
                                    const selectedAssetTypes =
                                      (track?.trackInfo || [])
                                        ?.filter((t) =>
                                          values.selectedTracks.some(
                                            (item) =>
                                              item.trackId === t.facetTrackId
                                          )
                                        )
                                        ?.map((t) => t.asset_type_id) || [];
                                    console.log(
                                      "selectedAssetTypes",
                                      selectedAssetTypes
                                    );
                                    // const selectedAssetTypes = (
                                    //   track?.trackInfo || []
                                    // )
                                    //   .filter((t) =>
                                    //     values.selectedTracks.includes(
                                    //       t.trackId
                                    //     )
                                    //   )
                                    //   .map((t) => t.asset_type_id);

                                    const allSelectedSameType =
                                      selectedAssetTypes.length > 0 &&
                                      selectedAssetTypes.every(
                                        (id) => id === selectedAssetTypes[0]
                                      );
                                    console.log(
                                      "allSelectedSameType",
                                      allSelectedSameType
                                    );
                                    setFieldValue(
                                      "sendToPredictFlag",
                                      allSelectedSameType
                                    );
                                    // include dependencies that affect selectableIds or selection
                                  }, [
                                    values.selectedTracks,
                                    retriveDataFromTokenByAPi,
                                    track?.trackInfo,
                                    setFieldValue,
                                  ]);

                                  const maxSelectable = 10;
                                  const apiTrackIdsSel =
                                    retriveDataFromTokenByAPi?.flatMap((item) =>
                                      Array.isArray(item.tracks)
                                        ? item.tracks
                                        : []
                                    ) || [];
                                  console.log("apiTrackIdsSel", apiTrackIdsSel);
                                  const remainingSelectable =
                                    maxSelectable - apiTrackIdsSel.length || 0;

                                  const canSendToPredict =
                                    values?.selectedTracks?.length > 0 &&
                                    values?.selectedTracks?.length <=
                                      remainingSelectable &&
                                    values?.sendToPredictFlag &&
                                    creditRequest > 0;
                                  console.log(
                                    "values?.selectedTracks",
                                    values?.selectedTracks
                                  );
                                  console.log(
                                    "values?.sendToPredictFlag",
                                    values?.sendToPredictFlag
                                  );
                                  return (
                                    <>
                                      <div className="tracks-controls">
                                        <label className="select-all">
                                          <CheckboxWrapper
                                            name="selectAll"
                                            checked={values.selectAll}
                                            onChange={handleSelectAll}
                                          />
                                          Select All
                                        </label>
                                        <ButtonWrapper
                                          variant="filledSecondary"
                                          disabled={!canSendToPredict}
                                          onClick={() =>
                                            handleCallPrdictAPi(
                                              values?.selectedTracks,
                                              track?.trackInfo
                                            )
                                          }
                                        >
                                          Add to Prediction
                                        </ButtonWrapper>
                                      </div>

                                      {track?.trackInfo?.map(
                                        (tracksInfo, idx) => {
                                          const trackId =
                                            tracksInfo?.facetTrackId;
                                          const AssetType =
                                            tracksInfo?.asset_type_id;
                                          const isChecked =
                                            values.selectedTracks.some(
                                              (item) => item.trackId === trackId
                                            );

                                          let tooltipMsg = "";

                                          const isMatch = Boolean(
                                            Array.isArray(
                                              retriveDataFromTokenByAPi
                                            ) &&
                                              retriveDataFromTokenByAPi.length >
                                                0 &&
                                              (!retriveDataFromTokenByAPi.some(
                                                (item) =>
                                                  item.AssetType?.includes(
                                                    AssetType
                                                  )
                                              ) ||
                                                retriveDataFromTokenByAPi.some(
                                                  (item) =>
                                                    item.trackIds?.includes(
                                                      trackId
                                                    )
                                                ))
                                          );

                                          if (
                                            Array.isArray(
                                              retriveDataFromTokenByAPi
                                            ) &&
                                            retriveDataFromTokenByAPi.length ===
                                              0
                                          ) {
                                            tooltipMsg = "";
                                          } else if (
                                            retriveDataFromTokenByAPi.length >
                                              0 &&
                                            !retriveDataFromTokenByAPi.some(
                                              (item) =>
                                                item.AssetType?.includes(
                                                  AssetType
                                                )
                                            )
                                          ) {
                                            tooltipMsg =
                                              (
                                                <FormattedMessage id="trackDetail.dowloadWAV.DifferentType" />
                                              ) || "Different asset type";
                                          } else if (
                                            retriveDataFromTokenByAPi.length >
                                              0 &&
                                            retriveDataFromTokenByAPi.some(
                                              (item) =>
                                                item.trackIds?.includes(trackId)
                                            )
                                          ) {
                                            tooltipMsg =
                                              (
                                                <FormattedMessage id="trackDetail.dowloadWAV.AlreadySelected" />
                                              ) || "Already selected";
                                          }

                                          return (
                                            <>
                                              <div
                                                key={trackId}
                                                className="selectAll_tracks"
                                              >
                                                <Tooltip
                                                  title={tooltipMsg}
                                                  slotProps={{
                                                    popper: {
                                                      sx: {
                                                        "& .MuiTooltip-tooltip":
                                                          {
                                                            backgroundColor:
                                                              "#333",
                                                            color: "#fff",
                                                            fontSize: "14px",
                                                            borderRadius: "8px",
                                                            padding: "8px 12px",
                                                          },
                                                      },
                                                    },
                                                  }}
                                                >
                                                  <label
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: "8px",
                                                    }}
                                                  >
                                                    <CheckboxWrapper
                                                      name="selectedTracks"
                                                      value={trackId}
                                                      checked={isChecked}
                                                      disabled={isMatch}
                                                      onChange={(e) => {
                                                        const isChecked =
                                                          e.target.checked;

                                                        let updatedTracks = [
                                                          ...values.selectedTracks,
                                                        ];

                                                        if (isChecked) {
                                                          const exists =
                                                            updatedTracks.some(
                                                              (item) =>
                                                                item.trackId ===
                                                                trackId
                                                            );

                                                          if (!exists) {
                                                            updatedTracks.push({
                                                              trackId: trackId,
                                                              algoliaId:
                                                                tracksInfo?.objectId ??
                                                                "",
                                                            });
                                                          }
                                                        } else {
                                                          updatedTracks =
                                                            updatedTracks.filter(
                                                              (item) =>
                                                                item.trackId !==
                                                                trackId
                                                            );
                                                        }

                                                        setFieldValue(
                                                          "selectedTracks",
                                                          updatedTracks
                                                        );
                                                      }}

                                                      // onChange={(e) => {
                                                      //   const checked =
                                                      //     e.target.checked;
                                                      //   if (checked) {
                                                      //     setFieldValue(
                                                      //       "selectedTracks",
                                                      //       [
                                                      //         ...values.selectedTracks,
                                                      //         trackId,
                                                      //       ]
                                                      //     );
                                                      //   } else {
                                                      //     setFieldValue(
                                                      //       "selectedTracks",
                                                      //       values.selectedTracks.filter(
                                                      //         (id) =>
                                                      //           id !== trackId
                                                      //       )
                                                      //     );
                                                      //   }
                                                      // }}
                                                    />
                                                  </label>
                                                </Tooltip>

                                                <TrackList
                                                  details={tracksInfo}
                                                  handleChangeCredit={
                                                    handleChangeCredit
                                                  }
                                                  index={idx}
                                                  creditValue={creditValue}
                                                  projectId={track?.id}
                                                  facetTrackId={
                                                    tracksInfo?.facetTrackId
                                                  }
                                                  sonicTrackId={
                                                    tracksInfo?.sonichub_track_id
                                                  }
                                                  algoliaId={
                                                    tracksInfo?.objectId
                                                  }
                                                  status={track?.status}
                                                  audioType={track?.audioType}
                                                  newData={
                                                    getDownloadProjectById
                                                  }
                                                  loading={creditLoading}
                                                  downloadedTracks={
                                                    track?.downloaded_trackids
                                                  }
                                                  handleChangeForSocialMedia={
                                                    handleChangeForSocialMedia
                                                  }
                                                  track_mediatypes={
                                                    tracksInfo?.track_mediatypes
                                                  }
                                                  track_type_id={
                                                    tracksInfo?.track_type_id
                                                  }
                                                />
                                              </div>
                                            </>
                                          );
                                        }
                                      )}
                                    </>
                                  );
                                }}
                              </Formik>
                            </main>
                            <div className="footer">
                              {!creditLoading &&
                              totalCredits > creditRequest ? (
                                <div className="requestCredit_selection">
                                  <div className="requestCredit_warning">
                                    <span>⚠️ You’re Out of Tokens</span>
                                    <p>
                                      You don’t have enough tokens in your
                                      wallet to download this asset. To
                                      continue, please request more tokens or
                                      contact your team admin.
                                    </p>
                                  </div>
                                  <div className="request_btnContainer">
                                    <ButtonWrapper
                                      variant="outlined"
                                      // onClick={() => setOpen(false)}
                                    >
                                      Cancel
                                    </ButtonWrapper>
                                    <ButtonWrapper variant="filled">
                                      {/* <FormattedMessage id="trackDetail.dowloadWAV.accept" /> */}
                                      Request Credits
                                    </ButtonWrapper>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    width: "40%",
                                  }}
                                />
                              )}

                              <div className="total-credits">
                                <span className="credits-amount">
                                  <span>Total</span> {totalCredits} Tokens
                                </span>
                                <ButtonWrapper
                                  className="download-btn isPrintDisable"
                                  disabled={
                                    track?.status === "completed"
                                      ? true
                                      : totalCredits > creditRequest
                                      ? true
                                      : hasInvalidSocialMedia
                                      ? true
                                      : false
                                  }
                                  onClick={() =>
                                    track?.status === "completed"
                                      ? handleDownloadFiles()
                                      : setOpen(true)
                                  }
                                >
                                  <span className="download-icon">
                                    <Download />
                                  </span>
                                  Download
                                </ButtonWrapper>
                                {hasInvalidSocialMedia && (
                                  <div style={{ color: "red" }}>
                                    <FormattedMessage id="trackDetail.dowloadWAV.selectSocialMedia" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="noTrackFound">
                            <h3 className="no_filtered_data_text">
                              No tracks yet
                            </h3>
                            <ButtonWrapper
                              variant="filledSecondary"
                              onClick={() => navigate("/AISearchScreen")}
                            >
                              <SimilarityBlack
                                style={{
                                  marginRight: "5px",
                                }}
                              />
                              Browse Tracks
                            </ButtonWrapper>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <h3 className="no_filtered_data_text">No projects found!</h3>
            ))}
          <SimpleDialog
            open={open}
            setOpen={setOpen}
            downloadHandler={handleDownloadFiles}
            loader={isLoading}
          />
          <DownloadCompleted open={isDownloaded} setOpen={setIsDownloaded} />
          <EditProjectInfoModal
            editProjectInfo={editProjectInfo}
            onClose={() =>
              setEditProjectInfo({ ...editProjectInfo, isOpen: false })
            }
            getNewProjects={getDownloadProjectById}
            cameFromProjectID={true}
          />
          <AddContributors
            open={isAddContributorsOpen}
            setOpen={setIsAddContributorsOpen}
            // projectDisplayName={mergedTrackData[0]?.name}
          />
          <TokenNotValidModal open={tokenModal} close={handleRedirectToken} />
        </div>
      )}
    </MainLayout>
  );
}

export default ProjectDownloadV1;
