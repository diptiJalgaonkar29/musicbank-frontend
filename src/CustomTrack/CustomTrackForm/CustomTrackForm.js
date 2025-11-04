import React, { useEffect, useState } from "react";
import { Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import InputWrapper from "../../branding/componentWrapper/InputWrapper";
import SonicInputLabel from "../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import TextAreaWrapper from "../../branding/componentWrapper/TextAreaWrapper";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import DatePickerField from "../../common/components/CustomDatePicker/CustomDatePicker";
import SelectWrapper from "../../branding/componentWrapper/SelectWrapper";
import "./CustomTrackForm.css";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCustomTrackForm,
  setCustomTrackForm,
} from "../../redux/actions/customTrackForm/customTrackForm";
import { id } from "date-fns/locale";
import AsyncService from "../../networking/services/AsyncService";
import { showError } from "../../redux/actions/notificationActions";
import { format, parse, parseISO } from "date-fns";

// Dropdown options
const audioTypeOptions = [
  { label: "Music", value: "Music" },
  { label: "Sound Design", value: "SoundDesign" },
  { label: "Final Mix", value: "FinalMix" },
];

// Form validation schema
const validationSchema = Yup.object().shape({
  projectTitle: Yup.string().required("Project title is required"),
  focusOfContent: Yup.string().required("Focus of your content is required"),
  mediaFormat: Yup.string().required("Media format is required"),
  audioType: Yup.object().required("Type of Audio Deliverables is required"),
  audioDeliverables: Yup.string().required(
    "Number of audio deliverables is required"
  ),
  deadline: Yup.date().nullable().required("Deadline is required"),
});

