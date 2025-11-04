import React from "react";
import { Formik, Form } from "formik";
import RecursiveField from "./RecursiveField";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import AsyncService from "../networking/services/AsyncService";
import getUpdatedPayload from "./getUpdatedPayload";

const JsonEditor = ({
  type,
  template,
  data,
  values,
  brandId,
  activeEditor,
}) => {
  // 🧼 Clean recursively and remove empty values
  const clean = (obj) =>
    obj && typeof obj === "object"
      ? Object.entries(obj).reduce((acc, [key, val]) => {
          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            const nested = clean(val);
            if (Object.keys(nested).length > 0) acc[key] = nested;
          } else if (typeof val !== "string" || val.trim() !== "") {
            acc[key] = val;
          }
          return acc;
        }, {})
      : {};

  const handleSubmit = async (values) => {
    let cleanedValues;

    // For SUPERBRAND, skip cleaning and keep all values as-is
    if (brandId === "SUPERBRAND") {
      cleanedValues = values;
    } else {
      cleanedValues = clean(values); // recursively removes empty strings/objects

      if (Object.keys(cleanedValues).length === 0) {
        console.log("No value filled");
        cleanedValues = null;
      }
    }

    let newCleanedValues = {};
    try {
      console.log(
        "cleanedValues A***",
        cleanedValues,
        Object.entries(cleanedValues)
      );
      Object.entries(cleanedValues || {}).forEach(([key, value]) => {
        console.log("key", key);
        console.log("value", value);

        if (Array.isArray(value)) {
          console.log("array", value);
          if (value?.length > 0 || brandId === "SUPERBRAND") {
            newCleanedValues[key] = value;
          }
        } else if (["true", "false"].includes(value)) {
          console.log("boolean", value);
          newCleanedValues[key] = "true" === value ? true : false;
        } else if (!!value || brandId === "SUPERBRAND") {
          console.log("string", value);
          newCleanedValues[key] = value;
        }
      });
      // const newCleanedValues1 = Object.entries(cleanedValues).map(
      //   ([key, value]) => {
      //     if (Array.isArray(value)) {
      //       if (value?.length > 0 || brandId === "SUPERBRAND") {
      //         return [key, value];
      //       }
      //     } else if (["true", "false"].includes(value)) {
      //       return [key, "true" === value ? true : false];
      //     } else if (!!value || brandId === "SUPERBRAND") {
      //       return [key, value];
      //     }
      //   }
      // );
      // console.log("newCleanedValues1", newCleanedValues1);
    } catch (error) {
      console.log("error", error);
    }

    newCleanedValues =
      Object.keys(newCleanedValues).length === 0 ? null : newCleanedValues;

    console.log("cleanedValues", cleanedValues);
    console.log("newCleanedValues", newCleanedValues);

    let updatedPayload = getUpdatedPayload(
      type,
      activeEditor,
      newCleanedValues
    );

    const response = await AsyncService.putData(
      `metaData/updateById/${brandId}?type=${type}`,
      updatedPayload
    );

    if (response?.status === 200 || response?.data === 1) {
      alert("Data updated successfully");
    } else {
      alert("Failed to update data", response);
    }
  };

  return (
    <Formik
      key={brandId}
      initialValues={values || {}} // allow rendering even if values is undefined
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form className={`${brandId}`}>
        <div className="editor_form_container">
          <RecursiveField
            namePrefix=""
            data={template}
            placeholders={data}
            depth={0}
          />
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ButtonWrapper type="submit">Submit JSON</ButtonWrapper>
        </div>
      </Form>
    </Formik>
  );
};

export default JsonEditor;
