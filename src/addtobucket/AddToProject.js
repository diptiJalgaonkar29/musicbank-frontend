import ModalWrapper from "../branding/componentWrapper/ModalWrapper";
import AsyncService from "../networking/services/AsyncService";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";
import "./addtoproject.css";
import { ReactComponent as AddIcon } from "../static/add_border.svg";
import { ReactComponent as FileIcon } from "../projectcommon/file.svg";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../branding/componentWrapper/InputWrapper";
import TextAreaWrapper from "../branding/componentWrapper/TextAreaWrapper";
import { resetDownloadBasketMeta } from "../redux/actions/trackDownloads/tracksDownload";
import DatePickerField from "../common/components/CustomDatePicker/CustomDatePicker";
import { formatRegionCountryOptions } from "../common/utils/countryFormatter";
import ReactSelectWapper from "../branding/componentWrapper/reactSelectWapper";
import SonicInputLabel from "../branding/sonicspace/components/InputLabel/SonicInputLabel";
import CheckboxWrapper from "../branding/componentWrapper/CheckboxWrapper";
import countryData from "./countryRegionData.json";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showError, showSuccess } from "../redux/actions/notificationActions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { components } from "react-select";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import { format } from "date-fns";
import { clearPredict } from "../redux/actions/PredictAction/predictAction";

const projectTypes = {
  "Active Projects": "active",
  "Closed Projects": "downloaded",
  Bin: "deleted",
};

// const url = window.location.hash;
// const match = url.match(/token=([^&]+)/);
// const token = match ? match[1] : null;

const today = new Date();

const validationSchema = (meta) => {
  return Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Name is required")
      .test(
        "unique-name", // Unique test name
        "Project name already exists", // Error message
        function (value) {
          // Custom validation logic
          return !meta.some(
            (project) => project?.name?.toLowerCase() === value?.toLowerCase()
          );
        }
      ),
    createdDate: Yup.string().required("Created date is required"),
    country: Yup.string().required("Country is required"),
  });
};

const CustomOption = (props) => {
  const { data, isSelected } = props;

  return (
    <components.Option {...props}>
      <div
        style={{
          paddingLeft: data.isRegion ? 0 : 16,
          display: "flex",
          alignItems: "center",
          gap: "15px",
          fontSize: "14px",
          color: "var(--color-var(--color-white))",
        }}
      >
        <CheckboxWrapper
          type="checkbox"
          checked={isSelected}
          readOnly
          style={{ marginRight: 8 }}
        />
        {data.label}
      </div>
    </components.Option>
  );
};

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--color-bg)",
    borderColor: "var(--color-white)",
    borderRadius: "8px",
    padding: "6px",
    minHeight: "44px",
    color: "var(--color-white)",
    marginTop: "15px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-bg)",
    border: "1px solid var(--color-white)",
    borderRadius: "10px",
    marginTop: "4px",
    zIndex: 100,
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "150px",
    padding: "0",
    overflowY: "auto",
    color: "#C4C4C4",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#1e1e1e"
      : state.isFocused
      ? "#333"
      : "var(--color-bg)",
    color: "var(--color-white)",
    padding: "10px 12px",
    cursor: "pointer",
    // borderRadius: '0px 0px 0px 10px'
    transition: "background-color 0.2s ease",
    "&:hover": {
      color: "var(--wpp-grey-color-100)",
    },
  }),
  input: (base) => ({
    ...base,
    color: "var(--color-white)",
    fontSize: "18px",
    padding: "0 12px",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px",
    color: "var(--color-white)",
  }),
  groupHeading: (base) => ({
    ...base,
    color: "var(--color-white)",
    fontWeight: "bold",
    padding: "8px 12px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--color-white)",
    opacity: 0.7,
    fontSize: "14px",
  }),
};

