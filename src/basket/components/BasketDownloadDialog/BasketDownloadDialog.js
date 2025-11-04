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
import "./BasketDownloadDialog.css";
import Cookies from "js-cookie";

import Select from "react-select";
import countryNames from "../../../authentication/components/Register/CountryNames";
import addCookie from "../../../common/utils/AddCookie";

import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import MutipleCheckBoxes from "../MultipleCheckBoxes/MutipleCheckBoxes";
import MediaService from "../../../common/services/MediaService";
import getSuperBrandId from "../../../common/utils/getSuperBrandId";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted var(--color-card)",
    color: state.isSelected ? "var(--color-white)" : "black",
    padding: "5px 10px",
    fontSize: "1.6rem",
  }),
  valueContainer: (provided) => ({
    ...provided,
    marginTop: "-4px",
    padding: "0px 10px",
  }),
  control: (provided, state) => ({
    ...provided,
    borderRadius: 0,
    width: "calc(100% + 17px)!important",
    fontSize: "1.4rem !important",
    height: "40px !important",
    border: "1px solid #999",
    minHeight: "40px !important",
    boxShadow: "1px solid #999",
    "&:hover": {
      border: "1px solid #999",
    },
    color: "#333",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "#333",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    transition: "all .2s ease",
    transform: "rotate(180deg)",
  }),
};

const styles = {
  dialogPaper: {
    minHeight: "90vh",
    maxHeight: "90vh",
    padding: 0,
  },
};

class CustomSelect extends React.Component {
  handleChange = (value) => {
    this.setState(value);
    if (value.label) {
      this.props.onChange(this.props.name, value?.label);
    } else {
      this.props.onChange(this.props.name, value);
    }
  };

  handleBlur = () => {
    this.props.onBlur(this.props.name, true);
  };

  render() {
    return (
      <div style={{ margin: "1rem 0" }}>
        <Select
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={
            this.props.value && {
              label: this.props.value,
              value: this.props.value,
            }
          }
          menuPlacement="top"
          placeholder={"Country Name"}
          id="country"
          name="country"
          options={countryNames}
          styles={customStyles}
        />
      </div>
    );
  }
}

class DownloadDialog extends React.Component {
  constructor(props) {
    super(props);
    this.setClassicMediaTypeData = this.setClassicMediaTypeData.bind(this);
    this.setOnlineSocialMediaTypeData =
      this.setOnlineSocialMediaTypeData.bind(this);
  }

  state = {
    classicMediaTypeList: null,
    onlineSocialMediaTypeList: null,
    tracksUrlArr: null,
    selectedClassicMediaType: [],
    otherClassicMediaType: "",
    selectedOnlineSocialMediaType: [],
    otherOnlineSocialMediaType: "",
  };

  componentDidMount() {
    this.fetchMediaList();
  }

