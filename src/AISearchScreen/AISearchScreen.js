import { useCallback, useEffect, useRef, useState } from "react";
import MainLayout from "./../common/components/MainLayout/MainLayout";
import "./AISearchScreen.css";
import AlgoliaSearchBox from "./Components/AlgoliaSearchBox/AlgoliaSearchBox";
import { SET_CYANITE_IDSMGT } from "../redux/constants/actionTypes";
import { ReactComponent as SearchIcon } from "../static/search2.0.svg";
import { ReactComponent as SimilaritySearch } from "../static/SonicSimilaritySearch.svg";
import { ReactComponent as WhiteSearch } from "../static/white-search.svg";
import { ReactComponent as SimilarityBlack } from "../static/SimSearchBlack.svg";
import { ReactComponent as LinkIcon } from "../static/linkIcon.svg";
import { ReactComponent as Upload } from "../static/Upload.svg";
import { ReactComponent as AddDocument } from "../static/AddDocument.svg";
import ChipWrapper from "../branding/componentWrapper/ChipWrapper";
import { useDispatch, useSelector } from "react-redux";
import { showError } from "../redux/actions/notificationActions";
import { setAiMusicGenerator } from "../redux/actions/AIMusicGenerator/aiMusicGenerator";
import aiAnalysisApiRequest from "../AISearch/Services/AiAnalysisApiRequest/aiAnalysisApiRequest";
import fileUpload from "../AISearch/Services/FileUpload/fileUpload";
import { localStorageCommonAISearch } from "../AISearch/Services/localStorageCommonAISearch";
import AsyncService from "../networking/services/AsyncService";
import { useClearRefinements } from "react-instantsearch";
import { getUserMeta } from "../common/utils/getUserAuthMeta";
import CustomLoader from "../common/components/csCustomLoader/CustomLoader";
import { useLocation, useSearchParams } from "react-router-dom";

// adjust path if needed

const videoTypes = [
  "video/mp4",
  "video/avi",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
  "video/mpeg",
];

