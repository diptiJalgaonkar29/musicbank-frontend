import { useContext } from "react";
//import { brandConstants } from "../common/utils/brandConstants";
//import getSuperBrandName from "../common/utils/getSuperBrandName";
import { BrandingContext } from "../branding/provider/BrandingContext";

//const superBrandName = getSuperBrandName();

export const reactSelectCustomStyles = (touched, errors, name) => {
  const { config } = useContext(BrandingContext);
  //alert("reactSelectCustomStyles", config);
  return {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted var(--color-card)",
      padding: "5px 10px",
      fontSize: "1.6rem",
      cursor: "pointer",
      backgroundColor: "transparent",
      color: state.isSelected ? "var(--color-primary)" : "var(--color-white)",
      ":hover": {
        color:
          //superBrandName === brandConstants.SHELL
          config?.Modules?.isShellBrand
            ? "var(--color-white)"
            : "var(--color-primary)",
        backgroundColor:
          //superBrandName === brandConstants.SHELL
          config?.Modules?.isShellBrand
            ? "var(--color-primary)"
            : "transparent",
      },
      ":active": {
        color:
          // superBrandName === brandConstants.SHELL
          config?.Modules?.isShellBrand
            ? "var(--color-white)"
            : "var(--color-primary)",
        backgroundColor:
          //superBrandName === brandConstants.SHELL
          config?.Modules?.isShellBrand ? "var(--color-primary)" : "transparent",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      marginTop: "0px",
      padding: "0px 20px",
      color: "var(--color-white)",
    }),
    control: (provided) => ({
      ...provided,
      borderRadius: 25,
      fontSize: "1.6rem !important",
      height: "47px !important",
      background:
        // superBrandName === brandConstants.SHELL
        config?.Modules?.isShellBrand
          ? "var(--color-gray-2)"
          : "var(--color-bg)",
      border:
        errors[name] && touched[name]
          ? "1px solid red"
          : config?.Modules?.isShellBrand //superBrandName === brandConstants.SHELL
          ? "none"
          : "1px solid var(--color-white)",
      minHeight: "47px !important",
      width: "100%",
      boxShadow: "none",
      "&:hover": {
        border:
          errors[name] && touched[name]
            ? "1px solid red"
            : config?.Modules?.isShellBrand //superBrandName === brandConstants.SHELL
            ? "none"
            : "1px solid var(--color-white)",
      },
      "&:focus": {
        border: "1px solid var(--color-white)",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.data.color,
      fontSize: "1.6rem",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      transition: "all .2s ease",
      // transform: "rotate(180deg)",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "1.6rem",
      // color: "rgb(117, 117, 117)",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      width: "0",
    }),
    input: (provided, styles) => ({
      ...provided,
      color: "var(--color-white)",
      "@media only screen and (max-width: 950px)": {
        ...styles["@media only screen and (max-width: 950px)"],
        margin: "13px !important",
      },
    }),
    menu: (provided, state) => ({
      ...provided,
      borderBottom: "1px solid var(--color-card)",
      color: "red !important",
      padding: 10,
      background: "var(--color-bg)",
      border: "1px solid var(--color-white)",
      borderRadius: "15px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "175px",
      "::-webkit-scrollbar": {
        width: "10px",
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-white)",
        borderRadius: "18px",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
        borderRadius: "18px",
      },
      "::-webkit-scrollbar-thumb": {
        background: "var(--color-primary)",
        borderRadius: "18px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "var(--color-primary)",
      },
    }),
  };
};