  fetchMediaList() {
    axios
      .get("/api/media_type/list", {
        headers: {
          BrandName: getSuperBrandId(),
          BrandId: localStorage.getItem("brandId"),
        },
      })
      .then((res) => {
        var classicMedia = res.data.filter((type) => {
          return type.media_type_parent === "classic";
        });
        var onlineSocialMedia = res.data.filter((type) => {
          return type.media_type_parent === "online social";
        });
        this.setState({ classicMediaTypeList: classicMedia });
        this.setState({ onlineSocialMediaTypeList: onlineSocialMedia });

        // console.log("classicMedia", classicMedia);
        // console.log("onlineSocialMedia", onlineSocialMedia);
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.trackList !== prevProps.trackList) {
      var tracksArr = [];
      this.props.trackList.map((track, i) => {
        if (this.props.cookieBasket[i].audio_type == "MP3") {
          tracksArr.push(track.preview_track_url);
        } else {
          tracksArr.push(track.track_url);
        }
      });
      // console.log("tracksArr", tracksArr);
      this.setState({ tracksUrlArr: tracksArr });
    }
  }

  setClassicMediaTypeData(selectedClassicMediaType, otherClassicMediaType) {
    if (otherClassicMediaType) {
      var selected = [...selectedClassicMediaType, otherClassicMediaType];
      // console.log(
      //   "***setClassicMediaTypeData",
      //   selectedClassicMediaType,
      //   otherClassicMediaType,
      //   selected
      // );

      this.setState({
        selectedClassicMediaType: selected,
        otherClassicMediaType: otherClassicMediaType,
      });
    } else {
      var selected = [...this.state.selectedClassicMediaType];
      // console.log(
      //   "s***setClassicMediaTypeData",
      //   selectedClassicMediaType,
      //   otherClassicMediaType
      // );
      this.setState({
        selectedClassicMediaType: selectedClassicMediaType,
      });
    }
  }

  setOnlineSocialMediaTypeData(
    selectedOnlineSocialMediaType,
    otherOnlineSocialMediaType
  ) {
    if (otherOnlineSocialMediaType) {
      var selected = [
        ...selectedOnlineSocialMediaType,
        otherOnlineSocialMediaType,
      ];
      // console.log("***setClassicMediaTypeData", selected);

      this.setState({
        selectedOnlineSocialMediaType: selected,
        otherOnlineSocialMediaType: otherOnlineSocialMediaType,
      });
    } else {
      var selected = [...this.state.selectedOnlineSocialMediaType];
      // console.log("s***setClassicMediaTypeData", selected);
      this.setState({
        selectedOnlineSocialMediaType: selectedOnlineSocialMediaType,
      });
    }
  }

  handleClose = () => {
    this.props.onClose();
  };

  downloadZip(_name, _tracks) {
    // console.log("download ", this.props);
    const urls = _tracks;
    const zip = new JSZip();
    let count = 0;
    const zipFilename = _name + "_tracks.zip";

    urls.forEach(async (url) => {
      let fileName = url;
      // console.log("url ", url);
      let fileUrl;
      if (url.audio_type.includes("MP3")) {
        fileUrl = await MediaService.getMp3(url);
      } else if (url?.includes("WAV")) {
        fileUrl = await MediaService.getWav(url);
      } else if (url?.includes("STEM")) {
        fileUrl = await MediaService.getStem(url);
      }
      // console.log("fileUrl", fileUrl);

      try {
        const file = await JSZipUtils.getBinaryContent(fileUrl);
        zip.file(fileName, file, { binary: true });
        count++;
        if (count === urls.length) {
          zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, zipFilename);
          });
        }
      } catch (err) {
        this.props.showError("Something went wrong...");
        console.log(err);
      }
    });
  }

  setMediaType(selectedClassicMediaType, selectedOnlineSocialMediaType) {
    var selectedMediaType = "";
    // console.log(
    //   "selectedClassicMediaType,selectedOnlineSocialMediaType",
    //   selectedClassicMediaType,
    //   selectedOnlineSocialMediaType
    // );

    if (
      selectedClassicMediaType.length != 0 &&
      selectedOnlineSocialMediaType.length != 0
    ) {
      selectedMediaType += `Classic: ${selectedClassicMediaType.join(", ")},
      Online Social: ${selectedOnlineSocialMediaType.join(", ")}
      `;
      // ,${this.state.otherClassicMediaType},
      // , ${this.state.otherOnlineSocialMediaType}
      return selectedMediaType;
    } else if (
      selectedClassicMediaType.length != 0 &&
      selectedOnlineSocialMediaType.length == 0
    ) {
      selectedMediaType += `Classic: ${selectedClassicMediaType.join(", ")}`;
      return selectedMediaType;
    } else if (
      selectedClassicMediaType.length == 0 &&
      selectedOnlineSocialMediaType.length != 0
    ) {
      selectedMediaType += `Online Social: ${selectedOnlineSocialMediaType.join(
        ", "
      )}`;
      return selectedMediaType;
    } else {
      return "-";
    }
  }

  render() {
    const { classes, intl } = this.props;

    const initialValues = Cookies.get("basketFormData")
      ? JSON.parse(Cookies.get("basketFormData"))
      : {
          topic_product_sub_brand_model: "",
          campaignName: "",
          format: "",
          duration: "",
          advertising_agency_name: "",
          production_company_name: "",
          media_type: "",
          country: "",
          airing_month: new Date(),
        };

    let YupValidationSchema = "";
    const YupValidationSchemaBase = Yup.object().shape({
      topic_product_sub_brand_model: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      campaignName: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      format: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      duration: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      advertising_agency_name: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      production_company_name: Yup.string()
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .required("Required"),
      country: Yup.string().trim().required("Required"),
      airing_month: Yup.string().trim().required("Required").nullable(),
    });

    YupValidationSchema = YupValidationSchemaBase;

    /////////////////////////

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="download-wav-dialog"
        open={this.props.open}
        fullWidth
        maxWidth="xl"
        classes={{ paper: classes.dialogPaper }}
        className="BasketDownloadDialog"
      >
        <DialogTitle
          id="download-wav-dialog"
          className="mb_SubmitDownload_title"
        >
          <p className="mb_h3">
            <FormattedMessage id="trackDetail.dowloadWAV.title" />
          </p>
        </DialogTitle>
        <DialogContent className="mb_Dialog_Content">
          <Formik
            initialValues={initialValues}
            validationSchema={YupValidationSchema}
            onSubmit={(values, actions) => {
              values.media_type = this.setMediaType(
                this.state.selectedClassicMediaType,
                this.state.selectedOnlineSocialMediaType
              );

              // console.log(
              //   "media",
              //   this.setMediaType(
              //     this.state.selectedClassicMediaType,
              //     this.state.selectedOnlineSocialMediaType
              //   )
              // );

              // console.log("this.props.cookie", this.props.cookieBasket);
              var trackNames = [];

              var trackListArr = this.props.trackList?.forEach((track, i) => {
                // console.log("tracks", track);
                trackNames.push(
                  `${track.title}(${this.props.cookieBasket[i].audio_type})`
                );
              });

              values.track_names = trackNames.join(", ");

              const date = new Date(values.airing_month);

              var airingMonthYearOnly =
                (date.getMonth() + 1).toString().padStart(2, "0") +
                "/" +
                date.getFullYear();
              values.airing_month = airingMonthYearOnly;

              values.media_type = this.setMediaType(
                this.state.selectedClassicMediaType,
                this.state.selectedOnlineSocialMediaType
              );

              if (this.state.otherClassicMediaType) {
                // console.log("other is there");
                axios
                  .post(
                    "/api/media_type/insert",
                    {
                      media_type: this.state.otherClassicMediaType,
                      media_type_parent: "classic",
                    },
                    {
                      headers: {
                        BrandName: getSuperBrandId(),
                      },
                    }
                  )
                  .then((res) => {
                    // console.log("Res", res.data);
                  });
              }

              if (this.state.otherOnlineSocialMediaType) {
                // console.log("other is there");
                axios
                  .post(
                    "/api/media_type/insert",
                    {
                      media_type: this.state.otherOnlineSocialMediaType,
                      media_type_parent: "online social",
                    },
                    {
                      headers: {
                        BrandName: getSuperBrandId(),
                        BrandId: localStorage.getItem("brandId"),
                      },
                    }
                  )
                  .then((res) => {
                    // console.log("Res", res.data);
                  });
              }

              // console.log("this.props.trackList", this.props.trackList);

              var trackDetails = [];

              this.props.trackList.forEach((track, i) => {
                MediaService.getImage(track.preview_image_url).then(
                  (response) => {
                    // console.log("res", response);

                    trackDetails.push({
                      track_name: track.registration_title,
                      gema_number: track.gema_number,
                      author_gema_number: track.author_gema_number,
                      publisher_gema_number: track.publisher_gema_number,
                      cover_image: response,
                      track_media_type: this.props.cookieBasket[i].audio_type,
                    });

                    values.tracks_details = trackDetails;
                  }
                );
              });

              setTimeout(() => {
                // console.log("values", values);

                this.downloadZip("basket", this.state.tracksUrlArr);
                axios
                  .post("/api/media_type/mail", values, {
                    headers: {
                      BrandName: getSuperBrandId(),
                      BrandId: localStorage.getItem("brandId"),
                    },
                  })
                  .then((res) => {
                    // console.log("Res", res.data);
                  });

                this.props.removeDownloadedTracksFromDownloadBasketAndResetDownloadProcess();
                this.props.handleBasketEmptyMsg(
                  "Basket tracks are downloaded...add new tracks to basket"
                );

                setTimeout(() => {
                  this.props.fetchBasketData();
                  this.handleClose();
                }, 500);
              }, 3000);
            }}
            render={({
              values,
              errors,
              setFieldValue,
              setFieldTouched,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              isValid,
              dirty,
            }) => (
              <form onSubmit={handleSubmit} className="mb_SubmitDownload_form">
                {/* {console.log("values", values)} */}
                {/* {console.log("tracklist**", this.props.trackList)} */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label
                        htmlFor="topic_product_sub_brand_model"
                        className="mb_padding"
                      >
                        <FormattedMessage id="trackDetail.dowloadWAV.topicInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.topicInputPlaceholder"]}`}
                        id="topic_product_sub_brand_model"
                        name="topic_product_sub_brand_model"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.topic_product_sub_brand_model}
                      />
                      {errors.topic_product_sub_brand_model && (
                        <div className="mb_error">
                          {errors.topic_product_sub_brand_model}
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="campaignName" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.campainInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.campainInputPlaceholder"]}`}
                        id="campaignName"
                        name="campaignName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.campaignName}
                      />
                      {errors.campaignName && touched.campaignName && (
                        <div className="mb_error">{errors.campaignName}</div>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="format" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.formatInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="format"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.formatInputPlaceholder"]}`}
                        name="format"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.format}
                      />
                      {errors.format && touched.format && (
                        <div className="mb_error">{errors.format}</div>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="duration" className="mb_padding">
                        <FormattedMessage id="trackDetail.dowloadWAV.durationsInputTitle" />
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="duration"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.durationsInputPlaceholder"]}`}
                        name="duration"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.duration}
                      />
                      {errors.duration && touched.duration && (
                        <div className="mb_error">{errors.duration}</div>
                      )}
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label
                        htmlFor="advertising_agency_name"
                        className="mb_padding"
                      >
                        <FormattedMessage id="trackDetail.dowloadWAV.advertisingAgencyInputTitle" />
                        {errors.advertising_agency_name &&
                          touched.advertising_agency_name && (
                            <span className="mb_error">
                              &nbsp;&nbsp;&nbsp;
                              {`${errors.advertising_agency_name}`}
                            </span>
                          )}
                      </label>
                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="advertising_agency_name"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.advertisingAgencyInputTitleInputPlaceholder"]}`}
                        name="advertising_agency_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.advertising_agency_name}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label
                        htmlFor="production_company_name"
                        className="mb_padding"
                      >
                        <span>
                          <FormattedMessage id="trackDetail.dowloadWAV.productionCompanyInputTitle" />
                        </span>
                        {errors.production_company_name &&
                          touched.production_company_name && (
                            <span className="mb_error">
                              {" "}
                              &nbsp;&nbsp;&nbsp;
                              {`${errors.production_company_name}`}
                            </span>
                          )}
                      </label>

                      <br />
                      <input
                        className="mb_input"
                        type="text"
                        id="production_company_name"
                        placeholder={`${intl.messages["trackDetail.dowloadWAV.productionCompanyInputPlaceholder"]}`}
                        name="production_company_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.production_company_name}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <label
                      htmlFor="production_company_name"
                      className="mb_padding"
                    >
                      <span>
                        <FormattedMessage id="trackDetail.dowloadWAV.selectMediaTypeInputTitle" />
                      </span>
                    </label>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb_input_container mb_input_checkboxes">
                      <label htmlFor="media_type" className="mb_padding">
                        <span className="mb_padding checkboxes_title">
                          Classic:
                        </span>
                        {errors.media_type && touched.media_type && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.media_type}`}
                          </span>
                        )}
                      </label>
                      <br />
                      <MutipleCheckBoxes
                        mediaType={this.state.classicMediaTypeList}
                        setMediaTypeData={this.setClassicMediaTypeData}
                        initialValues={initialValues}
                      />
                    </div>
                    <br />
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container mb_input_checkboxes">
                      <label htmlFor="media_type" className="mb_padding">
                        <span className="mb_padding checkboxes_title">
                          Online social:
                        </span>
                        {errors.media_type && touched.media_type && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.media_type}`}
                          </span>
                        )}
                      </label>

                      <br />
                      <MutipleCheckBoxes
                        mediaType={this.state.onlineSocialMediaTypeList}
                        setMediaTypeData={this.setOnlineSocialMediaTypeData}
                        initialValues={initialValues}
                      />
                    </div>
                    <br />
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="country" className="mb_padding">
                        <span>
                          <FormattedMessage id="trackDetail.dowloadWAV.countryNameInput" />
                        </span>
                        {errors.country && touched.country && (
                          <span className="mb_error">
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.country}`}
                          </span>
                        )}
                      </label>

                      <br />
                      <CustomSelect
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        error={errors.country}
                        touched={touched.country}
                        styles={customStyles}
                        name="country"
                        value={values.country}
                      />
                    </div>
                    <br />
                  </Grid>

                  <Grid item xs={6}>
                    <div className="mb_input_container">
                      <label htmlFor="airing_month" className="mb_padding">
                        <span>
                          <FormattedMessage id="trackDetail.dowloadWAV.airingmonthInputTitle" />
                        </span>
                        {errors.airing_month && touched.airing_month && (
                          <span className="mb_error">
                            {" "}
                            &nbsp;&nbsp;&nbsp;
                            {`${errors.airing_month}`}
                          </span>
                        )}
                      </label>
                      <br />
                      <br />
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          placeholder="Airing Month"
                          autoComplete="off"
                          id="date-picker-dialog"
                          inputVariant="outlined"
                          views={["month", "year"]}
                          error={errors.airing_month}
                          touched={touched.airing_month}
                          value={values.airing_month}
                          onChange={(value) =>
                            setFieldValue("airing_month", value)
                          }
                          className="datePicker"
                          openTo="year"
                          format="MM/yyyy"
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>

                  <Grid item xs={6} className="mb_center">
                    <button
                      type="button"
                      onClick={() => {
                        this.props.showSuccess("Data saved to draft!");
                        values.media_type = [
                          ...this.state.selectedClassicMediaType,
                          ...this.state.selectedOnlineSocialMediaType,
                        ];

                        addCookie("basketFormData", JSON.stringify(values), 30);
                        this.handleClose();
                      }}
                      disabled={initialValues === values}
                      className="saveToDraftBtn"
                    >
                      Save to draft
                    </button>
                  </Grid>

                  <Grid item xs={6} className="mb_center">
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting || !dirty}
                      text="Download"
                      borderRadius="25px"
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
