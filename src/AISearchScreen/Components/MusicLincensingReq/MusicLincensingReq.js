import React, { useRef, useState, useEffect } from "react";
import "./MusicLincensingReq.css";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import Projectinfo from "./Projectinfo/Projectinfo";
import Trackdetails from "./Trackdetails/Trackdetails";
import ContextandUse from "./ContextandUse/ContextandUse";
import BudgetandTimeline from "./BudgetandTimeline/BudgetandTimeline";
import Contactinfo from "./Contactinfo/Contactinfo";
import Confirmandsub from "./Confirmandsub/Confirmandsub";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { ReactComponent as FormIcon } from "../../../static/Project.svg";
import {
  resetMusicLicensingReq,
  setMusicLicensingReq,
} from "../../../redux/actions/MusicLicensingReq/MusicLicensingReq";
import { useDispatch, useSelector } from "react-redux";
import AsyncService from "../../../networking/services/AsyncService";
import { useLocation, useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const MusicLincensingReq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formikRef = useRef();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageFromURL = Number(queryParams.get("page")) || 1;
  const idFromURL = queryParams.get("id") || 0;

  const [activeStep, setActiveStep] = useState(pageFromURL);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackId1, settrackId1] = useState(false);
  const [ID, setID] = useState(idFromURL);
  const [projectID, setProjectID] = useState(0);
  const [isStepValid, setIsStepValid] = useState(true);

  const { trackId, requestTrack } = location.state || {};

  const musicLicensincgFormData = useSelector(
    (state) => state.musicLicensingForm
  );
  console.log("requestTrack", trackId);

  useEffect(() => {
    settrackId1(trackId);
    if (requestTrack) {
      dispatch(
        setMusicLicensingReq({
          key: "trackDetails",
          values: {
            ...musicLicensincgFormData.trackDetails,
            requestTrack: requestTrack,
          },
        })
      );
    }
  }, [requestTrack]);

  const cancleForm = () => {
    dispatch(resetMusicLicensingReq());
    navigate("/AISearchScreen")
  }

  useEffect(() => {
    navigate(`/MusicLincensingReq?id=${ID}&page=${activeStep}`, {
      replace: true,
    });
  }, [activeStep, ID]);

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    const idFromHash = params.get("id");

    // Prevent duplicate fetching
    const currentFormId = musicLicensincgFormData.projectInformation?.id;
    const isDifferentId = String(idFromHash) !== String(currentFormId);

    if (isDifferentId && idFromHash != null && idFromHash !== "0") {
      dispatch(resetMusicLicensingReq());

      const fetchData = async () => {
        try {
          const response = await AsyncService.loadData(
            `/vendorlicense/${idFromHash}`
          );
          const metadata = response.data?.projectInfo; // adjust to your backend structure

          if (metadata) {
            Object.entries(metadata).forEach(([key, values]) => {
              if (!key || key.trim() === "") return;
              const processedValues = { ...values, id: response.data.id };

              dispatch(
                setMusicLicensingReq({
                  key,
                  values: processedValues,
                })
              );
            });

            setID(response.data.id);
          }
        } catch (error) {
          console.error("Failed to fetch licensing data", error);
        }
      };

      if (idFromHash != 0) {
        fetchData();
      }
    }
  }, [window.location.hash]);

  const goToPreviousStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleConfirmationSubmit = () => {
    setShowConfirmation(false);
    setActiveStep(5);
    dispatch(resetMusicLicensingReq());
    navigate("/AISearchScreen");
  };

  const goToNextStep = async () => {
    if (formikRef.current) await formikRef.current.submitForm();
  };

  const handleStepSubmit = async (values) => {
    let key = "";

    switch (activeStep) {
      case 1:
        key = "projectInformation";
        break;
      case 2:
        key = "trackDetails";
        break;
      case 3:
        key = "contextAndUsage";
        break;
      case 4:
        key = "budgetAndTimeline";
        break;
      case 5:
        key = "contactInformation";
        break;
      default:
        break;
    }

    // Merge Redux data with Formik values
    let newStepValues = {
      ...musicLicensincgFormData[key],
      ...values,
    };

    // Merge uploaded files for trackDetails and contextAndUsage
   if (key === "trackDetails" || key === "contextAndUsage") {
  const existingFiles =
    musicLicensincgFormData[key]?.mediaFile?.filter(Boolean) || [];
  const newFiles = Array.isArray(values.mediaFile)
    ? values.mediaFile.filter(Boolean)
    : [];

  // Determine if we are editing (existing record already has an ID)
  const isEditing = !!ID && ID !== 0;

  if (isEditing) {
    // 🧩 In edit mode: only keep new files that are not already in existingFiles
    const uniqueNewFiles = newFiles.filter((newFile) => {
      const newName =
        typeof newFile === "string"
          ? newFile.toLowerCase()
          : newFile.name.toLowerCase();

      // Return true if this file doesn't already exist by name
      return !existingFiles.some((oldFile) => {
        const oldName =
          typeof oldFile === "string"
            ? oldFile.toLowerCase()
            : oldFile.name.toLowerCase();
        return oldName === newName;
      });
    });

    // Merge existing + only unique new ones
    newStepValues.mediaFile = [...existingFiles, ...uniqueNewFiles];
  } else {
    // 🧱 In create mode: merge all but remove duplicates
    const mergedFilesMap = new Map();

    existingFiles.forEach((f) =>
      mergedFilesMap.set(
        typeof f === "string" ? f.toLowerCase() : f.name.toLowerCase(),
        f
      )
    );
    newFiles.forEach((f) =>
      mergedFilesMap.set(
        typeof f === "string" ? f.toLowerCase() : f.name.toLowerCase(),
        f
      )
    );

    newStepValues.mediaFile = Array.from(mergedFilesMap.values());
  }
}


    // Update Redux for current step
    dispatch(setMusicLicensingReq({ key, values: newStepValues }));

    // Prepare payload for backend
    const updatedData = {
      ...musicLicensincgFormData,
      [key]: newStepValues,
    };

    let ProID =0;

 if (activeStep === 1 && (!projectID || projectID === 0)) {
  try {
    // Get current date in "DD/MM/YYYY" format
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB"); // e.g. "12/11/2025"

    // Get project name safely from form values
    const projectName =
      values?.projectName ||
      values?.name ||
      musicLicensincgFormData.projectInformation?.projectName ||
      "Untitled Project";

    // ✅ New payload
    const createPayload = {
      name: projectName,
      status: "active",
      airingDate: formattedDate,
      airingCountry: null,
      description: null,
      audioType: [],
      projectCreatedFor: 3,
    };

    

    const createResponse = await AsyncService.postData(
      "/project/addProject",
      createPayload
    );

    const newID = createResponse.data?.id || createResponse.data;
    setID(newID);
    console.log("newID", newID?.projectId);
    setProjectID(newID?.projectId)
    ProID = newID?.projectId;
    dispatch(
      setMusicLicensingReq({
        key: "projectInformation",
        values: { ...newStepValues, id: newID },
      })
    );

    console.log("✅ Created new record with ID:", newID);
  } catch (error) {
    console.error("❌ Error creating record:", error);
  }
}


    const updatedPayload = {
      id: ID,
      projectInfo: updatedData,
      status: activeStep === 6 ? "submitted" : "submission_inprogress",
      spotifyId: trackId1,
      projectId:projectID ||ProID

    };
    const trackFiles =
  musicLicensincgFormData?.trackDetails?.mediaFile?.filter(Boolean) || [];

const contextFiles =
  musicLicensincgFormData?.contextAndUsage?.mediaFile?.filter(Boolean) || [];

// Save into ONE field
updatedPayload.usageFile = [...trackFiles, ...contextFiles];

    if (updatedPayload.projectInfo[""]) {
  delete updatedPayload.projectInfo[""];
}

    try {
      const response = await AsyncService.postData(
        "/vendorlicense",
        updatedPayload
      );
      const returnedID = response.data;

      setID(returnedID);

      // Update Redux with returned ID only for first step
      const valuesToDispatch =
        key === "projectInformation"
          ? { ...newStepValues, id: returnedID }
          : newStepValues;

      dispatch(
        setMusicLicensingReq({
          key,
          values: valuesToDispatch,
        })
      );
    } catch (err) {
      console.error("Error updating step data:", err);
    }
    if (activeStep === 6) {
      setShowConfirmation(true);
      return;
    }

    setActiveStep(activeStep + 1);
  };

  const menuList = [
    {
      id: 1,
      label: "Project information",
      component: (
        <Projectinfo formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
    {
      id: 2,
      label: "Track Details",
      component: (
        <Trackdetails formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
    {
      id: 3,
      label: "Context & Usage",
      component: (
        <ContextandUse formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
    {
      id: 4,
      label: "Budget & Timeline",
      component: (
        <BudgetandTimeline formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
    {
      id: 5,
      label: "Contact information",
      component: (
        <Contactinfo formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
    {
      id: 6,
      label: "Confirm & Submit",
      component: (
        <Confirmandsub
          formikRef={formikRef}
          onSubmit={handleStepSubmit}
          setActiveStep={setActiveStep}
        />
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{display:"flex",flexDirection:"column",gap:"50px"}}>
         <div className="music-lincensing-heading">
          <FormIcon className='music-lincensing-logo'/>
          <span style={{ marginLeft: "15px" }}>
            Music Licensing Request Form
          </span>
        </div>
        <div className="music-lincensing-req-container">
       
        {/* <div > */}
          <div className="sidebar">
            {menuList.map((step, index) => {
              const isActive = step.id === activeStep;
              const isDone = step.id < activeStep;
              return (
                <div key={step.id} className="step-row">
                  <div
                    className={`step-icon ${
                      isActive ? "active" : isDone ? "done" : ""
                    }`}
                  >
                    {isActive && <div className="inner-circle" />}
                    {isDone && <span className="checkmark">&#10003;</span>}
                  </div>
                  <div
                    className={`step-label ${
                      isActive ? "active-label" : "inactive-label"
                    }`}
                  >
                    {step.label}
                  </div>
                  {index !== menuList.length - 1 && (
                    <div className="step-line" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="content-area">
            {menuList.find((step) => step.id === activeStep)?.component}

            {activeStep <= menuList.length && (
              <div className="btn_container">
                {
                  activeStep === 1?  <ButtonWrapper
                  variant="filled"
                  className="bck_btn"
                  onClick={cancleForm}
                  // disabled={activeStep === 1}
                >
                  Cancel
                </ButtonWrapper>:<ButtonWrapper
                  variant="filled"
                  className="bck_btn"
                  onClick={goToPreviousStep}
                  // disabled={activeStep === 1}
                >
                  Back
                </ButtonWrapper>

                }
              
                <ButtonWrapper
                  type="button"
                  variant="filled"
                  className="nxt_btn"
                  onClick={goToNextStep}
                  disabled={activeStep === 1 && !isStepValid}
                >
                  Next
                </ButtonWrapper>
              </div>
            )}
          </div>
          {showConfirmation && (
            <div className="confirmation-overlay">
              <div className="confirmation-modal">
                <div style={{fontSize:"18px"}}>
                  {/* <FormattedMessage id="CustomTrackForm.customTrackConfirmationModalTitle" /> */}
                  Confirm Final submission
                </div>
                <div className="modal-buttons">
                  <ButtonWrapper
                    variant="filled"
                    className="cancel-btn"
                    onClick={() => setShowConfirmation(false)}
                  >
                    <FormattedMessage id="CustomTrackForm.cancel" />
                  </ButtonWrapper>
                  <ButtonWrapper
                    name="download"
                    variant="filled"
                    className="submit-btn"
                    onClick={handleConfirmationSubmit}
                  >
                    <FormattedMessage id="CustomTrackForm.submit" />
                  </ButtonWrapper>
                </div>
              </div>
            </div>
          )}
        </div></div>
      
      {/* </div> */}
    </MainLayout>
  );
};

export default MusicLincensingReq;
