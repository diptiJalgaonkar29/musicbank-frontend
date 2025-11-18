import React, { useState, useEffect } from "react";
import AsyncService from "../networking/services/AsyncService";

const FileUploadField = ({ field, form, fileConfig }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [cssPreview, setCssPreview] = useState(null);
  const [svgContent, setSvgContent] = useState(null);

  const superBrandId = localStorage.getItem("superBrandId");

  const getBrandAssetBaseUrl = () => {
    const origin = document.location.origin;
    const brandassetsFolderName =
      localStorage.getItem("brandassetsFolderName") || superBrandId;
    return `${origin}/brandassets/${brandassetsFolderName}`;
  };

  const acceptedTypes =
    fileConfig?.type?.map((ext) => `.${ext}`).join(",") || "";

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const extension = file.name.split(".").pop().toLowerCase();
    const allowedTypes = fileConfig?.type || [];
    const uploadFileName = fileConfig?.fileName;
   const fileType = (() => {
        if (allowedTypes.includes("ttf") || allowedTypes.includes("otf")) return "fonts";
        if (allowedTypes.includes("css")) return "css";
        return "images";
      })();

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

      if (typeof resData === "string") {
        try {
          resData = JSON.parse(resData);
        } catch {}
      }

      const filePath = "/" + fileType + "/" + resData.fileName;
      form.setFieldValue(field.name, filePath);
      setCssPreview(null);
      setSvgContent(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed!");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleViewCSS = async () => {
    let brandAssetBaseUrl = getBrandAssetBaseUrl();
    const filePath = form.values[field.name];
    const fileUrl = `${brandAssetBaseUrl}/css/${filePath.split('/').pop()}`;
    // Toggle preview off if already open
    if (cssPreview) {
      setCssPreview(null);
      return;
    }

    try {
      const res = await fetch(fileUrl);
      const text = await res.text();
      setCssPreview(text);
    } catch (err) {
      console.error("Error fetching CSS file:", err);
      setCssPreview("Failed to load CSS content");
    }
  };

  useEffect(() => {
    const value = form.values[field.name];
    if (!value) return;
    const isSvg = /\.svg$/i.test(value);
    const fileUrl = `${getBrandAssetBaseUrl()}${value}`;
    if (isSvg) {
      fetch(fileUrl)
        .then((res) => res.text())
        .then(setSvgContent)
        .catch((err) => console.error("SVG fetch failed:", err));
    } else {
      setSvgContent(null);
    }
  }, [form.values[field.name]]);

  const value = form.values[field.name];
  const fileUrl = value ? `${getBrandAssetBaseUrl()}${value}` : "";
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(value || "");
  const isSvg = /\.svg$/i.test(value || "");
  const isCss = /\.css$/i.test(value || "");

  return (
    <div style={{ width: "100%",display: isCss ? 'block' : "flex" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
        }}
      >
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

        {value && (
          <>
            <input
              type="text"
              className="ss_file_name_display_input"
              value={value}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              style={{ flex: 1 }}
            />

            {isCss && (
              <button
                type="button"
                onClick={handleViewCSS}
                className='view_css_button'
              >
                {cssPreview ? "Hide" : "View"}
              </button>
            )}
          </>
        )}
      </div>

      {value && (
        <div>
          {isImage && (
            <img
              src={fileUrl}
              alt="Uploaded preview"
              className='image_preview_area'
            />
          )}

          {isSvg && svgContent && (
            <div
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className='svg_img_area'
            />
          )}
        </div>
      )}
      {cssPreview && (
        <pre
          className='css_pre_box'
        >
          {cssPreview}
        </pre>
      )}
    </div>
  );
};

export default FileUploadField;
