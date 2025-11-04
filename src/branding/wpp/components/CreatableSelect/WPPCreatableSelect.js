// import React, { useEffect, useState } from "react";
// import "./WPPCreatableSelect.css";
// import CreatableSelect from "react-select/creatable";
// import {
//   WppAutocomplete,
//   WppListItem,
// } from "@wppopen/components-library-react";

// const WPPCreatableSelect = ({
//   field,
//   options,
//   onChange,
//   form: { setFieldValue },

//   ...props
// }) => {
//   const [wppOptions, setWppOptions] = useState([
//     {
//       id: 5,
//       label: "Pineapple",
//     },
//     {
//       id: 3,
//       label: "Kiwi",
//     },
//     {
//       id: 13,
//       label: "Pear",
//     },
//   ]);
//   const [basicValue, setBasicValue] = useState([]);

//   useEffect(() => {
//     if (!options?.length) return;
//     let newOptions = options?.map((opt, index) => ({
//       id: index + 1,
//       label: opt?.label,
//     }));
//     console.log("setWppOptions", newOptions);
//     setWppOptions(newOptions);
//   }, [options?.length]);

//   const handleCreate = (inputValue, setFieldValue) => {
//     console.log("input value", inputValue);
//     const newValue = { id: wppOptions.length + 1, label: inputValue };
//     console.log("wppOptions", wppOptions);
//     setWppOptions(
//       [...wppOptions, newValue].sort((a, b) =>
//         a.label > b.label ? 1 : b.label > a.label ? -1 : 0
//       )
//     );
//     setBasicValue(newValue);
//     setFieldValue("company", newValue?.label);
//   };

//   return (
//     <div className={`ss_select_container`}>
//       <div data-testid="autocompletes">
//         <div>
//           <WppAutocomplete
//             {...props}
//             required
//             value={basicValue}
//             onWppChange={(e) => {
//               setBasicValue(e.detail.value);
//               onChange(e.detail.value[0]);
//             }}
//             onWppCreateNewOption={(e) => {
//               console.log("wppCreateNewOption e.detail.value", e.detail);
//               handleCreate(e.detail, setFieldValue);
//             }}
//             multiple={false}
//             data-testid="basic-autocomplete"
//             showCreateNewElement
//             simpleSearch
//           >
//             {console.log("wppOptions", wppOptions)}
//             {wppOptions?.map((option) => (
//               <WppListItem key={option.id} value={option} label={option.label}>
//                 <p slot="label">{option.label}</p>
//               </WppListItem>
//             ))}
//           </WppAutocomplete>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WPPCreatableSelect;

import React from "react";
import "./WPPCreatableSelect.css";
import CreatableSelect from "react-select/creatable";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    // borderBottom: "1px dotted var(--color-card)",
    color: "var(--color-white)",
    borderRadius: "var(--wpp-border-radius-m)",
    padding: "6px 10px",
    margin: "0px 0px 5px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: state.isSelected ? "var(--color-card)" : "var(--color-bg)",
    ":hover": {
      backgroundColor: "var(--color-card)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    marginTop: "0px",
    padding: "0px 10px",
    color: "var(--color-white)",
  }),
  control: (provided, state) => ({
    ...provided,
    borderRadius: "var(--wpp-border-radius-m)",
    fontSize: "14px",
    height: "40px",
    background: "var(--color-bg)",
    width: "100%",
    border: "1px solid #8b919a",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid #8b919a",
      boxShadow: "none",
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "var(--color-white)",
    fontSize: "14px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    transition: "all .2s ease",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#8e8e8e",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    width: "0",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "40px",
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--color-white)",
    margin: "0px",
    padding: "0px",
    height: "40px",
  }),
  menu: (provided) => ({
    ...provided,
    padding: 10,
    background: "var(--color-bg)",
    borderRadius: "var(--wpp-border-radius-m)",
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

const WPPCreatableSelect = ({
  field,
  options,
  setOptions,
  form: { setFieldValue },
  ...props
}) => {
  const handleCreate = (inputValue, setFieldValue) => {
    // console.log("input value", inputValue);
    const newValue = { value: inputValue.toLowerCase(), label: inputValue };
    // console.log("options", options);
    setOptions(
      [...options, newValue].sort((a, b) =>
        a.label > b.label ? 1 : b.label > a.label ? -1 : 0
      )
    );
    setFieldValue("company", newValue);
  };

  return (
    <div className={`ss_select_container`}>
      <CreatableSelect
        {...field}
        {...props}
        isClearable
        options={options}
        onCreateOption={(value) => {
          handleCreate(value, setFieldValue);
        }}
        // value={field.value ? { label: field.value, values: field.value } : null}
        value={field.value || null}
        styles={customStyles}
      />
    </div>
  );
};

export default WPPCreatableSelect;
