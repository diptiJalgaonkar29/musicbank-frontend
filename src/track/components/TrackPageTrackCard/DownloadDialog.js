import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { withStyles } from "@mui/styles";
import { Formik } from "formik";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import * as Yup from "yup";
import { Button } from "../../../common/components/Button/Button";
import TrackService from "../../../search/services/TrackService";
import "../../../_styles/SubmitDownloadDialog.css";

const styles = {
  dialogPaper: {
    minHeight: "90vh",
    maxHeight: "90vh",
    padding: 0,
  },
};

class DownloadDialog extends React.Component {
  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { classes, intl, config, isUserInternal } = this.props;
    const addExtraFormFields =
      isUserInternal && config.modules.ExtraFormFields ? true : false;
    const advtProdFieldsRequired = isUserInternal ? false : true;

    const initialValues = {
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
      value7: "",
      value8: "",
      value9: "",
      value10: "",
      value11: "",
      value12: "",
      value13: "",
      value14: "",
      value15: "",
      value16: "",
    };
    let YupValidationSchema = "";
    const YupValidationSchemaBase = Yup.object().shape({
      value1: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      value2: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),

      value4: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      value5: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),

      value6: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),

      //Advertising Agency - Advertising Agency:
      value7: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required(advtProdFieldsRequired ? "Required" : ""),

      //Advertising Agency - Producer Name:
      value8: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required(advtProdFieldsRequired ? "Required" : ""),

      //Advertising Agency - Producer Email:
      value9: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .email("Invalid email")
        .trim()
        .required(advtProdFieldsRequired ? "Required" : ""),

      //Production company - Production company:
      value10: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required(advtProdFieldsRequired ? "Required" : ""),

      //Production company - Producer Name:
      value11: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required(advtProdFieldsRequired ? "Required" : ""),

      //Production company - Producer Email:
      value12: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .email("Invalid email")
        .trim()
        .required(advtProdFieldsRequired ? "Required" : ""),
    });

    if (addExtraFormFields) {
      const YupValidationSchemaExtraFields = Yup.object().shape({
        //User Information - Department:
        value13: Yup.string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .trim()
          .required("Required"),

        //User Information - Partner Agency:
        value14: Yup.string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .trim()
          .required("Required"),

        //User Information - Function:
        value15: Yup.string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .trim()
          .required("Required"),

        //User Information - Country:
        value16: Yup.string()
          .min(2, "Too Short!")
          .max(200, "Too Long!")
          .trim()
          .required("Required"),
      });
      YupValidationSchema = YupValidationSchemaBase.concat(
        YupValidationSchemaExtraFields
      );
    } else {
      YupValidationSchema = YupValidationSchemaBase;
    }

    /////////////////////////

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="download-wav-dialog"
        open={this.props.open}
        fullWidth
        maxWidth="xl"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle
          id="download-wav-dialog"
          className="mb_SubmitDownload_title"
        >
          <h3 className="mb_h3">
            <FormattedMessage id="trackDetail.dowloadWAV.title" />
          </h3>
        </DialogTitle>
        <DialogContent className="mb_Dialog_Content">
          <Formik
            initialValues={initialValues}
            validationSchema={YupValidationSchema}
            onSubmit={(values, actions) => {
              let feedback_array = [];
              const feedbackBase_array = [
                {
                  heading: "Topic / Product / Sub-Brand / Model(s)",
                  message: values.value1,
                },
                {
                  heading: "Campaign Name",
                  message: values.value2,
                },
                {
                  heading: "Format",
                  message: values.value4,
                },
                {
                  heading: "Durations",
                  message: values.value5,
                },
                {
                  heading: "First Airing (Date)",
                  message: values.value6,
                },
                {
                  heading: "Advertising Agency",
                  message: values.value7,
                },
                {
                  heading: "Producer (advertising agency)",
                  message:
                    values.value8 === "" || values.value8 === undefined
                      ? ""
                      : `${values.value8}  ,  ${values.value9}`,
                },
                {
                  heading: "Production company",
                  message: values.value10,
                },
                {
                  heading: "Producer (production company)",
                  message:
                    values.value11 === "" || values.value11 === undefined
                      ? ""
                      : `${values.value11}  ,  ${values.value12}`,
                },
              ];

              if (addExtraFormFields) {
                const feedbackExtra_array = [
                  {
                    heading: "Department",
                    message: values.value13,
                  },
                  {
                    heading: "Partner Agency",
                    message: values.value14,
                  },
                  {
                    heading: "Function",
                    message: values.value15,
                  },
                  {
                    heading: "Country",
                    message: values.value16,
                  },
                ];
                feedback_array = feedbackBase_array.concat(feedbackExtra_array);
              } else {
                feedback_array = feedbackBase_array;
              }

              const data = JSON.stringify(
                {
                  track_id: this.props.id,
                  downloadType: this.props.downloadType,
                  feedback_items: feedback_array,
                },
                null,
                2
              );

              TrackService.postFeedback(data)
                .then(() => {
                  this.props.downloadTriggerProp();
                  actions.setSubmitting(false);
                })
                .catch((e) =>
                  console.error(
                    e,
                    "something went wrong triggering the Download Counter"
                  )
                );

              this.props.downloadMsgHandlerProp();
            }}
            render={({
              values,
              errors,

              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              isValid,
              dirty,
            }) => (
              <form onSubmit={handleSubmit} className="mb_SubmitDownload_form">
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <div>
                      <p className="mb_h4">
                        <FormattedMessage id="trackDetail.dowloadWAV.userInformationTitle" />
                      </p>
                    </div>
                    <div className="mb_input_container">
                      <label htmlFor="value1" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.topicInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.topicInputPlaceholder"]}`}
                        id="value1"
                        name="value1"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value1}
                      />
                      {errors.value1 && (
                        <div className="mb_error">{errors.value1}</div>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value2" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.campainInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.campainInputPlaceholder"]}`}
                        id="value2"
                        name="value2"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value2}
                      />
                      {errors.value2 && touched.value2 && (
                        <div className="mb_error">{errors.value2}</div>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value4" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.formatInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="value4"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.formatInputPlaceholder"]}`}
                        name="value4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value4}
                      />
                      {errors.value4 && touched.value4 && (
                        <div className="mb_error">{errors.value4}</div>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value5" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.durationsInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="value5"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.durationsInputPlaceholder"]}`}
                        name="value5"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value5}
                      />
                      {errors.value5 && touched.value5 && (
                        <div className="mb_error">{errors.value5}</div>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value6" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.firstAiringInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="value6"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.firstAiringInputPlaceholder"]}`}
                        name="value6"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value6}
                      />
                      {errors.value6 && touched.value6 && (
                        <div className="mb_error">{errors.value6}</div>
                      )}
                    </div>
                  </Grid>

                  {addExtraFormFields && (
                    <React.Fragment>
                      <Grid item xs={6}>
                        <div className="mb_input_container">
                          <label htmlFor="value13" className="mb_padding">
                            <FormattedMessage id="trackDetail.dowloadWAV.departmentInputTitle" />
                          </label>
                          <br />
                          <input
                            className="mb_input"
                            type="text"
                            id="value13"
                            placeholder={`${intl.messages["trackDetail.dowloadWAV.departmentInputPlaceholder"]}`}
                            name="value13"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.value13}
                          />
                          {errors.value13 && touched.value13 && (
                            <div className="mb_error">{errors.value13}</div>
                          )}
                        </div>
                      </Grid>

                      <Grid item xs={6}>
                        <div className="mb_input_container">
                          <label htmlFor="value14" className="mb_padding">
                            <FormattedMessage id="trackDetail.dowloadWAV.partnerAgencyInputTitle" />
                          </label>
                          <br />
                          <input
                            className="mb_input"
                            type="text"
                            id="value14"
                            placeholder={`${intl.messages["trackDetail.dowloadWAV.partnerAgencyInputPlaceholder"]}`}
                            name="value14"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.value14}
                          />
                          {errors.value14 && touched.value14 && (
                            <div className="mb_error">{errors.value14}</div>
                          )}
                        </div>
                      </Grid>

                      <Grid item xs={6}>
                        <div className="mb_input_container">
                          <label htmlFor="value15" className="mb_padding">
                            <FormattedMessage id="trackDetail.dowloadWAV.functionInputTitle" />
                          </label>
                          <br />
                          <input
                            className="mb_input"
                            type="text"
                            id="value15"
                            placeholder={`${intl.messages["trackDetail.dowloadWAV.functionInputPlaceholder"]}`}
                            name="value15"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.value15}
                          />
                          {errors.value15 && touched.value15 && (
                            <div className="mb_error">{errors.value15}</div>
                          )}
                        </div>
                      </Grid>

                      <Grid item xs={6}>
                        <div className="mb_input_container">
                          <label htmlFor="value16" className="mb_padding">
                            <FormattedMessage id="trackDetail.dowloadWAV.countryInputTitle" />
                          </label>
                          <br />
                          <input
                            className="mb_input"
                            type="text"
                            id="value16"
                            placeholder={`${intl.messages["trackDetail.dowloadWAV.countryInputPlaceholder"]}`}
                            name="value16"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.value16}
                          />
                          {errors.value16 && touched.value16 && (
                            <div className="mb_error">{errors.value16}</div>
                          )}
                        </div>
                      </Grid>
                    </React.Fragment>
                  )}
                  {/* Fields Addition - Trupti - Wits */}

                  <Grid item xs={12}>
                    <div>
                      <p className="mb_h4">
                        <FormattedMessage id="trackDetail.dowloadWAV.advertisingTitle" />
                      </p>
                    </div>

                    <div className="mb_input_container">
                      <label htmlFor="value7" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.advertisingAgencyInputTitle" />
                        {errors.value7 && touched.value7 && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.value7}`}
                          </span>
                        )}
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="value7"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.advertisingAgencyInputTitleInputPlaceholder"]}`}
                        name="value7"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value7}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value8" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.producerNameInputTitle" />
                        {errors.value8 && touched.value8 && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.value8}`}
                          </span>
                        )}
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="value8"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.producerNameInputPlaceholder"]}`}
                        name="value8"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value8}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value9" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.producerEmailInputTitle" />
                        {errors.value9 && touched.value9 && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.value9}`}
                          </span>
                        )}
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="email"
                        id="value9"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.producerEmailInputPlaceholder"]}`}
                        name="value9"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value9}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div>
                      <p className="mb_h4">
                        <FormattedMessage id="trackDetail.dowloadWAV.productionCompanyInputTitle" />
                      </p>
                    </div>
                    <div className="mb_input_container">
                      <label htmlFor="value10" className="mb_padding">
                        <span>
                          <FormattedMessage id="trackDetail.dowloadWAV.productionCompanyInputTitle" />
                        </span>
                        {errors.value10 && touched.value10 && (
                          <span className="mb_error">
                            {" "}
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.value10}`}
                          </span>
                        )}
                      </label>

                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="value10"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.productionCompanyInputPlaceholder"]}`}
                        name="value10"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value10}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value11" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.producerNameInputTitle" />
                        {errors.value11 && touched.value11 && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.value11}`}
                          </span>
                        )}
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="value11"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.producerNameInputPlaceholder"]}`}
                        name="value11"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value11}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="value12" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.producerEmailInputTitle" />
                        {errors.value12 && touched.value12 && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.value12}`}
                          </span>
                        )}
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="email"
                        id="value12"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.producerEmailInputPlaceholder"]}`}
                        name="value12"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.value12}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} className="mb_center">
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting || !dirty}
                      text="Download"
                    >
                      DOWNLOAD
                      <FormattedMessage id="trackDetail.dowloadWAV.accept" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default injectIntl(withStyles(styles)(DownloadDialog));
