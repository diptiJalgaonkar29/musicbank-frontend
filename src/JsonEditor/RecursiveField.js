import React, { useState, useEffect } from "react";
import { useFormikContext, getIn, setIn, Field } from "formik";
import TextAreaWrapper from "../branding/componentWrapper/TextAreaWrapper";
import FileUploadField from './FileUploadField';
const getIndentStyle = (depth) => ({

  paddingLeft: `${depth * 20}px`,
  marginBottom: "10px",
  width: '95%',
});

const isColorValue = (value, key, placeholder) => {
  const val = (value || placeholder || "").toString().trim();
  if (key?.toLowerCase().includes("color")) return true;
  if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) return true;
  if (/^rgba?\((\s*\d+\s*,){2,3}\s*[\d.]+\s*\)$/i.test(val)) return true;

  const named = ["red", "blue", "green", "black", "white", "gray", "silver", "yellow", "pink", "purple", "orange", "brown"];
  if (named.includes(val.toLowerCase())) return true;

  if (/^\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*$/.test(val)) return true;

  return false;
};

const RecursiveField = ({ namePrefix, data, placeholders, depth = 0 ,pathAttr}) => {
  const { values, setValues } = useFormikContext();
  const [collapsed, setCollapsed] = useState({});
  const [fileKeys, setFileKeys] = useState([]);
  const [fileNames, setFileNames] = useState({});

  const toggle = (path) =>
    setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }));

  const isThemeEditor = window.location.href.includes("editor=theme");
  const isConfigEditor = window.location.href.includes("editor=config");

  const handleAddToArray = (path) => {
    const currentVal = getIn(values, path) || [];
    const updated = [...currentVal, ""];
    setValues(setIn({ ...values }, path, updated));
  };

  const handleRemoveFromArray = (path, index) => {
    const arr = [...(getIn(values, path) || [])];
    arr.splice(index, 1);
    setValues(setIn({ ...values }, path, arr));
  };

  useEffect(() => {
    if (pathAttr) {
      try {
        const parsed = pathAttr.map(item => {
          return typeof item === "string" ? JSON.parse(item) : item;
        });
        setFileKeys(parsed);
      } catch (e) {
        console.error("Error parsing PATH_ATTRIBUTES", e);
        setFileKeys([]);
      }
    }
  }, [values]);


  return (
    <div className={isThemeEditor ? "ss_theme_editor_grid" : ""}>
      {Object.entries(data)?.map(([key, val]) => {
        const currentPath = namePrefix ? `${namePrefix}.${key}` : key;
        const isCollapsed = collapsed[currentPath];
        const placeholderVal = placeholders ? getIn(placeholders, currentPath) : "";
        const fileConfig = fileKeys.find(fileObj => fileObj.key === key);
        const allowedTypes = fileConfig?.type || [];
        const isFileField = !!fileConfig;

        // Array
        if (Array.isArray(val)) {
          const arrayValues = getIn(values, currentPath) || [];

          return (
            <div key={currentPath} style={getIndentStyle(depth)}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--color-card)",
                  padding: "8px 12px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  marginBottom: "10px",
                }}
              >
                <span>{key} [{arrayValues.length}]:</span>
                <button
                  type="button"
                  onClick={() => handleAddToArray(currentPath)}
                  style={{
                    background: "green",
                    border: "none",
                    padding: "4px 10px",
                    cursor: "pointer",
                    color: "white"
                  }}
                >
                  ＋
                </button>
              </div>

              {arrayValues.map((item, idx) => {
                const itemPath = `${currentPath}[${idx}]`;
                const isObject = typeof item === "object" && item !== null;

                return (
                  <div key={itemPath} style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        {isObject ? (
                          <RecursiveField
                            namePrefix={itemPath}
                            data={item}
                            placeholders={placeholders}
                            depth={depth + 1}
                            pathAttr={pathAttr}
                          />
                        ) : (
                          <Field
                            name={itemPath}
                            component={TextAreaWrapper}
                            placeholder={placeholderVal?.toString()}
                            rows="2"
                            style={{ width: "calc(100% - 60px)" }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromArray(currentPath, idx)}
                        style={{
                          background: "red",
                          border: "none",
                          marginLeft: "10px",
                          padding: "4px 10px",
                          cursor: "pointer",
                          color: "white"
                        }}
                      >
                        －
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Object
        if (typeof val === "object" && val !== null) {
          return (
            <div key={currentPath} style={getIndentStyle(depth)}>
              <button
                type="button"
                onClick={() => toggle(currentPath)}
                style={{
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px",
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-white)",
                }}
              >
                <span style={{ width: "20px" }}>{isCollapsed ? "▶" : "▼"}</span>
                <span>{key}</span>
              </button>
              {!isCollapsed && (
                <RecursiveField
                  namePrefix={currentPath}
                  data={val}
                  placeholders={placeholders}
                  depth={depth + 1}
                  pathAttr={pathAttr}
                />
              )}
            </div>
          );
        }

        // Primitive field
        return (
          <div key={currentPath} style={{ ...getIndentStyle(depth), marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>{key}</h3>
            </div>

            <div
              className={`ss_editor_row ${isConfigEditor && isFileField ? "ss_config_file_box" : ""}`}
              style={{ width: isConfigEditor && isFileField ? "70%" : "100%" }}
            >
              {isConfigEditor && isFileField ? (
                <Field name={currentPath}>
                  {({ field, form }) => (
                    <FileUploadField field={field} form={form} fileConfig={fileConfig} />
                  )}
                </Field>


              ) : (
                <Field
                  name={currentPath}
                  component={TextAreaWrapper}
                  placeholder={placeholderVal?.toString()}
                  rows="2"
                  style={{
                    flex: 1,
                    borderRadius: "6px",
                    padding: "8px",
                    border: "1px solid #d0d0d0",
                    // maxWidth:'350px',
                    // minWidth:'350px'
                    resize: "none",
                  }}

                />
              )}

              {isThemeEditor && (
                <Field name={currentPath}>
                  {({ field, form }) => {
                    const showPicker = isColorValue(field.value, key, placeholderVal);

                    const toHex = (val) => {
                      try {
                        const temp = document.createElement("div");
                        temp.style.color = val;
                        document.body.appendChild(temp);
                        const rgb = window.getComputedStyle(temp).color;
                        document.body.removeChild(temp);

                        const match = rgb.match(/\d+/g);
                        if (!match) return "#000000";

                        let [r, g, b] = match.map(Number);
                        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                      } catch {
                        return "#000000";
                      }
                    };

                    const base = field.value || placeholderVal || "#000000";
                    const hexValue = base.startsWith("#") ? base : toHex(base);

                    return showPicker && (
                      <input
                        type="color"
                        value={hexValue}
                        onChange={(e) => form.setFieldValue(currentPath, e.target.value)}
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                        }}
                      />
                    );
                  }}
                </Field>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecursiveField;
