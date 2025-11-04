import React, { useState, useEffect, useMemo, useContext } from "react";
import MainLayout from "../../../common/components/MainLayout/MainLayout";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import "./ProfileForm.css";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import AsyncService from "../../../networking/services/AsyncService";
import { FormattedMessage } from "react-intl";
import MFAConfigModal from "../MFAConfigModal/MFAConfigModal";
import getConfigJson from "../../utils/getConfigJson";
import BackButton from "../backButton/BackButton";
import { BrandingContext } from "../../../branding/provider/BrandingContext";

const RegExForOneUppercaseOneSpecialOneNumbericAndEightCharacters =
  /^(?=.*?[0-9])(?=.*[A-Z])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).*$/; //  one Number, one Uppercars, one special Character

const validationSchema = Yup.object().shape({
  fullname: Yup.string().trim().required("Required"),
  email: Yup.string().trim().email("Invalid email").required("Required"),
  currentPassword: Yup.string().trim().required("Required").nullable(),
  newPassword: Yup.string()
    .matches(
      RegExForOneUppercaseOneSpecialOneNumbericAndEightCharacters,
      "Password needs to have at least one uppercase character, one number, and one special character ($&+,:;=?@#|'<>.^*()%!-)"
    )
    .min(8, "Minimum 8 characters")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "New password cannot be same as current password"
    )
    .trim()
    .required("Required")
    .nullable(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Required")
    .trim()
    .nullable(),
});

const ProfileForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isToggleIcon, setIsIconToggle] = useState({
    isCurrentPasswordToggle: false,
    isNewPasswordToggle: false,
    isConfirmPasswordToggle: false,
  });
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
  });
  const [isMFAConfigureModalOpen, setisMFAConfigureModalOpen] = useState(false);
  const isSSOLogin = localStorage.getItem("isSSOLogin") === "true";
  const { ssAccess } = useSelector((state) => state?.userMeta);

  const handleEdit = (fieldName) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const { jsonConfig: CONFIG } = useContext(BrandingContext);

  const handleToggleButton = (fieldName) => {
    setIsIconToggle((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };
  const fechFormData = async () => {
    try {
      const dataArr = await AsyncService.loadData("/users/currentUserData");
      const response = dataArr?.data;
      setFormData(response);
    } catch (error) {
      console.log(error, "error getting when form data fetch");
    }
  };

  useEffect(() => {
    fechFormData();
  }, []);

  const resetData = () => {
    setIsEditing({
      name: false,
      email: false,
    });
    setIsIconToggle({
      isCurrentPasswordToggle: false,
      isNewPasswordToggle: false,
      isConfirmPasswordToggle: false,
    });
  };

  const postProfileData = async (fieldValue) => {
    try {
      let profileResponse = await AsyncService.patchData(
        `/users/userUpdateAndPasswordSet`,
        fieldValue
      );
      setFormData((prev) => ({ ...prev, ...fieldValue }));
      let statusRes = profileResponse?.data?.status;
      if (statusRes === "Current password does not match") {
        dispatch(showError(statusRes));
        return;
      } else {
        dispatch(showSuccess(statusRes));
        resetData();
      }
      if (!!fieldValue?.password) {
        navigate("/logout");
      }
    } catch (error) {
      console.log("Getting error when update data", error);
      dispatch(showError(error));
      resetData();
    }
  };

  const IndividualSave = (fieldName, values) => {
    postProfileData({
      [fieldName]: values?.fullname,
    });
  };

  const handleSubmit = (values) => {
    postProfileData({
      password: values?.currentPassword,
      new_password: values?.newPassword,
    });
  };

  const initialValues = {
    fullname: formData?.fullname || "",
    email: formData?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  return (
    <MainLayout isUnregistered={!ssAccess}>
      <div className="profile_menu_main_container">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { dirty, values, errors, touched, handleSubmit } = props;

            const isFullNameDirty = values.fullname !== formData.fullname;

            return (
              <form onSubmit={handleSubmit}>
                <p className="profile_form_heading boldFamily">
                  {!ssAccess && <BackButton />}
                  <FormattedMessage id="profile.page.profilePageTitle" />
                </p>
                <SonicInputLabel
                  htmlFor="profile_form_name"
                  className="sub_heading_text"
                >
                  <FormattedMessage id="profile.page.nameLabel" />
                </SonicInputLabel>
                <div className="profile_form_input_container">
                  <Field
                    name="fullname"
                    disabled={!isEditing.name}
                    component={InputWrapper}
                    className="profile_form_input-fields"
                    autoFocus
                  />
                  <div className="profile_form_action_button_container">
                    {!isEditing.name ? (
                      <ButtonWrapper
                        className="profile_form_action_button"
                        onClick={() => handleEdit("name")}
                        size="s"
                      >
                        Edit
                      </ButtonWrapper>
                    ) : (
                      <ButtonWrapper
                        disabled={!isFullNameDirty || !values?.fullname}
                        className={`profile_form_action_button`}
                        size="s"
                        onClick={() => {
                          IndividualSave("fullname", values);
                        }}
                      >
                        Save
                      </ButtonWrapper>
                    )}
                  </div>
                </div>
                {errors.fullname && touched.fullname && (
                  <p className="profile_form_error">{errors.fullname}</p>
                )}
                <SonicInputLabel
                  htmlFor="profile_form_email"
                  className="sub_heading_text"
                >
                  <FormattedMessage id="profile.page.emailLabel" />
                </SonicInputLabel>
                <div style={{ position: "relative" }}>
                  <Field
                    name="email"
                    disabled
                    className="profile_form_input-fields"
                    component={InputWrapper}
                    autoFocus
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="profile_form_error">{errors.email}</p>
                )}
                {!isSSOLogin && (
                  <>
                    <SonicInputLabel
                      htmlFor="profile_form_changepass"
                      className="sub_heading_text"
                    >
                      <FormattedMessage id="profile.page.changePasswordTitle" />
                    </SonicInputLabel>
                    <SonicInputLabel
                      htmlFor="profile_form_changepass"
                      className="set_password_text"
                    >
                      <FormattedMessage id="profile.page.currentPasswordLabel" />
                    </SonicInputLabel>
                    <div className="profile_password_input">
                      <Field
                        name="currentPassword"
                        type={
                          isToggleIcon.isCurrentPasswordToggle
                            ? "text"
                            : "password"
                        }
                        className="confirm_password_input"
                        component={InputWrapper}
                      />

                      <div
                        className="eye_icon"
                        onClick={() => {
                          handleToggleButton("isCurrentPasswordToggle");
                        }}
                      >
                        {isToggleIcon.isCurrentPasswordToggle ? (
                          <FaEyeSlash fontSize={20} color="#757575" />
                        ) : (
                          <FaEye fontSize={20} color="#757575" />
                        )}
                      </div>
                    </div>
                    {errors.currentPassword && touched.currentPassword && (
                      <p className="profile_form_error">
                        {errors.currentPassword}
                      </p>
                    )}
                    <div className="set_new_password_group">
                      <div>
                        <SonicInputLabel
                          htmlFor="profile_form_changepass"
                          className="set_password_text"
                        >
                          <FormattedMessage id="profile.page.newPasswordLabel" />
                        </SonicInputLabel>
                        <div className="profile_password_input">
                          <Field
                            name="newPassword"
                            type={
                              isToggleIcon.isNewPasswordToggle
                                ? "text"
                                : "password"
                            }
                            className="set_new_password_field"
                            component={InputWrapper}
                          />
                          <div
                            className="eye_icon_new_password"
                            onClick={() => {
                              handleToggleButton("isNewPasswordToggle");
                            }}
                          >
                            {isToggleIcon.isNewPasswordToggle ? (
                              <FaEyeSlash fontSize={20} color="#757575" />
                            ) : (
                              <FaEye fontSize={20} color="#757575" />
                            )}
                          </div>
                        </div>
                        {errors.newPassword && touched.newPassword && (
                          <p className="profile_form_error">
                            {errors.newPassword}
                          </p>
                        )}
                      </div>
                      <div>
                        <SonicInputLabel
                          htmlFor="profile_form_changepass"
                          className="set_password_text"
                        >
                          <FormattedMessage id="profile.page.confirmPasswordLabel" />
                        </SonicInputLabel>
                        <div className="profile_password_input">
                          <Field
                            name="confirmPassword"
                            type={
                              isToggleIcon.isConfirmPasswordToggle
                                ? "text"
                                : "password"
                            }
                            className="set_new_password_field"
                            component={InputWrapper}
                          />

                          <div
                            className="eye_icon_new_password"
                            onClick={() => {
                              handleToggleButton("isConfirmPasswordToggle");
                            }}
                          >
                            {isToggleIcon.isConfirmPasswordToggle ? (
                              <FaEyeSlash fontSize={20} color="#757575" />
                            ) : (
                              <FaEye fontSize={20} color="#757575" />
                            )}
                          </div>
                        </div>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <p className="profile_form_error">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="groupButton">
                      <div className="report_form_btn_container">
                        <ButtonWrapper
                          type="submit"
                          className="profile_form_submit_button"
                          disabled={
                            !dirty ||
                            !!errors.confirmPassword ||
                            !!errors.currentPassword ||
                            !!errors.newPassword
                          }
                        >
                          Save
                        </ButtonWrapper>
                      </div>
                    </div>
                  </>
                )}
              </form>
            );
          }}
        </Formik>
        {CONFIG?.LOGIN_TYPE?.includes("MFA") && !isSSOLogin && (
          <div>
            <div className="MFA_setup_container profile_form_input_container">
              <div className="MFA_setup_left_container">
                <SonicInputLabel
                  htmlFor="profile_form_email"
                  className="sub_heading_text"
                >
                  <FormattedMessage id="profile.page.MFAConfigureTitle" />
                </SonicInputLabel>
                <p className="MFA_setup_note">
                  <FormattedMessage id="profile.page.MFAConfigureDesc" />
                </p>
              </div>
              <div className="MFA_setup_right_container">
                <ButtonWrapper
                  className="profile_form_action_button"
                  onClick={() => setisMFAConfigureModalOpen(true)}
                  size="s"
                >
                  Configure
                </ButtonWrapper>
              </div>
              <MFAConfigModal
                isMFAConfigureModalOpen={isMFAConfigureModalOpen}
                setisMFAConfigureModalOpen={setisMFAConfigureModalOpen}
                email={formData?.email}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfileForm;
