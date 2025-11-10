import React, { useState, useEffect } from "react";
import AsyncService from "../networking/services/AsyncService";

const FileUploadField = ({ field, form, fileConfig }) => {
  const [isUploading, setIsUploading] = React.useState(false);

  const acceptedTypes =
    fileConfig?.type?.map((ext) => `.${ext}`).join(",") || "";

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const extension = file.name.split(".").pop().toLowerCase();
    const allowedTypes = fileConfig?.type || [];
    const uploadFileName = fileConfig?.fileName;
    const fileType =
      allowedTypes.includes("ttf") || allowedTypes.includes("otf")
        ? "fonts"
        : "images";

    if (!allowedTypes.includes(extension)) {
      alert(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
      e.target.value = "";
      setIsUploading(false);
      return;
    }

    const queryParams = new URLSearchParams(window.location.hash.split("?")[1]);
    const brandId = queryParams.get("brand");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);
    formData.append("fileName", uploadFileName);

    try {
      const res = await AsyncService.postFormData(
        `metaData/upload/${brandId}`,
        formData
      );
      let resData = res.data;

      try {
        if (typeof resData === "string") resData = JSON.parse(resData);
      } catch {}

      const filePath = "/" + fileType + "/" + resData.fileName;
      // console.log(filePath,'filePath');
      form.setFieldValue(field.name, filePath);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed!");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label
        className="ss_file_choose_btn"
        style={{ opacity: isUploading ? 0.6 : 1 }}
      >
        {isUploading ? "Uploading..." : "Choose File"}
        <input
          type="file"
          style={{ display: "none" }}
          accept={acceptedTypes}
          disabled={isUploading}
          onChange={handleFileUpload}
        />
      </label>

      {form.values[field.name] && (
        <input
          type="text"
          className="ss_file_name_display_input"
          value={form.values[field.name]}
          onChange={(e) => form.setFieldValue(field.name, e.target.value)}
        />
      )}
    </div>
  );
};
export default FileUploadField;