const ProjectForm = ({
  initialValues,
  handleCancelForProject,
  handleSubmitNewBucketList,
  state,
  type,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validateOnMount
      validationSchema={() => validationSchema(state)}
    >
      {({ isSubmitting, values, isValid, handleSubmit, dirty, errors }) => (
        <Form
          className="ProjectPage__content"
          onSubmit={handleSubmit}
          style={{
            position: "relative",
          }}
        >
          <div className="form-group">
            <label className="label" htmlFor="subject">
              Project Name*
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              placeholder="Give a name to your project"
              component={InputWrapper}
            />
            {errors?.name === "Project name already exists" ? (
              <p className="report_form_error">{errors?.name}</p>
            ) : (
              <ErrorMessage
                name="name"
                component="div"
                className="report_form_error"
              />
            )}
          </div>
          <div className="form-group">
            <div
              className={`date-picker-wrapper ${
                type === "Download" ? "active" : "inactive"
              }`}
            >
              <div className="groupDate">
                <SonicInputLabel htmlFor="created Date">
                  Airing Date *
                </SonicInputLabel>
                <DatePickerField
                  id="createdDate"
                  name="createdDate"
                  placeholderText="Select a date"
                  showYearDropdown
                  minDate={today}
                  properClassName="datepicker-groupDate"
                />
              </div>
              <div className="groupDate">
                <SonicInputLabel htmlFor="country">Country *</SonicInputLabel>
                <ReactSelectWapper
                  name="country"
                  options={formatRegionCountryOptions(countryData)}
                  components={{
                    Option: CustomOption,
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  placeholder="Select country or region"
                  styles={customStyles}
                  isSearchable
                  isClearable
                />
              </div>
            </div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <Field
              as="textarea"
              name="description"
              id="description"
              rows="4"
              cols="30"
              placeholder="Describe your project..."
              component={TextAreaWrapper}
            />
          </div>
          <div className="form-group groupButton">
            <div className="buttons">
              <ButtonWrapper
                type="submit"
                onClick={handleCancelForProject}
                variant="outlined"
              >
                Cancel
              </ButtonWrapper>
              <ButtonWrapper
                type="submit"
                disabled={isSubmitting || !isValid}
                onClick={() => {
                  handleSubmitNewBucketList(values);
                }}
              >
                <FormattedMessage id="project.createProject" />
              </ButtonWrapper>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const AddToBucket = ({
  open,
  setOpen,
  trackID,
  type,
  getNewProjects,
  selectedProjectType,
  playList,
  trackIds = [],
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  let { tracksInDownloadBasket } = useSelector((state) => state.downloadBasket);
  const predictData = useSelector((state) => state.predict.data);

  const [bucketList, setBucketList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectID, setProjectID] = useState(null);
  const [newProject, setNewProject] = useState(playList ? true : false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [validateForProjectName, setValidateForProjectName] = useState([]);
  const [retriveDataFromTokenByAPi, setRetriveDataFromTokenApi] = useState([]);

  const handleSubmitNewBucketList = (values) => {
    const data = {
      name: values?.name,
      status: "active",
      airingDate: format(values?.createdDate, "dd/MM/yyyy"),
      airingCountry: values?.country,
      description: values?.description || null,
      audioType: tracksInDownloadBasket || trackIds?.audio_type,
    };

    AsyncService.postData("/project/addProject", data)
      .then((response) => {
        const projectId = response?.data?.projectId || 0;
        if (predictData?.length > 0) {
          const updatedPredictData = predictData.map((item) => ({
            ...item,
            projectId,
          }));
          console.log("updatedPredictData", updatedPredictData);
          console.log("token", token);
          sendDataToPrdeict(updatedPredictData);
        } else {
          dispatch(showSuccess("Project created sucessfully!"));
          setNewProject(false);
          setOpen(false);
          setProjectID(null);
          type !== "Project"
            ? navigate(`/track-download/${response?.data?.projectId}`)
            : getNewProjects(projectTypes[selectedProjectType]);
          dispatch(resetDownloadBasketMeta());
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(showError(error));
      });
  };

  const fetchProjectList = () => {
    AsyncService?.loadData("/project/getProjectsUsers")
      .then((res) => {
        setBucketList(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleClickSubmitProject = (id) => {
    let getInfo = bucketList?.find((item) => item?.projectId === projectID);
    console.log(getInfo);
    if (getInfo) {
      const data = {
        id: getInfo?.projectId || null,
        name: getInfo?.name || "",
        status: getInfo?.status || "active",
        audioType: tracksInDownloadBasket,
        description: getInfo?.description || null,
        airingDate: getInfo?.airingDate,
        airingCountry: getInfo?.airingCountry || "",
      };
      let projectId = getInfo?.projectId || null;
      AsyncService.postData("/project/addProject", data)
        .then((seletBrandResponse) => {
          if (predictData?.length > 0) {
            const updatedPredictData = predictData.map((item) => ({
              ...item,
              projectId,
            }));
            console.log("updatedPredictData", updatedPredictData);
            console.log("token", token);
            sendDataToPrdeict(updatedPredictData);
          } else {
            if (!playList && predictData?.length < 0) {
              dispatch(showSuccess("Tracks added to project succsesfully!"));
            } else {
              dispatch(showSuccess("Playlist added to project."));
            }
            setNewProject(false);
            setOpen(false);
            setProjectID(null);
            navigate(`/track-download/${projectID}`);
            dispatch(resetDownloadBasketMeta());
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(showError(error));
        });
    }
  };

  const getDetailsFromPredictToken = () => {
    AsyncService.loadData(`predict/getCountOfTransactions?token=${token}`)
      .then((predictData) => {
        console.log("predictData.data", predictData.data);
        setRetriveDataFromTokenApi(
          predictData?.data[0]?.txn_token === "Token_not_valid"
            ? []
            : predictData?.data
        );
      })
      .catch((err) => {
        console.log("err", err);
        setRetriveDataFromTokenApi([]);
      });
  };

  const sendDataToPrdeict = (dataForPredict) => {
    AsyncService.postData("predict/addTransaction", dataForPredict)
      .then((response) => {
        redirectToExternal(response?.data); // use the token you got
        dispatch(clearPredict());
        setNewProject(false);
        setOpen(false);
      })
      .catch((err) => {
        console.log("error", err);
        showError("Something went wrong.");
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

  const handleCancelForProject = () => {
    if (!playList) {
      setNewProject(false);
      setOpen(false);
      setProjectID(null);
      setVisibleCount(4);
      dispatch(resetDownloadBasketMeta());
    }
    setOpen(false);
    setProjectID(null);
    setVisibleCount(4);
    dispatch(resetDownloadBasketMeta());
  };

  const handleSelectProject = (evt) => {
    setProjectID(evt);
    setNewProject(false);
  };

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 4); // Increase visible count by 4
  };

  useEffect(() => {
    if (open) {
      fetchProjectList();
      listOfAllTheProjectsPresent();
      if (!!token) {
        getDetailsFromPredictToken();
      }
    }
  }, [open]);

  const listOfAllTheProjectsPresent = useCallback(() => {
    AsyncService?.loadData("project/getAllProjetNames")
      .then((response) => {
        setValidateForProjectName(response.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [validateForProjectName]);

  const flowFromProjectList = () => {
    if (isLoading) {
      return (
        <div className="project_loader">
          <SpinnerDefault />
        </div>
      );
    }

    return (
      <ProjectForm
        initialValues={{
          name: "",
          description: null,
          country: "",
          createdDate: null,
        }}
        handleCancelForProject={handleCancelForProject}
        handleSubmitNewBucketList={handleSubmitNewBucketList}
        state={validateForProjectName}
        type={type}
      />
    );
  };

  const flowFromBrowseTrack = () => {
    if (isLoading) {
      return (
        <div className="project_loader">
          <SpinnerDefault />
        </div>
      );
    }

    return (
      <>
        <div className="grid">
          {bucketList?.slice(0, visibleCount)?.map((track, id) => (
            <div
              key={track?.projectId}
              onClick={() => handleSelectProject(track?.projectId)}
              className={`card ${
                projectID === track?.projectId ? "new-project-active" : ""
              }`}
            >
              <div className="card-icon">
                <FileIcon />
              </div>
              <h2 className="card-title">{track?.name}</h2>
              <div className="card-assets">
                {track?.trackInfo?.length || 0} Assets
              </div>
              <div className="card-updated">
                Updated{" "}
                {moment
                  .utc(track?.changeTimestamp || track?.newTimestamp)
                  .local()
                  .fromNow()}
              </div>
            </div>
          ))}
          {visibleCount < bucketList.length && (
            <div className="card" onClick={handleSeeMore}>
              <h2 className="card-title">
                <FormattedMessage id="project.seeMore" />
              </h2>
            </div>
          )}
          <div
            className={`card new-project ${
              newProject ? "new-project-active" : ""
            }`}
            onClick={() => {
              setProjectID(null);
              setNewProject(!newProject);
            }}
          >
            <AddIcon />
          </div>
        </div>
        {newProject && (
          <ProjectForm
            initialValues={{
              // name: getUpdatedPlayListName(playList, validateForProjectName),
              name: playList ? decodeURIComponent(playList) : "",
              description: null,
              createdDate: null,
              country: "",
            }}
            handleCancelForProject={handleCancelForProject}
            handleSubmitNewBucketList={handleSubmitNewBucketList}
            state={validateForProjectName}
            type={type}
          />
        )}
        {!newProject && (
          <div className="buttons">
            <ButtonWrapper onClick={handleCancelForProject} variant="outlined">
              Cancel
            </ButtonWrapper>
            <ButtonWrapper
              onClick={handleClickSubmitProject}
              disabled={projectID ? false : true}
            >
              <FormattedMessage id="project.selectProject" />
            </ButtonWrapper>
          </div>
        )}
      </>
    );
  };

  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={setOpen}
      onClose={() => {
        dispatch(resetDownloadBasketMeta());
        setOpen(false);
      }}
      className="select-project-dialog"
      title=""
    >
      <div className="Project_container_card">
        <h1 className="project_header">
          {type !== "Project" &&
            "Select an Active Project or Create a New Project"}
        </h1>
        {type !== "Project" ? flowFromBrowseTrack() : flowFromProjectList()}
      </div>
    </ModalWrapper>
  );
};

export default AddToBucket;
