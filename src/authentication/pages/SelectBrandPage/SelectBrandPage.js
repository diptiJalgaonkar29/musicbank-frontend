import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncService from "../../../networking/services/AsyncService";
import V3AuthLayout from "../../components/Layout/V3AuthLayout";
import ButtonWrapper from "../../../branding/componentWrapper/ButtonWrapper";
import { SpinnerDefault } from "../../../common/components/Spinner/Spinner";
import _ from "lodash";
import { isAuthenticated } from "../../../common/utils/getUserAuthMeta";
import ModalWrapper from "../../../branding/componentWrapper/ModalWrapper";
import "./SelectBrandPage.css";
import AxiosInstance from "../../../networking/services/AxiosInstance";
import { useDispatch, useSelector } from "react-redux";
import {
  showError,
  showSuccess,
} from "../../../redux/actions/notificationActions";
import { setUserMeta } from "../../../redux/actions/userActions/userActions";
import { BrandingContext } from "../../../branding/provider/BrandingContext";
import { resetDownloadBasketMeta } from "../../../redux/actions/trackDownloads/tracksDownload";
import { resetAllTrackFilters } from "../../../redux/actions/trackFilterActions/trackFilterActions";
import BrandButton from "../BrandButton/BrandButton";
import SonicInputLabel from "../../../branding/sonicspace/components/InputLabel/SonicInputLabel";
import { Field, Form, Formik } from "formik";
import InputWrapper from "../../../branding/componentWrapper/InputWrapper";
import DatePickerField from "../../../common/components/CustomDatePicker/CustomDatePicker";
import CheckboxWrapper from "../../../branding/componentWrapper/CheckboxWrapper";
import TextAreaWrapper from "../../../branding/componentWrapper/TextAreaWrapper";
import * as Yup from "yup";
import { format } from "date-fns";
import { FormattedMessage } from "react-intl";
import getSuperBrandName from "../../../common/utils/getSuperBrandName";
import { brandConstants } from "../../../common/utils/brandConstants";
// import { formatRegionCountryOptions } from "../../../common/utils/countryFormatter";
import ReactSelectWapper from "../../../branding/componentWrapper/reactSelectWapper";
import countryData from "../../../../src/addtobucket/countryRegionData.json";
import { components } from "react-select";
import { useFormikContext } from "formik";

