import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomTrackFormLayout.css";
import MainLayout from "./../../common/components/MainLayout/MainLayout";
import MusicInspiration from "./MusicInspiration/MusicInspiration";
import MusicStyle from "./MusicStyle/MusicStyle";
import VisualReferences from "./VisualReferences/VisualReferences";
import WhatsNext from "./WhatsNext/WhatsNext";
import CreativeBriefing from "./CreativeBriefing/CreativeBriefing";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCustomTrackForm,
  setCustomTrackForm,
} from "../../redux/actions/customTrackForm/customTrackForm";
import AsyncService from "../../networking/services/AsyncService";
import { showError } from "../../redux/actions/notificationActions";

const CustomTrackFormLayout = () => {
  const intl = useIntl();
  const [activeStep, setActiveStep] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const [creativeBrief, setCreativeBrief] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const formikRef = useRef();
  const customTrackFormData = useSelector((state) => state.customTrackForm);

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    if (id === "0" || id === undefined || id === null) {
      navigate("/CustomTrackForm");
    }

    if (id != 0 && id != null) {
      // Step 1: Reset the state first
      dispatch(resetCustomTrackForm());

      // Step 2: Fetch new data
      const fetchData = async () => {
        try {
          const response = await AsyncService.loadData(`customtracks/${id}`);
          const metadata = response.data?.customTracksMetadata;

          if (metadata) {
            Object.entries(metadata).forEach(([key, values]) => {
              dispatch(
                setCustomTrackForm({
                  key,
                  values:
                    key === "customTrackForm"
                      ? { ...values, id: response.data.id } // ✅ only for customTrackForm
                      : values, // ❌ don't touch others
                })
              );
            });
          }
          const brief =
            response.data.customTracksMetadata.customTrackForm.creativeBrief;
          setCreativeBrief(brief);

          if (brief === "no") {
            setActiveStep(2);
          } else if (brief === "yes") {
            setActiveStep(1);
          }
        } catch (error) {
          console.error("Failed to fetch track data", error);
          dispatch(showError(error));
        }
      };

      fetchData();
    }
  }, [window.location.hash]); // re-run this effect when hash changes

  const isStepDisabled = (stepId) => {
    return (
      (creativeBrief === "no" && stepId === 1) ||
      (creativeBrief === "yes" && (stepId === 2 || stepId === 3))
    );
  };
  const goToNextStep = async () => {
    if (formikRef.current) {
      // console.log("formikRef.current", formikRef.current);
      await formikRef.current.submitForm(); // ✅ Triggers step form submission
    }
  };

  const handleStepSubmit = async (values) => {
    // Step 1: Update Redux
    let key = "";
    let customTrackFormDataCopy = { ...customTrackFormData };
    switch (activeStep) {
      case 1:
        key = "creativeBriefing";
        break;
      case 2:
        key = "musicInspiration";
        break;
      case 3:
        key = "musicStyle";
        break;
      case 4:
        key = "visualReferences";
        break;
      default:
        break;
    }
    if (key === "musicInspiration" || key === "visualReferences") {
      document.getElementById("closeFooterMusicPlayer")?.click();
    } else {
      customTrackFormDataCopy[key] = values;

      dispatch(setCustomTrackForm({ key, values }));
      // console.log("key:", key, "values:", values);
    }

    // Step 2: Trigger Update API
    const updatedPayload = {
      id: customTrackFormData.customTrackForm.id,
      customTracksMetadata: customTrackFormDataCopy,
    };
    //console.log("updatedPayload", updatedPayload);
    try {
      AsyncService.putData("customtracks", updatedPayload);

      //console.log("Step data updated successfully");
    } catch (err) {
      console.error("Error updating step data:", err);
    }

    // Step 3: Move to next step or show confirmation
    if (activeStep === 4) {
      setShowConfirmation(true);
      return;
    }

    let nextStep = activeStep + 1;
    while (nextStep <= menuList.length && isStepDisabled(nextStep)) {
      nextStep++;
    }
    if (nextStep <= menuList.length) {
      setActiveStep(nextStep);
    }
  };
  const goToPreviousStep = () => {
    if (activeStep === 1 || activeStep === 2) {
      navigate(
        `/CustomTrackForm?id=${customTrackFormData.customTrackForm.id}`
      );
      return;
    }

    let prevStep = activeStep - 1;
    while (prevStep >= 1 && isStepDisabled(prevStep)) {
      prevStep--;
    }
    if (prevStep >= 1) {
      setActiveStep(prevStep);
    }
  };

  const handleConfirmationSubmit = () => {
    setShowConfirmation(false);
    setActiveStep(5);
    dispatch(resetCustomTrackForm());
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (formikRef.current && formikRef.current.setFieldValue) {
      formikRef.current.setFieldValue("mediaFile", file);
      formikRef.current.setFieldValue("prompt", "");
    }
  };

  // ✅ Dynamic menu with formikRef passed into each step
  const menuList = [
    {
      id: 1,
      label: intl.formatMessage({ id: "CustomTrackForm.creativeBriefing" }),
      component: (
        <CreativeBriefing
          formikRef={formikRef}
          onSubmit={handleStepSubmit}
          onFileChange={handleFileChange}
          setIsStepValid={setIsStepValid} // ✅ new prop
        />
      ),
    },
    {
      id: 2,
      label: intl.formatMessage({ id: "CustomTrackForm.musicInspiration" }),
      component: (
        <MusicInspiration formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
    {
      id: 3,
      label: intl.formatMessage({ id: "CustomTrackForm.musicStyle" }),
      component: (
        <MusicStyle formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
    {
      id: 4,
      label: intl.formatMessage({ id: "CustomTrackForm.visualReferences" }),
      component: (
        <VisualReferences
          formikRef={formikRef}
          onSubmit={handleStepSubmit}
          onFileChange={handleFileChange} // ✅ Add this
        />
      ),
    },
    {
      id: 5,
      label: intl.formatMessage({ id: "CustomTrackForm.whatsNext" }),
      component: <WhatsNext />,
    },
  ];

  return (
    <MainLayout>
      <div className="Layout-container">
        <div className="sidebar">
          {menuList.map((step, index) => {
            const isActive = step.id === activeStep;
            const isDone = step.id < activeStep && !isStepDisabled(step.id);
            const isDisabled = isStepDisabled(step.id);

            return (
              <div
                key={step.id}
                className={`step-row ${isDisabled ? "disabled-step" : ""}`}
                // onClick={() => {
                //   if (!isDisabled) {
                //     setActiveStep(step.id);
                //   }
                // }}
              >
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
                  } ${isDisabled ? "disabled-label" : ""}`}
                >
                  {step.label}
                </div>
                {index !== menuList.length - 1 && <div className="step-line" />}
              </div>
            );
          })}
        </div>

        <div className="content-area">
          {menuList.find((step) => step.id === activeStep)?.component}

          {activeStep !== menuList.length && (
            <div className="btn_container">
              <ButtonWrapper
                variant="filled"
                className="bck_btn"
                onClick={goToPreviousStep}
              >
                Back
              </ButtonWrapper>

              <ButtonWrapper
                type="button"
                variant="filled"
                className="nxt_btn"
                onClick={goToNextStep}
                disabled={activeStep === 1 && !isStepValid} // ✅ disable only in step 1
              >
                Next
              </ButtonWrapper>
            </div>
          )}
        </div>

        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-modal">
              <p>
                <FormattedMessage id="CustomTrackForm.customTrackConfirmationModalTitle" />
              </p>
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
      </div>
    </MainLayout>
  );
};

export default CustomTrackFormLayout;