const CustomTrackForm = () => {
  const [selected, setSelected] = useState("no");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customTrackForm } = useSelector((state) => state.customTrackForm);
  const handleCreativeBriefClick = (value, setFieldValue) => {
    setSelected(value);
    setFieldValue("creativeBrief", value);
  };

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    const id = params.get("id");

    // Prevent duplicate fetching
    const currentFormId = customTrackForm.id;
    const isDifferentId = String(id) !== String(currentFormId);

    if (isDifferentId && id != null) {
      // Step 1: Reset the state first
      dispatch(resetCustomTrackForm());

      // Step 2: Fetch new data
      const fetchData = async () => {
        try {
          const response = await AsyncService.loadData(`customtracks/${id}`);
          const metadata = response.data?.customTracksMetadata;

          if (metadata) {
            Object.entries(metadata).forEach(([key, values]) => {
              const processedValues =
                key === "customTrackForm"
                  ? {
                      ...values,
                      id: response.data.id, // Override only for customTrackForm
                      deadline: values.deadline
                        ? values.deadline.includes("T")
                          ? format(parseISO(values.deadline), "dd/MM/yyyy")
                          : values.deadline
                        : null,
                    }
                  : values;

              dispatch(
                setCustomTrackForm({
                  key,
                  values: processedValues,
                })
              );
            });
          }
        } catch (error) {
          console.error("Failed to fetch track data", error);
          dispatch(showError(error));
        }
      };

      fetchData();
    }
  }, [window.location.hash]); // re-run this effect when hash changes

  const customTrackFormData = useSelector((state) => state.customTrackForm);
  useEffect(() => {
    document.getElementById("closeFooterMusicPlayer")?.click();
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const isFirstTime = !values.id;
      const method = isFirstTime ? "POST" : "PUT";

      const updatedPayload = {
        id: customTrackFormData.customTrackForm.id,
        customTracksMetadata: {
          customTrackForm: {
            ...values,
            deadline: values.deadline
              ? format(values.deadline, "dd/MM/yyyy")
              : null,
          },
          creativeBriefing: customTrackFormData.creativeBriefing,
          musicInspiration: customTrackFormData.musicInspiration,
          musicStyle: customTrackFormData.musicStyle,
          visualReferences: customTrackFormData.visualReferences,
        },
      };

      const apiCall =
        method === "POST"
          ? AsyncService.postData("customtracks", updatedPayload)
          : AsyncService.putData("customtracks", updatedPayload);

      const response = await apiCall;
      //console.log("response", response);

      const data = await response.data;
      // console.log("data", data);
      dispatch(
        setCustomTrackForm({
          key: "customTrackForm",
          values: { ...values, id: data },
        })
      );

      if (isFirstTime) {
        values.id = data; // Save the returned ID
      }

      navigate(`/CustomTrackFormLayout?id=${values.id}`);
    } catch (error) {
      console.error("Form submission error:", error);
      dispatch(showError(error));
    } finally {
      setSubmitting(false);
    }
  };
  const handleCancelClick = () => {
    dispatch(resetCustomTrackForm());
    navigate(-1);
  };

  const today = new Date();
  const intl = useIntl();
  return (
    <MainLayout>
      <div className="customTrackForm">
        <div className="custom_track_form_title">
          <FormattedMessage id={"CustomTrackForm.title"} />
        </div>
        <div className="custom_track_form_subTitle">
          <FormattedMessage id={"CustomTrackForm.subtitle"} />
        </div>

        <Formik
          initialValues={{
            ...customTrackForm,
            deadline: customTrackForm.deadline
              ? typeof customTrackForm.deadline === "string" &&
                customTrackForm.deadline.includes("T")
                ? parseISO(customTrackForm.deadline) // ISO string
                : parse(customTrackForm.deadline, "dd/MM/yyyy", new Date()) // dd/MM/yyyy
              : null,
          }}
          validateOnMount
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
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
            <form onSubmit={handleSubmit}>
              <div className="custom_track_form_section">
                {/* Left Section */}
                <div className="custom_track_form">
                  {/* Project Title */}
                  <SonicInputLabel htmlFor="projectTitle">
                    <FormattedMessage id={"CustomTrackForm.projectTitle"} />
                  </SonicInputLabel>
                  <Field
                    id="projectTitle"
                    name="projectTitle"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CustomTrackForm.projectTitlePlaceholder",
                    })}
                    component={InputWrapper}
                  />
                  {errors.projectTitle && touched.projectTitle && (
                    <p className="report_form_error">{errors.projectTitle}</p>
                  )}
                  <br />
                  <br />
                  {/* Focus of Content */}
                  <SonicInputLabel htmlFor="focusOfContent">
                    <FormattedMessage
                      id={"CustomTrackForm.focusofContentTitle"}
                    />
                  </SonicInputLabel>
                  <Field
                    id="focusOfContent"
                    name="focusOfContent"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CustomTrackForm.focusofContentPlaceholder",
                    })}
                    component={TextAreaWrapper}
                    rows="7"
                  />
                  {errors.focusOfContent && touched.focusOfContent && (
                    <p className="report_form_error">{errors.focusOfContent}</p>
                  )}
                  <br />
                  <br />
                  {/* Media Format */}
                  <SonicInputLabel htmlFor="mediaFormat">
                    <FormattedMessage id={"CustomTrackForm.mediaFormat"} />
                  </SonicInputLabel>
                  <Field
                    id="mediaFormat"
                    name="mediaFormat"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CustomTrackForm.mediaFormatPlaceholder",
                    })}
                    component={InputWrapper}
                  />
                  {errors.mediaFormat && touched.mediaFormat && (
                    <p className="report_form_error">{errors.mediaFormat}</p>
                  )}
                  <br />
                  <br />
                  {/* Creative Brief - Yes/No */}{" "}
                  <div className="creative_brief_row">
                    <SonicInputLabel htmlFor="creative_brief">
                      <FormattedMessage
                        id={"CustomTrackForm.creativeBrieftitle"}
                      />
                    </SonicInputLabel>
                    <Field name="creativeBrief">
                      {({ field, form }) => (
                        <div className="creative_brief_btn_container">
                          <ButtonWrapper
                            variant="outlined"
                            onClick={() =>
                              handleCreativeBriefClick(
                                "yes",
                                form.setFieldValue
                              )
                            }
                            className={`ctf_btn ${
                              field.value === "yes" ? "selected_btn" : ""
                            }`}
                          >
                            <FormattedMessage id="CustomTrackForm.yes" />
                          </ButtonWrapper>

                          <ButtonWrapper
                            variant="outlined"
                            onClick={() =>
                              handleCreativeBriefClick("no", form.setFieldValue)
                            }
                            className={`ctf_btn ${
                              field.value === "no" ? "selected_btn" : ""
                            }`}
                          >
                            <FormattedMessage id="CustomTrackForm.no" />
                          </ButtonWrapper>
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
                {/* Right Section */}
                <div className="custom_track_form">
                  {/* Audio Type */}
                  <SonicInputLabel htmlFor="audioType">
                    <FormattedMessage
                      id={"CustomTrackForm.audioDeliverablesTitle"}
                    />
                  </SonicInputLabel>
                  <Field
                    id="audioType"
                    name="audioType"
                    options={audioTypeOptions}
                    component={SelectWrapper}
                    placeholder={intl.formatMessage({
                      id: "CustomTrackForm.audioDeliverablesPlaceholder",
                    })}
                  />
                  {errors.audioType && touched.audioType && (
                    <p className="report_form_error">{errors.audioType}</p>
                  )}

                  <br />
                  <br />

                  {/* Audio Deliverables */}
                  <SonicInputLabel htmlFor="audioDeliverables">
                    <FormattedMessage
                      id={"CustomTrackForm.numberofAudioDeliverablesTitle"}
                    />
                  </SonicInputLabel>
                  <Field
                    id="audioDeliverables"
                    name="audioDeliverables"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "CustomTrackForm.numberofAudioDeliverablesPlaceholder",
                    })}
                    component={InputWrapper}
                  />
                  {errors.audioDeliverables && touched.audioDeliverables && (
                    <p className="report_form_error">
                      {errors.audioDeliverables}
                    </p>
                  )}

                  <br />
                  <br />

                  {/* Deadline */}
                  <SonicInputLabel htmlFor="deadline">
                    <FormattedMessage id={"CustomTrackForm.deadline"} />
                  </SonicInputLabel>
                  <DatePickerField
                    placeholderText={intl.formatMessage({
                      id: "CustomTrackForm.deadlinePlaceholder",
                    })}
                    name="deadline"
                    minDate={today}
                    showYearDropdown
                  />
                  {/* Buttons */}
                  <div className="btn_container">
                    <ButtonWrapper
                      variant="filled"
                      className="cnl_btn"
                      onClick={handleCancelClick}
                    >
                      <FormattedMessage id={"CustomTrackForm.cancel"} />
                    </ButtonWrapper>
                    <ButtonWrapper
                      type="submit"
                      variant="filled"
                      className={`ctk_btn ${
                        isValid ? "active-btn" : "disabled-btn"
                      }`}
                      disabled={!isValid || isSubmitting}
                    >
                      <FormattedMessage id="CustomTrackForm.customTrack" />
                    </ButtonWrapper>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
};

export default CustomTrackForm;
