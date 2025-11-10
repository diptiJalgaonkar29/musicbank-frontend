import React, { useRef, useState } from "react";
import "./MusicLincensingReq.css";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import Projectinfo from "./Projectinfo/Projectinfo";
import Trackdetails from "./Trackdetails/Trackdetails";
import ContextandUse from "./ContextandUse/ContextandUse";
import BudgetandTimeline from "./BudgetandTimeline/BudgetandTimeline";
import Contactinfo from "./Contactinfo/Contactinfo";
import Confirmandsub from "./Confirmandsub/Confirmandsub";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";

const MusicLincensingReq = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(true);
  const formikRef = useRef();

  const goToPreviousStep = () => {
    setActiveStep((pre) => pre - 1);
  };

  const goToNextStep = async () => {
    if (formikRef.current) {
      // console.log("formikRef.current", formikRef.current);
      await formikRef.current.submitForm(); // ✅ Triggers step form submission
    }
    //  setActiveStep((pre) => (pre + 1));
  };

  const handleStepSubmit = async (values) => {
    // Step 1: Update Redux
    let key = "";
    //let customTrackFormDataCopy = { ...customTrackFormData };

    // dispatch(setCustomTrackForm({ key, values }));
    console.log("key:", key, "values:", values);

    // Step 2: Trigger Update API

    setActiveStep((pre) => pre + 1);
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
        <Confirmandsub formikRef={formikRef} onSubmit={handleStepSubmit} />
      ),
    },
  ];

  //const singlePage = menuList.filter((data) => data.id == activeStep)

  return (
    <MainLayout>
      <div className="music-lincensing-req-container">
        <div className="sidebar">
          {menuList.map((step, index) => {
            const isActive = step.id === activeStep;
            const isDone = step.id < activeStep;

            return (
              <div key={step.id} className={`step-row`}>
                <div
                  className={`step-icon active ${
                    isActive ? "active" : isDone ? "done" : ""
                  }`}
                >
                  {isActive && <div className="inner-circle" />}
                  {isDone && <span className="checkmark">&#10003;</span>}
                </div>
                <div
                  className={`step-label ${
                    isActive ? "active-label" : "inactive-label"
                  } `}
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
                disabled={activeStep === 1}
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
        {/* </div> */}
      </div>
    </MainLayout>
  );
};

export default MusicLincensingReq;
