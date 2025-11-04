import Grid from "@mui/material/Grid";
import { withStyles } from "@mui/styles";
import { Field, Formik } from "formik";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import * as Yup from "yup";
import "../../_styles/DownloadBasketFormPage.css";
import Cookies from "js-cookie";
import countryNames from "../../authentication/components/Register/CountryNames";
import addCookie from "../../common/utils/AddCookie";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import saveAs from "save-as";
import MutipleCheckBoxes from "../components/MultipleCheckBoxes/MutipleCheckBoxes";
import {
  removeDownloadedTracksFromDownloadBasketAndResetDownloadProcess,
  removeSelectedTrackFromDownloadBasket,
} from "../../redux/actions/trackDownloads";
import {
  showSuccess,
  showError,
} from "../../redux/actions/notificationActions";
import { connect } from "react-redux";
import AsyncService from "../../networking/services/AsyncService";
import MediaService from "../../common/services/MediaService";
import MainLayout from "../../common/components/MainLayout/MainLayout";
import ButtonWrapper from "../../branding/componentWrapper/ButtonWrapper";
import SonicInputLabel from "../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import InputWrapper from "../../branding/componentWrapper/InputWrapper";
import SelectWrapper from "../../branding/componentWrapper/SelectWrapper";
import DatePickerWrapper from "../../branding/componentWrapper/DatePickerWrapper";
import getSuperBrandId from "../../common/utils/getSuperBrandId";
import _ from "lodash";
import ProgressBarWrapper from "../../branding/componentWrapper/ProgressBarWrapper";
import getConfigJson from "../../common/utils/getConfigJson";
import {
  resetTrackDownloadingProcess,
  setDownloadBasketMeta,
} from "../../redux/actions/trackDownloads/tracksDownload";
import { BrandingContext } from "../../branding/provider/BrandingContext";
import { getUserId } from "../../common/utils/getUserAuthMeta";

const styles = {
  dialogPaper: {
    minHeight: "90vh",
    maxHeight: "90vh",
    padding: 0,
  },
};

function removePropertiesStartingWith(obj, prefix) {
  const keys = Object.keys(obj);

  const filteredKeys = keys.filter((key) => !key.startsWith(prefix));

  const filteredObject = {};
  filteredKeys.forEach((key) => {
    filteredObject[key] = obj[key];
  });

  return filteredObject;
}

class DownloadBasketFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.fetchBasketData = this.fetchBasketData.bind(this);
  }

  state = {
    classicMediaTypeList: null,
    onlineSocialMediaTypeList: null,
    tracksUrlArr: null,
    cookieBasket: [],
    trackList: [],
    allMediaTypeMeta: [],
    downloadFormField: null,
  };
  static contextType = BrandingContext;
  componentDidMount() {
    this.fetchMediaList();
    this.fetchBasketData();
    const { jsonConfig: CONFIG } = this.context;
    this.setState({ downloadFormField: CONFIG?.DOWNLOAD_FORM_META });
  }

  fetchBasketData() {
    if (this.props?.downloadBasket?.tracksInDownloadBasket?.length > 0) {
      const idsArray = this.props?.downloadBasket?.tracksInDownloadBasket?.map(
        (track) => {
          return track.id;
        }
      );
      let uniqueIds = [...(new Set(idsArray) || [])];

      if (idsArray.length !== 0) {
        AsyncService.postData("/tracks/tracks_details_by_ids", uniqueIds)
          .then((res) => {
            var tracksInBasket =
              this.props?.downloadBasket?.tracksInDownloadBasket
                ?.map((track) => {
                  const result = res.data?.find((trackfromDB) => {
                    return trackfromDB?.id == track.id;
                  });
                  if (!!result) {
                    return { ...result, ...track };
                  } else {
                    return null;
                  }
                })
                ?.filter(Boolean);
            this.setState({
              trackList: tracksInBasket,
            });
          })
          .catch((err) => {
            console.log("Error while fetching tracks details by ids", err);
          });
      }
    }
  }

  fetchMediaList() {
    AsyncService.loadData("/media_type/getAllMediaMaster").then((res) => {
      const mediaTypeGroup = _.groupBy(res.data, "parentMedia");
      const mediaTypeGroupArr = Object.keys(mediaTypeGroup)?.map((data) => ({
        mediaType: data,
        mediaTypeId: mediaTypeGroup?.[data]?.[0]?.parentId,
        mediaTypeList: mediaTypeGroup[data],
      }));
      this.setState({
        allMediaTypeMeta: mediaTypeGroupArr || [],
      });
    });
  }

  handleClose = () => {
    this.props.onClose();
  };

  getTrackNamesByIds = (id, trackObj) => {
    //console.log("name:::",ids.map(id => trackObj.find(item => item.track_id === id)?.track_name || '').filter(Boolean));
    //return ids.map(id => trackObj.find(item => item.track_id === id)?.track_name || '').filter(Boolean);

    const track = trackObj.find((item) => item.id === id);
    return track ? track.name : track.url;
  };

  downloadZipAndSendEmail(_tracks, tracksToBeDownload, values) {
    AsyncService.postData("/media_type/mail", values).then((res) => {
      var ids = this.props?.downloadBasket?.tracksInDownloadBasket?.map(
        (track) => {
          return track.id;
        }
      );
      var uniqueIDS = [...new Set(ids)];
      var lyricsArray = uniqueIDS.map((id) => {
        return {
          id: id,
          url: `${id}_track_lyrics.txt`,
          name: this.getTrackNamesByIds(id, _tracks),
        };
      });
      const urls = [..._tracks, ...lyricsArray];

      const zip = new JSZip();
      let count = 0;
      let isErrorWhileDownloadingFewFiles = false;

      const zipFilename =
        res.data?.zipFilename ||
        `${getUserId()}-${getSuperBrandId()}-downloadtracks-${new Date().toJSON()}`;

      urls.forEach(async (trackobj) => {
        let fileName = "";
        let fileUrl;
        if (trackobj.url?.includes(".mp3")) {
          fileName = this.getNameFormat(trackobj, ".mp3");
          try {
            fileUrl = await MediaService.getMp3(trackobj.url);
          } catch (error) {
            isErrorWhileDownloadingFewFiles = true;
            console.log("getMp3 error", error);
          }
        } else if (trackobj.url?.includes(".wav")) {
          fileName = this.getNameFormat(trackobj, ".wav");
          try {
            fileUrl = await MediaService.getWav(trackobj.url);
          } catch (error) {
            isErrorWhileDownloadingFewFiles = true;
            console.log("getWav error", error);
          }
        } else if (trackobj.url?.includes(".zip")) {
          fileName = this.getNameFormat(trackobj, ".zip");
          try {
            fileUrl = await MediaService.getStem(trackobj.url);
          } catch (error) {
            isErrorWhileDownloadingFewFiles = true;
            console.log("getStem error", error);
          }
        } else if (trackobj.url?.includes(".txt")) {
          fileName = this.getNameFormat(trackobj, ".txt");
          try {
            fileUrl = await MediaService.getTrackLyrics(trackobj.url);
          } catch (error) {
            isErrorWhileDownloadingFewFiles = true;
            console.log("getTrackLyrics error", error);
          }
          if (fileUrl) {
            try {
              const file = await JSZipUtils.getBinaryContent(fileUrl);
              zip.file(fileName, file, { binary: true });
            } catch (error) {
              console.error("Error while downloading txt file");
            }
          }
        }

        if (!trackobj.url?.includes(".txt") && fileUrl !== undefined) {
          const file = await JSZipUtils.getBinaryContent(fileUrl);
          zip.file(fileName, file, { binary: true });
        }
        count++;
        const downloadedFileCountPercentage = (count / urls.length) * 100;
        this.props.setDownloadBasketMeta({
          trackDownloadingPercent: downloadedFileCountPercentage,
        });
        if (count === urls.length) {
          zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, `${zipFilename}.zip`);
            this.props.removeDownloadedTracksFromDownloadBasketAndResetDownloadProcess(
              tracksToBeDownload
            );
            setTimeout(() => {
              this.fetchBasketData();
              this.props.showSuccess(
                isErrorWhileDownloadingFewFiles
                  ? "Tracks downloaded successfully, Few of the files were not able to download"
                  : "Tracks downloaded successfully"
              );
            }, 500);
          });
        }
      });
    });
  }

  getNameFormat = (_trackobj, ext) => {
    let name = _trackobj.id + "_" + _trackobj.name.replaceAll(" ", "-") + ext;
    return name;
  };

  getSelectedMediaMeta = (values) => {
    let selectedAllMediaType = values.media_type?.map((data) => ({
      parentId: data.split("-")[0],
      parentMedia: data.split("-")[1],
      mediaId: data.split("-")[2],
      mediaType: data.split("-")[3],
    }));
    let selectedAllMediaTypeIds = selectedAllMediaType?.map(
      (data) => data.mediaId
    );
    let otherMedia = [];
    Object.keys(values).map((key) => {
      const value = values[key];
      if (key.startsWith("otherMedia-")) {
        if (!!value) {
          otherMedia.push({
            mediaParentId: +key.split("-")[1],
            otherMediaType: value,
          });
        }
      }
    });
    const mediaTypeGroup = _.groupBy(selectedAllMediaType, "parentMedia");
    const mediaTypeGroupArr = Object.keys(mediaTypeGroup)?.map((data) => ({
      mediaType: data,
      mediaParentId: +mediaTypeGroup[data]?.[0]?.parentId,
      mediaTypeList:
        mediaTypeGroup[data]?.map((media) => media.mediaType) || [],
    }));
    let selectedAiringMediaInMail = mediaTypeGroupArr?.map((mediaType) => {
      let selectedMediaParentData;
      let checkOtherMediaType = otherMedia?.find(
        (media) => media.mediaParentId === mediaType.mediaParentId
      );
      if (!!checkOtherMediaType?.otherMediaType) {
        selectedMediaParentData = [
          ...(mediaType?.mediaTypeList || []),
          checkOtherMediaType?.otherMediaType,
        ];
      } else {
        selectedMediaParentData = mediaType?.mediaTypeList;
      }
      if (!selectedMediaParentData.toString()) {
        return ``;
      } else {
        return `${mediaType?.mediaType}: ${selectedMediaParentData.toString()}`;
      }
    });
    return {
      selectedAiringMedia: selectedAllMediaTypeIds?.toString(),
      selectedAiringMediaInMail: selectedAiringMediaInMail
        ?.filter(Boolean)
        ?.toString(),
      otherSelectedAiringMedia: otherMedia,
    };
  };

  isFieldMandatory = (fieldName) => {
    const field = this.state.downloadFormField?.fieldsForm?.find(
      (field) => field?.fieldName === fieldName
    );
    return field ? field?.isMandatory : false;
  };

  render() {
    const { intl } = this.props;

    let init = {
      topic_product_sub_brand_model: "",
      campaignName: "",
      format: "",
      duration: "",
      advertising_agency_name: "",
      contact_email: "",
      idNumber: "",
      media_type: [],
      country: null,
      airing_month: new Date(),
      "otherMedia-1": "",
      "otherMedia-2": "",
    };

    let newInitialValue = {};

    const fieldNames = this.state.downloadFormField?.fieldsForm?.map(
      (field) => field?.fieldName
    );

    for (const key in init) {
      if (fieldNames?.includes(key)) {
        newInitialValue[key] = init[key];
      }
    }

    const initialValues = Cookies.get("basketFormData")
      ? JSON.parse(Cookies.get("basketFormData"))
      : newInitialValue;

    let allMediaTypesList = this.state.allMediaTypeMeta
      .flatMap((data) => data.mediaTypeList)
      .map((data) => data.mediaType?.toLowerCase());

    let YupValidationSchema = "";
    const YupValidationSchemaBase = Yup.object().shape({
      topic_product_sub_brand_model: Yup.string()
        .matches(/^(?!\s+$).*/, "Spaces are not allowed")
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("topic_product_sub_brand_model"),
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string().notRequired(),
        }),

      campaignName: Yup.string()
        .matches(/^(?!\s+$).*/, "Spaces are not allowed")
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("campaignName"),
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string().notRequired(),
        }),
      format: Yup.string()
        .matches(/^(?!\s+$).*/, "Spaces are not allowed")
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("format"),
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string().notRequired(),
        }),
      duration: Yup.string()
        .matches(/^(?!\s+$).*/, "Spaces are not allowed")
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("duration"),
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string().notRequired(),
        }),
      advertising_agency_name: Yup.string()
        .matches(/^(?!\s+$).*/, "Spaces are not allowed")
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("advertising_agency_name"),
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string().notRequired(),
        }),
      contact_email: Yup.string()
        .matches(/^(?!\s+$).*/, "Spaces are not allowed")
        .email("Field should contain a valid e-mail")
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("contact_email"),
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string().notRequired(),
        }),
      idNumber: Yup.string()
        .matches(/^(?!\s+$).*/, "Spaces are not allowed")
        .min(2, "Too Short!")
        .max(200, "Too Long!")
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("idNumber"),
          then: () => Yup.string().required("Required"),
          otherwise: () => Yup.string().notRequired(),
        }),
      country: Yup.object().when([], {
        is: () => this.isFieldMandatory("country"),
        then: () => Yup.object().required("Required"),
        otherwise: () => Yup.object().notRequired(),
      }),
      airing_month: Yup.string()
        .trim()
        .when([], {
          is: () => this.isFieldMandatory("airing_month"),
          then: () => Yup.string().required("Required").nullable(),
          otherwise: () => Yup.string().notRequired(),
        }),
      "otherMedia-1": Yup.string()
        .trim()
        .test(
          "existsCheck",
          "Already exist, please add another one",
          (value) => !allMediaTypesList.includes(value?.toLowerCase())
        ),
      "otherMedia-2": Yup.string()
        .trim()
        .test(
          "existsCheck",
          "Already exist, please add another one",
          (value) => !allMediaTypesList.includes(value?.toLowerCase())
        ),
      media_type: Yup.array().when(["otherMedia-1", "otherMedia-2"], {
        is: (otherMedia1, otherMedia2) => {
          return otherMedia1 || otherMedia2;
        },
        then: () => Yup.array(),
        otherwise: () =>
          Yup.string()
            .trim()
            .when([], {
              is: () => this.isFieldMandatory("media_type"),
              then: () => Yup.array().min(1, "Select at least one media"),
              otherwise: () => Yup.array().notRequired(),
            }),
      }),
    });

    YupValidationSchema = YupValidationSchemaBase;

    const onDownloadFormSubmit = (values) => {
      try {
        let tracksToBeDownload =
          this.props?.downloadBasket?.tracksInDownloadBasket?.map((data) => ({
            ...data,
            isDownloadInProgress: true,
          }));

        this.props.setDownloadBasketMeta({
          tracksInDownloadBasket: tracksToBeDownload,
          trackDownloadingPercent: 1,
          showTrackDownloadingProgress: true,
          isTrackDownloadingInBG: true,
        });
        let selectedMediaMeta = this.getSelectedMediaMeta(values);
        values = {
          ...values,
          ...selectedMediaMeta,
          country: values?.country?.label,
        };

        const date = new Date(values.airing_month);
        const aring_selectMonth = (date.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const aring_year = date.getFullYear();
        if (!isNaN(aring_selectMonth || aring_year)) {
          const airingMonthYearOnly = aring_selectMonth + "/" + aring_year;
          values.airing_month = airingMonthYearOnly;
        }

        const trackDetails = this.state.trackList.map((track, i) => ({
          track_id: track.id,
          track_name: track.title,
          gema_number: track.gema_number,
          author_gema_number: track.author_gema_number,
          publisher_gema_number: track.publisher_gema_number,
          cover_image: track.preview_image_url,
          track_audio_type:
            this.props?.downloadBasket?.tracksInDownloadBasket?.[i]
              ?.audio_type === "STEM"
              ? "STEMS_ZIP_WAV"
              : this.props?.downloadBasket?.tracksInDownloadBasket?.[i]
                  ?.audio_type,
          registration_title: track.registration_title,
        }));

        values.tracks_details = trackDetails;
        const trackMediaFileUrls = this.state.trackList.map((track, i) => {
          switch (track?.audio_type) {
            case "MP3":
              return {
                id: track.id,
                url: track.preview_track_url,
                name: track.title,
              };
            case "WAV":
              return {
                id: track.id,
                url: track.track_url,
                name: track.title,
              };
            case "STEM":
              return {
                id: track.id,
                url: track.stems_zip_wav_url,
                name: track.title,
              };

            default:
              return {
                id: track.id,
                url: track.preview_track_url,
                name: track.title,
              };
          }
        });

        const { media_type, ...formValues } = values;
        let filteredFormValues = removePropertiesStartingWith(
          formValues,
          "otherMedia-"
        );
        this.downloadZipAndSendEmail(
          trackMediaFileUrls,
          tracksToBeDownload,
          filteredFormValues
        );
      } catch (error) {
        this.props.showError("Something went wrong...");
        this.props.resetTrackDownloadingProcess();
        console.log(error);
      }
    };

    /////////////////////////
    if (
      !this.props?.downloadBasket?.tracksInDownloadBasket ||
      this.props?.downloadBasket?.tracksInDownloadBasket?.length === 0 ||
      this.props?.downloadBasket?.isTrackDownloadingInBG
    ) {
      return (
        <MainLayout>
          <div className="downloadBasketFormPage_Content ">
            <div className="downloadBasketFormPage">
              {!this.props?.downloadBasket?.tracksInDownloadBasket ||
                (this.props?.downloadBasket?.tracksInDownloadBasket?.length ===
                  0 && (
                  <div className="downloadBasket_Empty">
                    <p className="downloadBasketPage__emptyheaderTextBox">
                      Your basket is empty !
                    </p>
                  </div>
                ))}
              {this.props?.downloadBasket?.isTrackDownloadingInBG && (
                <div className="downloadBasketSpinner">
                  {this.props?.downloadBasket?.trackDownloadingPercent >= 0 && (
                    <>
                      <ProgressBarWrapper
                        processPercent={
                          this.props?.downloadBasket?.trackDownloadingPercent
                        }
                      />
                      <p className="downloadProgressNoteTitle">
                        Downloading tracks...
                      </p>
                      <p className="downloadProgressNote">
                        You can wait or navigate to other pages while download
                        completes
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </MainLayout>
      );
    }

    return (
      <MainLayout>
        <div className="downloadBasketFormPage_Content ">
          <div className="downloadBasketFormPage">
            <Formik
              validateOnMount={true}
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={YupValidationSchema}
              onSubmit={onDownloadFormSubmit}
              render={({
                values,
                errors,
                setFieldValue,
                touched,
                handleSubmit,
                isSubmitting,
                isValid,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="mb_basketDownload_SubmitDownload_form"
                >
                  <p className="mb_basketDownload_h3 boldFamily">
                    <FormattedMessage id="trackDetail.dowloadWAV.title" />
                  </p>
                  <Grid
                    container
                    spacing={2}
                    className="basket_download_form_container"
                  >
                    {fieldNames?.includes("topic_product_sub_brand_model") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="topic_product_sub_brand_model">
                          <FormattedMessage id="trackDetail.dowloadWAV.topicInputTitle" />{" "}
                          {this.isFieldMandatory(
                            "topic_product_sub_brand_model"
                          ) && <span>*</span>}
                        </SonicInputLabel>
                        <Field
                          id="topic_product_sub_brand_model"
                          name="topic_product_sub_brand_model"
                          type="text"
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.topicInputPlaceholder"]}`}
                          component={InputWrapper}
                        />
                        {errors.topic_product_sub_brand_model &&
                          touched.topic_product_sub_brand_model && (
                            <p className="mb_basketDownload_error">
                              {errors.topic_product_sub_brand_model}
                            </p>
                          )}
                      </Grid>
                    )}
                    {fieldNames?.includes("campaignName") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="campaignName">
                          <FormattedMessage id="trackDetail.dowloadWAV.campainInputTitle" />
                          {this.isFieldMandatory("campaignName") && (
                            <span>*</span>
                          )}
                        </SonicInputLabel>
                        <Field
                          id="campaignName"
                          name="campaignName"
                          type="text"
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.campainInputPlaceholder"]}`}
                          component={InputWrapper}
                        />
                        {errors.campaignName && touched.campaignName && (
                          <p className="mb_basketDownload_error">
                            {errors.campaignName}
                          </p>
                        )}
                      </Grid>
                    )}

                    {fieldNames?.includes("format") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="format">
                          <FormattedMessage id="trackDetail.dowloadWAV.formatInputTitle" />
                          {this.isFieldMandatory("format") && <span>*</span>}
                        </SonicInputLabel>
                        <Field
                          id="format"
                          name="format"
                          type="text"
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.formatInputPlaceholder"]}`}
                          component={InputWrapper}
                        />
                        {errors.format && touched.format && (
                          <p className="mb_basketDownload_error">
                            {errors.format}
                          </p>
                        )}
                      </Grid>
                    )}
                    {fieldNames?.includes("duration") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="duration">
                          <FormattedMessage id="trackDetail.dowloadWAV.durationsInputTitle" />
                          {this.isFieldMandatory("duration") && <span>*</span>}
                        </SonicInputLabel>
                        <Field
                          id="duration"
                          name="duration"
                          type="text"
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.durationsInputPlaceholder"]}`}
                          component={InputWrapper}
                        />
                        {errors.duration && touched.duration && (
                          <p className="mb_basketDownload_error">
                            {errors.duration}
                          </p>
                        )}
                      </Grid>
                    )}
                    {fieldNames?.includes("advertising_agency_name") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="advertising_agency_name">
                          <FormattedMessage id="trackDetail.dowloadWAV.advertisingAgencyInputTitle" />
                          {this.isFieldMandatory("advertising_agency_name") && (
                            <span>*</span>
                          )}
                        </SonicInputLabel>
                        <Field
                          id="advertising_agency_name"
                          name="advertising_agency_name"
                          type="text"
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.advertisingAgencyInputTitleInputPlaceholder"]}`}
                          component={InputWrapper}
                        />
                        {errors.advertising_agency_name &&
                          touched.advertising_agency_name && (
                            <p className="mb_basketDownload_error">
                              {errors.advertising_agency_name}
                            </p>
                          )}
                      </Grid>
                    )}
                    {fieldNames?.includes("contact_email") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="contact_email">
                          <FormattedMessage id="trackDetail.dowloadWAV.producerEmailInputTitle" />
                          {this.isFieldMandatory("contact_email") && (
                            <span>*</span>
                          )}
                        </SonicInputLabel>
                        <Field
                          id="contact_email"
                          name="contact_email"
                          type="text"
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.producerEmailInputPlaceholder"]}`}
                          component={InputWrapper}
                        />
                        {errors.contact_email && touched.contact_email && (
                          <p className="mb_basketDownload_error">
                            {errors.contact_email}
                          </p>
                        )}
                      </Grid>
                    )}
                    {fieldNames?.includes("country") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="country">
                          <FormattedMessage id="trackDetail.dowloadWAV.countryNameInputTitle" />
                          {this.isFieldMandatory("country") && <span>*</span>}
                        </SonicInputLabel>
                        <Field
                          id="country"
                          as="select"
                          name="country"
                          component={SelectWrapper}
                          options={countryNames}
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.countryNameInputPlaceholder"]}`}
                        />
                        {errors.country && touched.country && (
                          <p className="mb_basketDownload_error">
                            {errors.country}
                          </p>
                        )}
                        {/* <br /> */}
                      </Grid>
                    )}
                    {fieldNames?.includes("idNumber") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="idNumber">
                          <FormattedMessage id="trackDetail.dowloadWAV.IDNumberInputTitle" />
                          {this.isFieldMandatory("idNumber") && <span>*</span>}
                        </SonicInputLabel>
                        <Field
                          id="idNumber"
                          name="idNumber"
                          type="text"
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.IDNumberInputPlaceholder"]}`}
                          component={InputWrapper}
                        />
                        {errors.idNumber && touched.idNumber && (
                          <p className="mb_basketDownload_error">
                            {errors.idNumber}
                          </p>
                        )}
                        {/* <br /> */}
                      </Grid>
                    )}
                    {fieldNames?.includes("airing_month") && (
                      <Grid item xs={6}>
                        <SonicInputLabel htmlFor="airing_month">
                          <FormattedMessage id="trackDetail.dowloadWAV.airingmonthInputTitle" />
                          {this.isFieldMandatory("airing_month") && (
                            <span>*</span>
                          )}
                        </SonicInputLabel>
                        <DatePickerWrapper
                          placeholder={`${intl.messages["trackDetail.dowloadWAV.airingmonthInputPlaceholder"]}`}
                          format="MM/yyyy"
                          value={values.airing_month}
                          className="airingMonthPicker"
                          onChange={(value) => {
                            setFieldValue("airing_month", value);
                          }}
                          // minDate={Date.now()}
                        />
                        {errors.airing_month && touched.airing_month && (
                          <p className="mb_basketDownload_error">
                            {errors.airing_month}
                          </p>
                        )}
                      </Grid>
                    )}
                    {fieldNames?.includes("media_type") && (
                      <>
                        {/* <Grid item xs={6}>
                                <SonicInputLabel
                                  style={{ padding: "15px 0 0" }}
                                >
                                  <FormattedMessage id="trackDetail.dowloadWAV.selectMediaTypeInputTitle" />
                                  {this.isFieldMandatory("media_type") && (
                                    <span>*</span>
                                  )}
                                </SonicInputLabel>
                              </Grid> */}
                        <Grid item xs={6}>
                          <SonicInputLabel style={{ padding: "15px 0" }}>
                            <FormattedMessage id="trackDetail.dowloadWAV.selectMediaTypeInputTitle" />
                            {this.isFieldMandatory("media_type") && (
                              <span>*</span>
                            )}
                          </SonicInputLabel>
                          <Grid container>
                            {this.state.allMediaTypeMeta.map((mediaType) => (
                              <Grid
                                key={mediaType?.mediaType}
                                item
                                xs={6}
                                style={{ paddingRight: "15px" }}
                              >
                                <SonicInputLabel
                                  style={{
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {mediaType?.mediaType}:
                                </SonicInputLabel>
                                <MutipleCheckBoxes
                                  mediaTypeList={mediaType?.mediaTypeList}
                                  mediaTypeParentId={mediaType?.mediaTypeId}
                                  name="media_type"
                                  setFieldValue={setFieldValue}
                                  otherMediaType={values.otherMediaType}
                                />
                                {errors?.[
                                  `otherMedia-${mediaType?.mediaTypeId}`
                                ] && (
                                  <p className="mb_basketDownload_error">
                                    {
                                      errors?.[
                                        `otherMedia-${mediaType?.mediaTypeId}`
                                      ]
                                    }
                                  </p>
                                )}
                                {/* <br /> */}
                              </Grid>
                            ))}
                            {errors.media_type && touched.media_type && (
                              <p className="mb_basketDownload_error">
                                {errors.media_type}
                              </p>
                            )}
                          </Grid>
                        </Grid>
                      </>
                    )}

                    {/* <Grid
                            item
                            xs={6}
                            className="downloa_form_side_layout"
                          >
                            {fieldNames?.includes("country") && (
                              <Grid item xs={12}>
                                <SonicInputLabel htmlFor="country">
                                  <FormattedMessage id="trackDetail.dowloadWAV.countryNameInputTitle" />
                                  {this.isFieldMandatory("country") && (
                                    <span>*</span>
                                  )}
                                </SonicInputLabel>
                                <Field
                                  id="country"
                                  as="select"
                                  name="country"
                                  component={SelectWrapper}
                                  options={countryNames}
                                  placeholder={`${intl.messages["trackDetail.dowloadWAV.countryNameInputPlaceholder"]}`}
                                />
                                {errors.country && touched.country && (
                                  <p className="mb_basketDownload_error">
                                    {errors.country}
                                  </p>
                                )}
                                <br />
                              </Grid>
                            )}
                            {fieldNames?.includes("idNumber") && (
                              <Grid item xs={12}>
                                <SonicInputLabel htmlFor="idNumber">
                                  <FormattedMessage id="trackDetail.dowloadWAV.IDNumberInputTitle" />
                                  {this.isFieldMandatory("idNumber") && (
                                    <span>*</span>
                                  )}
                                </SonicInputLabel>
                                <Field
                                  id="idNumber"
                                  name="idNumber"
                                  type="text"
                                  placeholder={`${intl.messages["trackDetail.dowloadWAV.IDNumberInputPlaceholder"]}`}
                                  component={InputWrapper}
                                />
                                {errors.idNumber && touched.idNumber && (
                                  <p className="mb_basketDownload_error">
                                    {errors.idNumber}
                                  </p>
                                )}
                                <br />
                              </Grid>
                            )}
                            {fieldNames?.includes("airing_month") && (
                              <Grid item xs={12}>
                                <SonicInputLabel htmlFor="airing_month">
                                  <FormattedMessage id="trackDetail.dowloadWAV.airingmonthInputTitle" />
                                  {this.isFieldMandatory("airing_month") && (
                                    <span>*</span>
                                  )}
                                </SonicInputLabel>
                                <DatePickerWrapper
                                  placeholder={`${intl.messages["trackDetail.dowloadWAV.airingmonthInputPlaceholder"]}`}
                                  format="MM/yyyy"
                                  value={values.airing_month}
                                  className="airingMonthPicker"
                                  onChange={(value) => {
                                    setFieldValue("airing_month", value);
                                  }}
                                />
                                {errors.airing_month &&
                                  touched.airing_month && (
                                    <p className="mb_basketDownload_error">
                                      {errors.airing_month}
                                    </p>
                                  )}
                              </Grid>
                            )}
                          </Grid> */}
                  </Grid>

                  <Grid item xs={6} className=""></Grid>

                  <Grid
                    item
                    xs={6}
                    className="basketButtonContainer downloadFormButton"
                  >
                    <ButtonWrapper
                      type="button"
                      className="saveToDraftBtn"
                      onClick={() => {
                        this.props.showSuccess("Data saved to draft!");
                        addCookie("basketFormData", JSON.stringify(values), 30);
                        this.props.navigate("/basket/");
                      }}
                    >
                      <FormattedMessage id="trackDetail.dowloadWAV.saveAsDraftCartBtn" />
                    </ButtonWrapper>
                    <ButtonWrapper
                      type="submit"
                      disabled={!isValid || isSubmitting}
                    >
                      <FormattedMessage id="trackDetail.dowloadWAV.downloadCartBtn" />
                    </ButtonWrapper>
                  </Grid>
                </form>
              )}
            />
          </div>
        </div>
      </MainLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    downloadBasket: state.downloadBasket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showError: (msg) => dispatch(showError(msg)),
    showSuccess: (msg) => dispatch(showSuccess(msg)),
    removeSelectedTrackFromDownloadBasket: (track) =>
      dispatch(removeSelectedTrackFromDownloadBasket(track)),
    removeDownloadedTracksFromDownloadBasketAndResetDownloadProcess: (
      tracksToBeDownload
    ) =>
      dispatch(
        removeDownloadedTracksFromDownloadBasketAndResetDownloadProcess(
          tracksToBeDownload
        )
      ),
    resetTrackDownloadingProcess: () =>
      dispatch(resetTrackDownloadingProcess()),
    setDownloadBasketMeta: (downloadBasketMeta) =>
      dispatch(setDownloadBasketMeta(downloadBasketMeta)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(withStyles(styles)(DownloadBasketFormPage)));
