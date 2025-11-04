import React, { useEffect, useState } from "react";
import "./EditProjectInfoModal.css";
import { useDispatch } from "react-redux";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import TextAreaWrapper from "../../../branding/componentWrapper/TextAreaWrapper";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import AsyncService from "../../../networking/services/AsyncService";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import { useNavigate } from "react-router-dom";

const validationSchema = (meta, projectId) => {
  return Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Project name is required")
      .test(
        "unique-name", // Unique test name
        "Project name already exists", // Error message
        function (value) {
          // Custom validation logic
          return !meta.some((project) => {
            console.log("project", project);
            if (projectId === project?.id) {
              return false;
            }
            return project?.name?.toLowerCase() === value?.toLowerCase();
          });
        }
      ),
  });
};

const EditProjectInfoModal = ({
  editProjectInfo,
  onClose = () => {},
  getNewProjects,
  cameFromProjectID,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validateForProjectName, setValidateForProjectName] = useState([]);

  // console.log("validateForProjectName", validateForProjectName);
  useEffect(() => {
    if (!editProjectInfo?.isOpen) return;
    AsyncService?.loadData("project/getAllProjetNames")
      .then((response) => {
        setValidateForProjectName(response.data);
      })
      .catch((err) => console.log(err));
  }, [editProjectInfo?.isOpen]);

  const updateProjectName = (values, setSubmitting) => {
    setSubmitting(true);
    console.log("editProjectInfo?.projectID", editProjectInfo?.projectID);
    const data = {
      id: editProjectInfo?.projectID,
      name: values?.name,
      description: values?.description || null,
      status: values?.status,
      audioType: [],
    };

    AsyncService.postData("/project/addProject", data)
      .then((response) => {
        console.log("response", response);
        dispatch(showSuccess("Project updated sucessfully!"));
        if (cameFromProjectID) {
          // navigate("/projects/")
        }
        getNewProjects(values?.status);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        dispatch(showError(error));
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <ModalWrapper
      isOpen={editProjectInfo?.isOpen}
      onClose={onClose}
      title="Edit Information"
    >
      <Formik
        initialValues={{
          name: editProjectInfo?.name || "",
          description: editProjectInfo?.description || "",
          status: editProjectInfo?.status || "",
        }}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            updateProjectName(values, setSubmitting);
          }, 500);
        }}
        validationSchema={() =>
          validationSchema(validateForProjectName, editProjectInfo?.projectID)
        }
      >
        {(props) => {
          const {
            values,
            dirty,
            isValid,
            isSubmitting,
            errors,
            touched,
            handleSubmit,
          } = props;
          return (
            <form onSubmit={handleSubmit} className="edit_wrapper">
              <div>
                <SonicInputLabel htmlFor="report_description">
                  Project Name *
                </SonicInputLabel>
                <Field
                  //  label="Project Name *"
                  id="projectSettings_projectName"
                  placeholder="Enter your project name"
                  name="name"
                  autoFocus
                  type="text"
                  component={InputWrapper}
                  value={values.name}
                />
                {errors.name && touched.name && (
                  <p className="error">{errors.name}</p>
                )}
              </div>
              <div>
                <SonicInputLabel htmlFor="report_description">
                  Description
                </SonicInputLabel>
                <Field
                  // label="Description"
                  id="projectSettings_Description"
                  name="description"
                  type="text"
                  rows="5"
                  placeholder="Describe your project..."
                  component={TextAreaWrapper}
                  value={values.description}
                />
                {errors.description && touched.description && (
                  <p className="error">{errors.description}</p>
                )}
              </div>
              <div className="edit_project_btn_container">
                <ButtonWrapper variant="outlined" onClick={onClose}>
                  Cancel
                </ButtonWrapper>

                <ButtonWrapper
                  variant="filled"
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  Save Changes
                </ButtonWrapper>
              </div>
            </form>
          );
        }}
      </Formik>
    </ModalWrapper>
  );
};

export default EditProjectInfoModal;
