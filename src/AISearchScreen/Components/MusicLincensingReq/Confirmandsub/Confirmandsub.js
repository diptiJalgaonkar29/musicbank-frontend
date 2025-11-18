import React from "react";
import "./Confirmandsub.css";
import { Field, Formik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import InputWrapper from "../../../../branding/componentWrapper/InputWrapper";
import TextAreaWrapper from "../../../../branding/componentWrapper/TextAreaWrapper";
import SonicInputLabel from "../../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import FileInputWrapper from '../../../../branding/componentWrapper/FileInputWrapper';
import RadioWrapper from '../../../../branding/componentWrapper/RadioWrapper';
import { MultiSelect } from 'react-multi-select-component';
import DatePicker from 'react-datepicker';
import { ReactComponent as FormIcon } from "../../../../static/Project.svg";
import AmountInput from '../../../../common/components/AmountInput/AmountInput';
import DatePickerField from '../../../../common/components/CustomDatePicker/CustomDatePicker';
import { useSelector } from 'react-redux';
import { Divider } from '@mui/material';
import { color } from 'd3';

const Confirmandsub = ({ formikRef, onSubmit,setActiveStep }) => {


   const musicLicensingData = useSelector((state) => state.musicLicensingForm) || {};

  const intl = useIntl();
  const today = new Date();


  
const airingRegionOption = [
  { label: "India", value: "IN" },
  { label: "USA", value: "US" },
  { label: "UK", value: "UK" },
];

const mediaTypeOption = [
  { label: "TV", value: "tv" },
  { label: "Radio", value: "radio" },
  { label: "Digital", value: "digital" },
];

const usageDurationOptions = [
  { label: "1 Month", value: "1m" },
  { label: "3 Months", value: "3m" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
];

  
  const licenseTypeOptions = [
    { id: "originalOption", value: "Original(MasterRecording)", label: "Original(MasterRecording)" },
    { id: "customOption", value: "CustomReproduction/Remix(Publishing)", label: "CustomReproduction/Remix(Publishing)" },
    { id: "TBDOption", value: "TBD", label: "TBD" },
  ];

  const contextMusicOptions = [
    { id: "backgroundMusicOption", value: "BackgroundMusic", label: "BackgroundMusic" },
    { id: "thematicOption", value: "Featured/Thematic", label: "Featured/Thematic" },
  ];

  const mediaPlanOptions = [
    { id: "mediaPlanAvaiYes", value: "yes", label: "Yes" },
    { id: "mediaPlanAvaiNo", value: "no", label: "No" },
  ];
  return (
    <div className="confirmandsub-container">
      <Formik
        innerRef={formikRef}
         initialValues={{
          ...musicLicensingData.projectInformation,
          ...musicLicensingData.trackDetails,
          ...musicLicensingData.contextAndUsage,
          ...musicLicensingData.budgetAndTimeline,
          ...musicLicensingData.contactInformation,
        }}

        validateOnMount
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          dirty,
          isValid,
          isSubmitting,
          handleSubmit,
        }) => (
          <form className='confirmandsub-container-form'>

            {/* project information */}
          
           <div className='projectinfo-container' style={{ position: "relative" }}>
  <div className='edit' onClick={() => { setActiveStep(1) }}>Edit</div>

  <div className="page_title">
    <FormattedMessage id={"MusicLicensingReqest.projectInfoTitle"} />
  </div>

  <SonicInputLabel htmlFor="companyName">
    <FormattedMessage id={"MusicLicensingReqest.companyName"} />
  </SonicInputLabel>
  <Field
    id="companyName"
    name="companyName"
    type="text"
    placeholder={intl.formatMessage({
      id: "MusicLicensingReqest.companyNamePlaceholder",
    })}
    component={InputWrapper}
    readOnly={true}
    style={{
      border: "none",
      borderBottom: "1px solid var(--color-gray)",
      borderRadius: 0,
      color: "var(--color-gray) !important"
    }}
  />

  <br /><br />

  <SonicInputLabel htmlFor="projectName">
    <FormattedMessage id={"MusicLicensingReqest.projectName"} />
  </SonicInputLabel>
  <Field
    id="projectName"
    name="projectName"
    type="text"
    placeholder={intl.formatMessage({
      id: "MusicLicensingReqest.projectNamePlaceholder",
    })}
    component={InputWrapper}
    readOnly={true}
    style={{
      border: "none",
      borderBottom: "1px solid var(--color-gray)",
      borderRadius: 0,
      color: "var(--color-gray) !important"
    }}
  />

  <br /><br />

  <SonicInputLabel htmlFor="projectPurpose">
    <FormattedMessage id={"MusicLicensingReqest.projectPurposeOptional"} />
  </SonicInputLabel>
  <Field
    id="projectPurpose"
    name="projectPurpose"
    type="text"
    placeholder={intl.formatMessage({
      id: "MusicLicensingReqest.projectPurposePlaceholder",
    })}
    component={InputWrapper}
    readOnly={true}
    style={{
      border: "none",
      borderBottom: "1px solid var(--color-gray)",
      borderRadius: 0,
      color: "var(--color-gray) !important"
    }}
  />

  <br /><br />

  <SonicInputLabel htmlFor="projectAssetList">
    <FormattedMessage id={"MusicLicensingReqest.projectAssetListheading"} />
    <div className="projectListSubhed">
      <FormattedMessage id={"MusicLicensingReqest.projectAsseListSubheading"} />
    </div>
  </SonicInputLabel>
  <div className="projectListTextarea">
    <Field
      id="projectAssetList"
      name="projectAssetList"
      type="text"
      placeholder={intl.formatMessage({
        id: "MusicLicensingReqest.projectAssetListPlaceholder",
      })}
      component={InputWrapper}
      rows="7"
      readOnly={true}
      style={{
        border: "none",
        borderBottom: "1px solid var(--color-gray)",
        borderRadius: 0,
        color: "var(--color-gray) !important"
      }}
    />
  </div>
</div>

            {/* Track details */}
            <div className='trackdetails-container' style={{ position: "relative" }}>
  <div className='edit' onClick={() => { setActiveStep(2) }}>Edit</div>

  <div className="page_title">
    <FormattedMessage id={"MusicLicensingReqest.trackDetailsHeading"} />
  </div>

  <SonicInputLabel htmlFor="requestTrack">
    <span className="project-label">
      <FormattedMessage id="MusicLicensingReqest.requestedTrack" />
    </span>
  </SonicInputLabel>
  <br />
  <Field
    id="requestTrack"
    name="requestTrack"
    type="text"
    placeholder={intl.formatMessage({
      id: "MusicLicensingReqest.requestedTrackPlaceholder",
    })}
    component={InputWrapper}
    readOnly={true}
    style={{ border: "none", borderBottom: "1px solid #ccc", borderRadius: 0 ,color:  "var(--color-gray) !important"}}
  />
  <br /><br />

  <div className="openToAlter">
    <FormattedMessage id={"MusicLicensingReqest.alternativesOptionsHeading"} />
                <div className="openToAlter-option">
                  {musicLicensingData?.trackDetails?.alternativesOption === "Yes" ? <div className="openToAlter-option-A">
                    <Field
                      name="alternativesOption"
                      id="alternativesOption-Yes"
                      type="radio"
                      value="Yes"
                      component={RadioWrapper}
                      disabled={true}
                    />
                    <div>
                      <label htmlFor="alternativesOption-Yes" style={{color:  "var(--color-gray) !important"}}>
                        <FormattedMessage id={"MusicLicensingReqest.optionsYes"} />
                      </label>
                    </div>
                  </div> :
      
                    <div className="openToAlter-option-A">
                      <Field
                        name="alternativesOption"
                        id="alternativesOption-No"
                        type="radio"
                        value="No"
                        component={RadioWrapper}
                        disabled={true}
                      />
                      <div>
                        <label htmlFor="alternativesOption-No" style={{color:  "var(--color-gray) !important"}}>
                          <FormattedMessage id={"MusicLicensingReqest.optionsNo"} />
                        </label>
                      </div>
                    </div>
                  }
    </div>
  </div>

  <div className="openToAlter">
    <FormattedMessage id={"MusicLicensingReqest.briefingAvailableOption"} />
    <div className="openToAlter-option"> { musicLicensingData?.trackDetails?.briefingAvailableOption === "Yes" ?<div className="openToAlter-option-A">
        <Field
          name="briefingAvailableOption"
          id="briefingAvailableOption-Yes"
          type="radio"
          value="Yes"
          component={RadioWrapper}
          disabled={true}
        />
        <div>
          <label htmlFor="briefingAvailableOption-Yes" style={{color:  "var(--color-gray) !important"}}>
            <FormattedMessage id={"MusicLicensingReqest.optionsYes"} />
          </label>
        </div>
      </div>
      :
      <div className="openToAlter-option-A">
        <Field
          name="briefingAvailableOption"
          id="briefingAvailableOption-No"
          type="radio"
          value="No"
          component={RadioWrapper}
          disabled={true}
        />
        <div>
          <label htmlFor="briefingAvailableOption-No" style={{color:  "var(--color-gray) !important"}}>
            <FormattedMessage id={"MusicLicensingReqest.optionsNo"} />
          </label>
        </div>
      </div>
                  }
    </div>
  </div>

  {/* Show media files as paths */}
  <div className="media-files-display">
 
  
  
      {musicLicensingData?.trackDetails?.mediaFile?.map((file, index) => (
        <div key={index}>
          <FormIcon style={{height:"18px"}}/><span style={{marginLeft:"18px"}}>{file.name || file}</span> {/* Show file name or path */}
        </div>
      ))}
    
  
</div>
</div>

            {/* contact and usage */}
        <div className="contextandUse-container" style={{ position: "relative" }}>
  <div className="edit" onClick={() => setActiveStep(3)}>Edit</div>

  <div className="page_title">
    <FormattedMessage id="MusicLicensingReqest.contextandUsageHeading" />
  </div>

  {/* License Type */}
  <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.licenseTypeOptions" />
  </SonicInputLabel>
  <div className="licenseTypeOptions">
    <div className="licenseTypeOptionsAll selected-value">
      {values.licenseTypeOptions || "Not selected"}
    </div>
  </div>

  {/* Context Music */}
  <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.contextandMusicOptions" />
  </SonicInputLabel>
  <div className="contextMusicOption">
    <div className="contextMusicOptionAll selected-value">
      {values.contextMusicOption || "Not selected"}
    </div>
  </div>

  {/* Regions */}
  <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.airingAndRegionDropdown" />
  </SonicInputLabel>
  <div className="region-dropdown selected-value">
    {(values.airingRegionOption || []).map((item) => item.label || item).join(", ") || "Not selected"}
  </div>

  {/* Media Type */}
  <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.mediaTypeDropdown" />
  </SonicInputLabel>
  <div className="region-dropdown selected-value">
    {(values.mediaTypeOption || []).map((item) => item.label || item).join(", ") || "Not selected"}
  </div>

  {/* Usage Duration */}
  <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.usageandLicenseHeading" />
  </SonicInputLabel>
  <div className="usage-duration-Section">
    <div className="usage-duration-display selected-value">
      {(values.usageDuration || []).map((item) => item.label || item).join(", ") || "Not selected"}
    </div>
  </div>

  {/* Dates */}
  {/* <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.projectTimeline" />
  </SonicInputLabel>
  <div className="budgetandTimeline_date selected-value">
    <div>
      From: {values.startDate ? new Date(values.startDate).toLocaleDateString() : "Not set"}
    </div>
    <div>
      To: {values.endDate ? new Date(values.endDate).toLocaleDateString() : "Not set"}
    </div>
  </div> */}

  {/* Media Plan */}
  <SonicInputLabel>
    <FormattedMessage id="MusicLicensingReqest.mediaPlanAvaiHeading" />
  </SonicInputLabel>
  <div className="contextMusicOption">
    <div className="contextMusicOptionAll selected-value">
      {values.mediaPlanAvai || "Not selected"}
    </div>
  </div>

  {/* Media Files */}
  {/* <SonicInputLabel>
    <FormattedMessage id="CustomTrackForm.uploadBrief" />
  </SonicInputLabel>
  <div className="media-files-display selected-value">
    <ul>
      {values.mediaFile && values.mediaFile.length > 0 ? (
        values.mediaFile.map((file, index) => (
          <li key={index}>{file.name || file}</li>
        ))
      ) : (
        <li className="empty">No file uploaded</li>
      )}
    </ul>
  </div> */}
</div>


            
            {/* budget and timeline */}
            
            <div className="budgetandTimeline-container" style={{ position: "relative" }}>
              <div className='edit'  onClick={()=>{setActiveStep(4)}}>Edit</div>
                        {/* Page Heading */}
                        <div className="page_title">
                          <FormattedMessage id="MusicLicensingReqest.budgetandTimelineHeading" />
                        </div>
            
                        {/* Budget Input */}
                        <div className="budget-input-wrapper">
                          <label htmlFor="musicBudget" className="budget-label">
                            <FormattedMessage id="MusicLicensingReqest.estimatedBudget" />
                          </label>
            
                          <div className="budget-input-field">
                           { musicLicensingData?.budgetAndTimeline?.budget}
                          </div>
            
                         
                        </div>
           
            
                        {/* Timeline */}
                        <div className="budgetandTimeline_date">
                          <SonicInputLabel>
                            <FormattedMessage id="MusicLicensingReqest.projectTimeline" />
                          </SonicInputLabel>
            
                          <div className="budgetandTimeline_Bothdate">
  {/* Start Date */}
  <div className="budgetandTimeline_startbox">
    <div className="readonly-date">
      {values.startDate
        ? new Date(values.startDate).toLocaleDateString()
        : "-"}
    </div>
  </div>

  {/* End Date */}
  <div className="budgetandTimeline_startbox">
    <div className="readonly-date">
      {values.endDate
        ? new Date(values.endDate).toLocaleDateString()
        : "-"}
    </div>
  </div>
</div>

                        </div>
            
                        {/* License Agreement Radio */}
                        <div className="leagal-heading">
                          <SonicInputLabel className="leagal-heading">
                            <FormattedMessage id="MusicLicensingReqest.legalServicesHeading" />
                          </SonicInputLabel>
                        </div>
            
                        <div className="contextMusicOption">
                          <SonicInputLabel>
                            <FormattedMessage id="MusicLicensingReqest.licenseAgreement" />
                          </SonicInputLabel>
            
                <div className="contextMedia-Options">
                  {musicLicensingData?.budgetAndTimeline?.mediaPlanAvai === "yes" ? <div className="budgetandTimeline_musicOption">
                    <Field
                      name="mediaPlanAvai"
                      id="mediaPlanAvaiYes"
                      type="radio"
                      value="yes"
                      component={RadioWrapper}
                    />
                    <label htmlFor="mediaPlanAvaiYes" style={{ color:  "var(--color-gray) !important"}}>
                      <FormattedMessage id="MusicLicensingReqest.mediaPlanAvaiYes" />
                    </label>
                  </div> :
                            
            
                    <div className="budgetandTimeline_musicOption">
                      <Field
                        name="mediaPlanAvai"
                        id="mediaPlanAvaiNo"
                        type="radio"
                        value="no"
                        component={RadioWrapper}
                      />
                      <label htmlFor="mediaPlanAvaiNo" style={{ color:  "var(--color-gray) !important"}}>
                        <FormattedMessage id="MusicLicensingReqest.mediaPlanAvaiNo" />
                      </label>
                    </div>}
                          </div>
            
                          {touched.mediaPlanAvai && errors.mediaPlanAvai && (
                            <p className="report_form_error">{errors.mediaPlanAvai}</p>
                          )}
                        </div>
                      </div>
            {/* contact info */}
            <div className="contactInfoForm-container" style={{ position: "relative" }}>
  <div className='edit' onClick={() => { setActiveStep(5) }}>Edit</div>

  <div className="page_title">
    <FormattedMessage id={"MusicLicensingReqest.contactInfoTitle"} />
  </div>

  <SonicInputLabel htmlFor="contactName">
    <FormattedMessage id={"MusicLicensingReqest.primaryConatctName"} />
  </SonicInputLabel>
  <Field
    id="contactName"
    name="contactName"
    type="text"
    placeholder={intl.formatMessage({
      id: "MusicLicensingReqest.primaryConatctName",
    })}
    component={InputWrapper}
    readOnly={true}
    style={{ border: "none", borderBottom: "1px solid var(--color-gray)", borderRadius: 0 ,color:  "var(--color-gray) !important"}}
  />
 

  <br /><br />

  <SonicInputLabel htmlFor="agencyName">
    <FormattedMessage id={"MusicLicensingReqest.agencyName"} />
  </SonicInputLabel>
  <Field
    id="agencyName"
    name="agencyName"
    type="text"
    placeholder={intl.formatMessage({
      id: "MusicLicensingReqest.agencyNamePlaceholder",
    })}
    component={InputWrapper}
    readOnly={true}
    style={{ border: "none", borderBottom: "1px solid var(--color-gray)", borderRadius: 0 ,color:  "var(--color-gray) !important"}}
  />


  <br /><br />

  <div className="contact-filleds" style={{flexDirection:"column" ,gap:"20px"}}>
    <div className="email-filled">
      <SonicInputLabel htmlFor="emailAddress">
        <FormattedMessage id={"MusicLicensingReqest.emailAddress"} />
      </SonicInputLabel>
      <Field
        id="emailAddress"
        name="emailAddress"
        type="text"
        placeholder={intl.formatMessage({
          id: "MusicLicensingReqest.emailAddressPlaceholder",
        })}
        component={InputWrapper}
        readOnly={true}
        style={{ border: "none", borderBottom: "1px solid var(--color-gray)",width:"65vw", borderRadius: 0 ,color:  "var(--color-gray) !important"}}
      />
      
    </div>

    <div className="number-filled">
      <SonicInputLabel htmlFor="phoneNumber">
        <FormattedMessage id={"MusicLicensingReqest.phoneNumber"} />
      </SonicInputLabel>
      <Field
        id="phoneNumber"
        name="phoneNumber"
        type="text"
        placeholder={intl.formatMessage({
          id: "MusicLicensingReqest.phoneNumberPlaceholder",
        })}
        component={InputWrapper}
        readOnly={true}
        style={{ border: "none", borderBottom: "1px solid var(--color-gray)",width:"65vw", borderRadius: 0,color:  "var(--color-gray) !important" }}
      />
    </div>
  </div>

  <br /><br />

  <SonicInputLabel htmlFor="location">
    <FormattedMessage id={"MusicLicensingReqest.location"} />
  </SonicInputLabel>
  <Field
    id="location"
    name="location"
    type="text"
    placeholder={intl.formatMessage({
      id: "MusicLicensingReqest.locationPlaceholder",
    })}
    component={InputWrapper}
    readOnly={true}
    style={{ border: "none", borderBottom: "1px solid var(--color-gray)", borderRadius: 0,color:  "var(--color-gray) !important" }}
  />
 

  <br /><br />
</div>

          </form>
        )}
      </Formik>
    </div>
  );
};

export default Confirmandsub;