const AISearchScreen = (sepectedSearch) => {
  const location = useLocation();
  const { type, trackData } = location.state || {};

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const predictData = useSelector((state) => state.predict.data);

  const [selected, setSelected] = useState(
    type === "similarity" ? "similarity" : "ai"
  );
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const linkWrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const [processPercent, setProcessPercent] = useState(0);
  const [pollingID, setPollingID] = useState(null);
  const [pollingModal, setPollingModal] = useState(false);
  const [algoliaFilterMGT, setAlogoliaFilterMGT] = useState(null);
  //const [cyaniteIdsMGT, setCyaniteIdsMGT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refine: clearAll } = useClearRefinements();
  const acceptTypeRef = useRef("video/mp4,video/quicktime");
  const dispatch = useDispatch();
  const { aiMusicGenerator } = useSelector((state) => state.aiMusicGenerator);
  const { brandName, brandId, email, userId } = getUserMeta();
  const pollIntervalRef = useRef(null);

  const openFilePicker = (acceptType) => {
    acceptTypeRef.current = acceptType;
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("accept", acceptType);
      fileInputRef.current.click();
    }
  };
  const setBaseFilterFn = () => {
    //alert("called");
    setAlogoliaFilterMGT(null);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const accept = fileInputRef.current.getAttribute("accept");
    const isPDF = file.type === "application/pdf";
    const isVideo =
      file.type === "video/mp4" || file.type === "video/quicktime";

    const isValid =
      accept === ".pdf"
        ? isPDF
        : accept === "video/mp4,video/quicktime"
        ? isVideo
        : false;

    if (!isValid) {
      if (accept === ".pdf") {
        dispatch(showError("Only .pdf file supported!"));
      } else if (accept === "video/mp4,video/quicktime") {
        dispatch(showError("Only .mp4 or .mov video files supported!"));
      } else {
        dispatch(showError("Invalid file type selected!"));
      }

      e.target.value = null; // reset input
      return;
    }

    // If valid, add to chips
    setSelectedFiles((prev) => [...prev, file]);
    e.target.value = null; // reset so same file can be picked again
    setShowLinkModal(false);
  };

  const removeFile = (filename) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== filename));
  };

  useEffect(() => {
    const handleClickOutsideLink = (event) => {
      if (
        linkWrapperRef.current &&
        !linkWrapperRef.current.contains(event.target)
      ) {
        setShowLinkModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideLink);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLink);
    };
  }, []);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsLoading(false);
  };

  function buildAlgoliaFilter(data) {
    const filters = [];

    if (data?.mood) {
      filters.push(`amp_all_mood_tags.tag_names:"${data.mood}"`);
    }
    if (data?.genre) {
      filters.push(`amp_genre_tags.tag_names:"${data.genre}"`);
    }
    if (data?.tempo) {
      filters.push(`tag_tempo:"${data.tempo}"`);
    }

    return filters.length > 0 ? `(${filters.join(" AND ")})` : "";
  }

  const pollForStatus = useCallback(
    (id) => {
      if (!id) return;
      setIsLoading(true);
      // stopPolling(); // clear any old polling

      pollIntervalRef.current = setInterval(() => {
        AsyncService.loadData(`ai_search/getAmpTagData/${id}`)
          .then((response) => {
            console.log("ai_search/getAmpTagData", response);

            if (response.data.status === "completed") {
              if (response.data.mediatype == 4) {
                console.log(
                  "AI Search Completed",
                  response.data.sourceAudioIDs,
                  response?.data?.mood
                );
                if (response.data.mood) {
                  console.log("AI Search --Taxonomy Search", response.data);
                  setAlogoliaFilterMGT(
                    `(${[
                      `amp_all_mood_tags.tag_names:"${response?.data?.mood}"`,
                      `amp_genre_tags.tag_names:"${response?.data?.genre}"`,
                      `tag_tempo:"${response?.data?.tempo}"`,
                    ].join(" AND ")})`
                  );

                  console.log(
                    "buildAlgoliaFilter(response?.data)",
                    buildAlgoliaFilter(response?.data)
                  );
                  // setAlogoliaFilterMGT(buildAlgoliaFilter(response?.data))
                  stopPolling();
                } else {
                  console.log("AI Search --Cyanite Search", response.data);
                  console.log(
                    "AI Search Completed",
                    response.data.sourceAudioIDs
                  );
                  console.log("AI Search Completed", response?.data?.trackData);

                  //we will be getting single list here from new api

                  let list1 = response.data.trackData
                    .substring(1, response.data.trackData.length - 1)
                    .split(",");

                  if (response.data.trackData) {
                    const trackDataArray = JSON.parse(response.data.trackData);

                    // ✅ set state
                    //setCyaniteIdsMGT(trackDataArray);
                    dispatch({
                      type: SET_CYANITE_IDSMGT,
                      payload: trackDataArray,
                    });
                  }
                  /* let list2 = response.data.trackData
                    .substring(1, response.data.trackData.length - 1)
                    .split(","); 

                  let cyanite_id_list = [...list1, ...list2];  
                    */

                  let cyanite_id_list = [...list1];

                  console.log("Full list ", cyanite_id_list);
                  let cyanite_id_list_algolia = cyanite_id_list
                    .map((id) => `cyanite_id:"${id}"`)
                    .join(" OR ");
                  console.log("Full list algolia ", cyanite_id_list_algolia);
                  //let cyanite_id_lsit_with_defaultparams = `(${cyanite_id_list_algolia}) AND brands_assigned:${brandId} AND analysis_status:1`;
                  let cyanite_id_lsit_with_defaultparams = `(${cyanite_id_list_algolia})`;
                  console.log(
                    "Full list with default params ",
                    cyanite_id_lsit_with_defaultparams
                  );
                  setAlogoliaFilterMGT(cyanite_id_lsit_with_defaultparams);
                  stopPolling();
                }
              } else {
                console.log("media type", response.data.mediatype);
                console.log("media type", response.data);
                if (response.data.mood) {
                  console.log("AI Search --Video/Brief", response.data);
                  /* setAlogoliaFilterMGT(
                  `(${[
                    `amp_all_mood_tags.tag_names:"${response?.data?.mood}"`,
                    `amp_genre_tags.tag_names:"${response?.data?.genre}"`,
                    `tag_tempo:"${response?.data?.tempo}"`
                  ].join(" AND ")}) AND brands_assigned:${brandId} AND analysis_status:1`
                ); */
                  setAlogoliaFilterMGT(
                    `(${[
                      `amp_all_mood_tags.tag_names:"${response?.data?.mood}"`,
                      `amp_genre_tags.tag_names:"${response?.data?.genre}"`,
                      `tag_tempo:"${response?.data?.tempo}"`,
                    ].join(" AND ")})`
                  );
                  stopPolling();
                }
              }

              /* setAlogoliaFilterMGT(
              `(${[
                `amp_all_mood_tags.tag_names:"${response?.data?.mood}"`,
                `amp_genre_tags.tag_names:"${response?.data?.genre}"`,
                `tag_tempo:"${response?.data?.tempo}"`
              ].join(" OR ")}) AND brands_assigned:${brandId} AND analysis_status:1`
            ); 
            stopPolling();*/
            }
            // else if (response.data.status === "brief_completed") {
            //   const parseData = JSON.parse(response?.data?.trackData) || []
            //   stopPolling();
            //   if (parseData?.length === 0) return
            //   const cyaniteId = parseData?.map((id) => `cyanite_id:"${id}"`).join(" OR ");
            //   setAlogoliaFilterMGT(cyaniteId)
            // }
            else if (["failed", "bad_request"].includes(response.data.status)) {
              dispatch(showError("Something went wrong"));
              stopPolling();
            }
          })
          .catch((err) => {
            if (err.name === "CanceledError") {
              console.log("Polling request aborted");
            } else {
              dispatch(showError("Something went wrong"));
            }
            stopPolling();
          });
      }, 3000);
    },
    [selectedFiles]
  );

  const uploadFileFunction = useCallback(
    (selectedFiles) => {
      setIsLoading(true);

      // setOpen(true);
      console.log("selectedFiles", selectedFiles);

      if (!selectedFiles) {
        console.error("Error: No file selected!");
        return;
      }

      var formdata = new FormData();
      formdata.append("file", selectedFiles);
      const configMeta = {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProcessPercent(percentage);
        },
      };

      fileUpload({
        formdata,
        configMeta,
        onSuccess: (fileResponse) => {
          // setOpen(false);
          let data = {
            fileName: fileResponse?.data,
            mediatype: videoTypes?.includes(selectedFiles?.type)
              ? 1
              : selectedFiles?.type === "application/pdf"
              ? 3
              : 4,
            inputText: fileResponse?.data,
          };

          aiAnalysisApiRequest({
            data,
            onSuccess: (Response) => {
              console.log("Initial Response", Response);

              const id = Response?.data?.id;
              const status = Response?.data?.status;

              // Store config
              localStorageCommonAISearch("AISearchConfig", { aiSearchId: id });

              // Start polling if not completed
              if (status !== "completed") {
                setIsLoading(true);
                pollForStatus(id);
              } else {
                setIsLoading(false);
                // setBrief(Response.data?.description);
              }
            },
            onError: (error) => {
              console.log("Initial upload error", error);
              setIsLoading(false);
              setPollingModal(false);
              dispatch(setAiMusicGenerator({ isLoading: false }));
            },
          });
        },
        onError: (error) => {
          console.log("Error Uploading Video", error);
          setIsLoading(false);
          dispatch(
            setAiMusicGenerator({
              isLoading: false,
            })
          );
          // setOpen(false);
          dispatch(showError("File upload failed!"));
          setPollingModal(false);
        },
      });
    },
    [selectedFiles]
  );

  const handleSubmit = useCallback(
    (values) => {
      setIsLoading(true);

      let data = {
        fileName: null,
        mediatype: 4,
        inputText: aiMusicGenerator?.query?.replace(/(\r|\n|\\r|\\n)/g, " "),
      };

      // if (values?.mediaFile) {
      //   uploadFileFunction(selectedFiles[0]);
      // } else {
      aiAnalysisApiRequest({
        data,
        onSuccess: (Response) => {
          if (Response?.status === 200) {
            setIsLoading(true);
            pollForStatus(Response?.data?.id);
          }
        },
        onError: (error) => {
          console.log("Error Uploading Video", error);
          dispatch(
            setAiMusicGenerator({
              isLoading: false,
            })
          );
        },
      });
      // }
    },
    [aiMusicGenerator?.query]
  );

  return (
    <MainLayout>
      <div className="AISearchScreenContainer">
        {/* Toggle Buttons */}
        <div className="AISearchHeader">
          <div className="AISearchButtons">
            <button
              className={`toggleBtn ${selected === "ai" ? "selectedBtn" : ""}`}
              onClick={() => setSelected("ai")}
            >
              {selected === "ai" ? (
                <SearchIcon className="SearchIcon" />
              ) : (
                <WhiteSearch className="SearchIcon" />
              )}
              <span>AI Search</span>
            </button>
            <button
              className={`toggleBtn ${
                selected === "similarity" ? "selectedBtn" : ""
              }`}
              onClick={() => setSelected("similarity")}
            >
              {selected === "similarity" ? (
                <SimilarityBlack className="SimilarityIcon" />
              ) : (
                <SimilaritySearch className="SimilarityIcon" />
              )}
              <span>Similarity Search</span>
            </button>
          </div>

          {/* Upload Buttons */}
          {selected === "ai" && (
            <div className="linkWrapper" ref={linkWrapperRef}>
              <button
                className="linkIconbtn"
                onClick={() => setShowLinkModal((prev) => !prev)}
                disabled={selectedFiles?.length > 0}
              >
                <LinkIcon className="LinkIcon" />
              </button>

              {showLinkModal && (
                <div className="LinkModal">
                  <button
                    className="modalIconbtn"
                    onClick={() => openFilePicker("video/mp4,video/quicktime")}
                  >
                    <Upload className="UploadIcon" />
                    <span>Upload Video</span>
                  </button>
                  <div className="modalDivider" />
                  <button
                    className="modalIconbtn"
                    onClick={() => openFilePicker(".pdf")}
                  >
                    <AddDocument className="AddDocumentIcon" />
                    <span>Attach Brief</span>
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Hidden File Input */}
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* File Chips */}
          <div className="fileInputContainer">
            {selectedFiles.map((file) => (
              <ChipWrapper
                key={file.name}
                className="fileInputContainer_chip"
                label={`File: ${
                  file.name.length > 35
                    ? `${file.name.slice(0, 30)}...`
                    : file.name
                }`}
                onClose={() => {
                  removeFile(file.name);
                  console.log("called");
                  stopPolling();
                  console.log("new called");
                  setAlogoliaFilterMGT(null);
                  clearAll();
                  dispatch({ type: SET_CYANITE_IDSMGT, payload: [] });
                }}
              />
            ))}
          </div>
        </div>

        {/* Search Panels */}
        {/* {algoliaFilterMGT && (
          <Configure filters={algoliaFilterMGT} hitsPerPage={60} />
        )} */}

        <div className="SearchBarContainer">
          <AlgoliaSearchBox
            selected={selected}
            algoliaFilterMGT={algoliaFilterMGT}
            setSelected={setSelected} // 🔥 pass setter down
            onFileDrop={(file) => setSelectedFiles((prev) => [...prev, file])}
            selectedFiles={selectedFiles}
            isLoading={isLoading}
            stopPolling={() => stopPolling()}
            handleUploadVideoBriefToTXt={() => {
              if (selectedFiles?.length > 0) {
                uploadFileFunction(selectedFiles[0]);
              } else {
                handleSubmit();
              }
            }}
            setBaseFilter={() => {
              setBaseFilterFn();
            }}
            trackData={trackData}
          />
        </div>
      </div>
      {isLoading && <CustomLoader stopPolling={() => stopPolling()} />}
    </MainLayout>
  );
};

export default AISearchScreen;