function RequestAccessModal({
  open,
  setOpen,
  selectedBrandData,
  setSelectedBrandData,
  getUsersBrands,
  managers,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
      borderRadius: "23px",
      padding: "6px",
      minHeight: "50px",
      color: "var(--color-white)",
      width: "100%",
      // marginTop: "15px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--color-bg)",
      border: "1px solid var(--color-white)",
      borderRadius: "10px",
      // marginTop: "4px",
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

  const handleSubmit = (values) => {
    setLoading(true);
    const payload = {
      // airingCountry: values.country?.value,
      managerId: values.manager?.value,
    };
    console.log(payload, "payload");

    // return;
    AxiosInstance.post(
      `users/addNewBrandRequest/${selectedBrandData?.brandId}`,
      payload
    )
      .then((res) => {
        // console.log(res);
        dispatch(
          showSuccess(
            `Your request send to the admin this ${selectedBrandData.brandName} brand`
          )
        );
        setLoading(false);
        getUsersBrands();
        setOpen(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log("error ", e);
      });
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedBrandData([]);
  };

  const managerList = [
    { label: "John Doe", value: "john" },
    { label: "Priya Singh", value: "priya" },
    { label: "Amit Shah", value: "amit" },
  ];

  return (
    <ModalWrapper
      isOpen={open}
      setIsOpen={setOpen}
      onClose={closeModal}
      className="download-confirmation-dialog"
    >
      <Formik
        initialValues={{
          manager: null,
        }}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <Form onSubmit={(values) => handleSubmit(values)}>
            <div style={{ color: "var(--color-white)" }}>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "22px",
                  fontWeight: 400,
                }}
              >
                <FormattedMessage id="selectBrand.requestBrand" />
              </p>

              <div
                className="form-group"
                style={{
                  // display: "flex",
                  justifyContent: "around",
                  gap: "10px",
                }}
              >
                {/* COUNTRY DROPDOWN */}
                {/* <div className="groupDate" style={{ width: "100%" }}>
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
                    value={values.country}
                    onChange={(selected) => setFieldValue("country", selected ?? null)}
                  />
                </div> */}

                {/* MANAGER DROPDOWN */}
                <div className="groupDate" style={{ width: "100%" }}>
                  <SonicInputLabel htmlFor="manager">Manager</SonicInputLabel>

                    <ReactSelectWapper
                      name="manager"
                      options={(managers ?? [] )?.map((m) => ({
                        value: m.id,
                        label: m.email,
                      }))}
                      components={{
                        Option: CustomOption,
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      placeholder="Select Manager"
                      styles={customStyles}
                      isSearchable
                      isClearable
                      onChange={(selected) => setFieldValue("manager", selected ?? null)}
                      value={values.manager}
                    />
                  </div>


              </div>

              <div className="SelectCompany_btnContainer">
                <ButtonWrapper onClick={closeModal} variant="outlined">
                  Cancel
                </ButtonWrapper>

                <ButtonWrapper type="submit">
                  {loading ? "Loading..." : "Send Request"}
                </ButtonWrapper>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
}

export default function SelectBrandPage() {
  //useReloadOnce();
  console.log("SelectBrandPage::Called");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [branding, setBranding] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedBrandData, setSelectedBrandData] = useState([]);
  const [managers, setManagers] = useState();
  const { updateBrandThemeConfig } = useContext(BrandingContext);
  const { brandName: prevBrandName } = useSelector((state) => state.userMeta);
  const superBrandName = getSuperBrandName();
  const addBrandNameClassToBodyElement = (brandName) => {
    try {
      console.log("addBrandNameClassToBodyElement brandName : ", brandName);
      let isBrandClassNameAddedToBody =
        document.body.classList.contains(brandName);
      if (!isBrandClassNameAddedToBody) {
        document.body.classList.add(brandName);
      }
    } catch (error) {}
  };

const handleSelectBrand = async (brand) => {
  if (brand?.status !== "active") {
    setOpen(true);
    setSelectedBrandData(brand);
  } else {

    let pathnameToRedirectAfterLogin = localStorage.getItem("pathname");
    console.log("pathnameToRedirectAfterLogin", pathnameToRedirectAfterLogin);

    dispatch(resetDownloadBasketMeta());
    dispatch(resetAllTrackFilters());

    try {
      document.body.classList.remove(
        prevBrandName?.replaceAll(" ", "")?.toLowerCase()
      );
    } catch (error) {}

    localStorage.setItem("brandId", brand?.brandId);

    addBrandNameClassToBodyElement(
      brand?.brandName?.replaceAll(" ", "")?.toLowerCase()
    );

    const brandAccessResponse = await AsyncService.loadData("/brand/brandAccess");
    const brandAccess = brandAccessResponse?.data;

    dispatch(
      setUserMeta({
        brandId: brand?.brandId,
        brandName: brand?.brandName,
        ssAccess: brandAccess?.ss_access,
        isCSUser: brandAccess?.cs_login,
        predictAccess: brandAccess?.predict,
        monitorAccess: brandAccess?.monitor,
        aimusicprovider: brandAccess?.aimusicprovider,
      })
    );

    updateBrandThemeConfig()
      .then(() => {})
      .catch((error) => console.log("error", error))
      .finally(() => {

        if (superBrandName !== brandConstants.WPP) {

          let pathnameToRedirectAfterLogin = localStorage.getItem("pathname");

          if (!!pathnameToRedirectAfterLogin) {
            localStorage.removeItem("pathname");

            // ⬇️ preserve requestId & query params
            if (pathnameToRedirectAfterLogin.includes("?")) {
              navigate(pathnameToRedirectAfterLogin + "&reload=1");
            } else {
              navigate(pathnameToRedirectAfterLogin + "?reload=1");
            }

          } else {
            navigate("/?reload=1");
          }

        } else {
          navigate("/");
        }

      });
  }
};


  const getUsersBrands = () => {
    //console.log("SelectBrandPage::getUsersBrands", isAuthenticated());
    AsyncService?.loadData("/brand/getBrandListByCurrentUser")
      .then((res) => {
        const sortedData = _.sortBy(res?.data || [], [
          // (item) => item.default !== "true",
          // (item) => item.defaultBrand !== true,
          (item) => item.status !== "active",
        ]);
        console.log("sortedData::", sortedData);
        if (sortedData.length === 1 && sortedData[0].status === "active") {
          handleSelectBrand(sortedData[0]);
        }
        setBranding(sortedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated()) {
      //console.log("SelectBrandPage::isAuthenticated", isAuthenticated());
      getUsersBrands();
    } else {
      navigate("/login");
    }
  }, []);
  if (superBrandName !== brandConstants.WPP) {
    useEffect(() => {
      const handlePopState = () => {
        const hash = window.location.hash; // e.g. #/library or #/editor
        const hasReload = hash.includes("reload=1");

        if (!hasReload) {
          const [pathOnly, queryString = ""] = hash.split("?");
          const newHash = `${pathOnly}?reload=1`;

          // ✅ Update the full URL with reload param inside the hash
          const newUrl = `${window.location.origin}${window.location.pathname}${newHash}`;
          window.location.replace(newUrl);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }, []);
  }

  function getManagerDetails(brandId) {
    AsyncService?.loadData(`brandMaster/activeManagerList?brandId=${brandId}`)
      .then((response) => {
        console.log(response, "response managers");

        setManagers(response.data.data);
      })
      .catch((err) => console.log(err));
  }

  return (
    <V3AuthLayout>
      <div className="select_company_page">
        {isLoading ? (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <SpinnerDefault />
          </div>
        ) : (
          <>
            {branding.length === 0 ? (
              <>
                <p className="headerText">
                  There is no brand available to access
                </p>
                <ButtonWrapper
                  style={{ marginTop: "10px" }}
                  onClick={() => navigate("/logout")}
                >
                  Log Out
                </ButtonWrapper>
              </>
            ) : (
              <>
                <p className="headerText">
                  <FormattedMessage id="selectBrand.title" />
                </p>
                <div
                  className="brandList_container"
                  onWheel={(e) => {
                    const el = e.currentTarget;
                    if (e.deltaY !== 0) {
                      e.preventDefault();
                      el.scrollBy({
                        left: e.deltaY * 2.5,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  {branding?.map((brand) => {
                    const onSelect = (brand) => {
                      console.log('select 2');
                      handleSelectBrand(brand);
                      getManagerDetails(brand?.brandId);
                    };

                    return (
                      <Fragment key={brand?.brandId}>
                        {["active", "pending"]?.includes(brand?.status) && (
                          <BrandButton
                            className={
                              brand?.brandId === selectedBrandData?.brandId
                                ? "selectedBrand"
                                : ""
                            }
                            brand={brand}
                            handleSelectBrand={() => onSelect(brand)}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </>
            )}

            <RequestNewBrandModal
              notExistBrands={branding.filter(
                (brand) => brand.status === "reject"
              )}
              getUsersBrands={getUsersBrands}
              existingBrands={branding}
            />
          </>
        )}
      </div>
    </V3AuthLayout>
  );
}

function RequestNewBrandModal({
  notExistBrands,
  getUsersBrands,
  existingBrands,
}) {
  const [selectedBrandData, setSelectedBrandData] = useState([]);
  const [open, setOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [managers, setManagers] = useState();

  const handleSelectBrand = (brand) => {
    setSelectedBrandData(brand);
    setRequestOpen(true);
  };

  function getManagerDetails(brandId) {
    return AsyncService?.loadData(`brandMaster/activeManagerList?brandId=${brandId}`)
      .then((response) => {
        setManagers(response.data.data);
      })
      .catch((err) => console.log(err));
  }


  return (
    <div className="requestNewBrandContainer">
      <ButtonWrapper
        onClick={() => setOpen(true)}
        style={{ marginTop: "3.5rem" }}
      >
        Request New Brand
      </ButtonWrapper>

      <ModalWrapper
        isOpen={open}
        setIsOpen={setOpen}
        onClose={() => setOpen(false)}
        className="request-new-brand-access-dialog select_company_page "
        title="Request New Brand"
      >
        <div
          className="brandList_container"
          onWheel={(e) => {
            const el = e.currentTarget;
            if (e.deltaY !== 0) {
              e.preventDefault();
              el.scrollBy({
                left: e.deltaY * 2.5,
                behavior: "smooth",
              });
            }
          }}
        >
          {existingBrands?.map((brand) => {
            const onSelect = async (brand) => {
              console.log('select 1');
              await getManagerDetails(brand?.brandId);
              handleSelectBrand(brand); 
            };

            return (
              <Fragment key={brand?.brandId}>
                {["notexits"]?.includes(brand?.status) && (
                  <BrandButton
                    className={
                      brand?.brandId === selectedBrandData?.brandId
                        ? "selectedBrand"
                        : ""
                    }
                    brand={brand}
                    handleSelectBrand={() => onSelect(brand)}
                  />
                )}
              </Fragment>
            );
          })}
        </div>

        <RequestAccessModal
          selectedBrandData={selectedBrandData}
          setSelectedBrandData={setSelectedBrandData}
          getUsersBrands={getUsersBrands}
          open={requestOpen}
          setOpen={setRequestOpen}
          managers={managers ?? [] }
        />
      </ModalWrapper>
    </div>
  );
}
