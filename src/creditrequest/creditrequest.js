import React, { useCallback, useEffect, useState } from "react";
import "./creditrequest.css";
import { ErrorMessage, Field, Formik } from "formik";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import TextAreaWrapper from "../branding/componentWrapper/TextAreaWrapper";
import InputWrapper from "../branding/componentWrapper/InputWrapper";
import * as Yup from "yup";
import NavBar from "../common/components/Navbar/NavBar";
import AsyncService from "../networking/services/AsyncService";
import { useNavigate } from "react-router-dom";
import SelectWrapper from "../branding/componentWrapper/SelectWrapper";

import { showError, showSuccess } from "../redux/actions/notificationActions";
import { useDispatch } from "react-redux";
import MainLayout from "../common/components/MainLayout/MainLayout";
import { SpinnerDefault } from "../common/components/Spinner/Spinner";

export default function CreditRequest() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [creditRequest, setCreditRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [internalUserList, setInternalUserList] = useState([]);
  const [brandType, setBrandType] = useState(null);

  // const handleSubmit = useCallback((details, inbultProps) => {
  //   const data = {
  //     creditRequested: details?.credits || null,
  //     creditRequestedProject: details?.project || null,
  //     description: details?.description || null,
  //     requestingUser: details?.requestor?.value || null,
  //   };

  //   AsyncService.postData("/creditRequest/sendRequestForCredit", data)
  //     .then((response) => {
  //       inbultProps?.resetForm();
  //       dispatch(showSuccess("Request sent successfully!"));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       dispatch(showError("Something went wrong!"));
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  const validationSchema = Yup.object().shape({
    // requestor: Yup.object()?.when([], {
    //   is: () => brandType !== 1,
    //   then: () => Yup.object().required("Requestor is required"),
    //   otherwise: () => Yup.object().notRequired(),
    // }),
    credits: Yup.number()
      .min(0, "Tokens must be at least 0")
      .required("Token is required"),
    // project: Yup.string().trim().required("Project is required"),
  });

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [history]);

  const getCreditInfoByCompanyOrBrand = useCallback(() => {
    let userId = Number(localStorage?.getItem("brandId"));

    if (!userId) return;
    AsyncService.loadData("users/getUserInternalOrExternalUser")
      .then((response) => {
        setBrandType(response?.data?.companyType);
        // 1 = "internal" & 2 = "external"
        AsyncService?.loadData(
          `credit/getCreditOfBrand?${
            response?.data?.companyType === 1 ? "brandId" : "companyId"
          }=${response?.data?.companyType === 1 ? userId : response?.data?.id}`
        )
          .then((creditResponse) => {
            setCreditRequest(creditResponse?.data?.creditremaining);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [creditRequest, brandType]);

  const getUserCurrentInternalUser = useCallback(() => {
    AsyncService.loadData(`creditRequest/getListOfBrandUsers`)
      .then((response) => {
        let options = response?.data?.map((e, i) => ({
          label: e,
          value: e,
        }));
        setInternalUserList(options);
      })
      .catch((err) => {
        console.log(err);
        setInternalUserList([]);
        dispatch(showError("Something went wrong!"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [internalUserList]);

  useEffect(() => {
    getUserCurrentInternalUser();
    getCreditInfoByCompanyOrBrand();
  }, []);


  const handleSubmit = useCallback((details, inbultProps) => {
    const data = {
      creditRequest: details?.credits || null,
      creditRequestedProject: details?.project || null,
      description: details?.description || null,
      requestingUser: details?.requestor?.value || null,
    };

    console.log(data,'data');
    

    AsyncService.postData("/credit/userCreditRequest", data)
      .then((response) => {
        console.log(response,'response');
        
        inbultProps?.resetForm();
        dispatch(showSuccess("Request sent successfully!"));
      })
      .catch((error) => {
        console.log(error);
        dispatch(showError("Something went wrong!"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  return (
    <MainLayout>
      {loading ? (
        <div class="loader-container">
          <SpinnerDefault />
        </div>
      ) : (
        <div className="credit-request">
          <div className="credit-request-container">
            <div className="credits-header">
              <h1>
                Brand Tokens:{" "}
                <span className="credits-value">{creditRequest || 0}</span>
              </h1>
            </div>
            <p className="subtitle">Fill the form to request more tokens</p>
            <Formik
              initialValues={{
                requestor: null,
                credits: "",
                project: "",
                description: "",
              }}
              onSubmit={(values, props) => handleSubmit(values, props)}
              validationSchema={validationSchema}
            >
              {(props) => {
                const {values, dirty, isValid, handleSubmit, isSubmitting } = props;
                  const requestedCredits = Number(values.credits || 0);
                return (
                  <form onSubmit={handleSubmit}>
                    {/* {brandType !== 1 && (
                      <div className="form-group">
                        <label>Credit Requestor:</label>
                        <Field
                          id="requestor"
                          name="requestor"
                          placeholder="Entity that provides the tokens"
                          as="select"
                          component={SelectWrapper}
                          options={internalUserList}
                        />
                        <ErrorMessage
                          name="requestor"
                          component="div"
                          className="credit-request-error"
                        />
                      </div>
                    )} */}
                    <div className="form-group">
                      <label>Tokens to request:</label>
                      <Field
                        type="number"
                        id="credits"
                        name="credits"
                        min={1}
                        placeholder="Number of tokens"
                        component={InputWrapper}
                      />
                      <ErrorMessage
                        name="credits"
                        component="div"
                        className="credit-request-error"
                      />
                    </div>

                    <div className="form-group">
                      <label>Project:</label>
                      <Field
                        type="text"
                        id="project"
                        name="project"
                        placeholder="Unique name for your project"
                        component={InputWrapper}
                      />
                      <ErrorMessage
                        name="project"
                        component="div"
                        className="credit-request-error"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description (Optional):</label>
                      <Field
                        id="description"
                        name="description"
                        placeholder="Description here"
                        component={TextAreaWrapper}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="credit-request-error"
                      />
                    </div>

                    <div className="button-group">
                      <ButtonWrapper
                        type="button"
                        variant="outlined"
                        onClick={handleGoBack}
                      >
                        Cancel
                      </ButtonWrapper>
                      <ButtonWrapper
                        type="submit"
                        disabled={
                        isSubmitting || 
                        !isValid || 
                        !dirty || 
                        requestedCredits > creditRequest
                      }
                      >
                        {loading ? "Submitting" : "Request Tokens"}
                      </ButtonWrapper>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
