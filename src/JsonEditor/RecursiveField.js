import React, { useState } from "react";
import { useFormikContext, getIn, setIn, Field } from "formik";
import TextAreaWrapper from "../branding/componentWrapper/TextAreaWrapper";

const getIndentStyle = (depth) => ({
  paddingLeft: `${depth * 20}px`,
  marginBottom: "10px",
});

const RecursiveField = ({ namePrefix, data, placeholders, depth = 0 }) => {
  const { values, setValues } = useFormikContext();
  const [collapsed, setCollapsed] = useState({});

  const toggle = (path) => {
    setCollapsed((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

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

  return (
    <div>
      {Object.entries(data)?.map(([key, val]) => {
        const currentPath = namePrefix ? `${namePrefix}.${key}` : key;
        const isCollapsed = collapsed[currentPath];
        const placeholderVal = placeholders
          ? getIn(placeholders, currentPath)
          : "";

        // Handle Arrays
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
                  color: "var(--color-text)",
                  padding: "8px 12px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  marginBottom: "10px",
                }}
              >
                <span>
                  {key} [{arrayValues.length}]:
                </span>
                <button
                  type="button"
                  onClick={() => handleAddToArray(currentPath)}
                  style={{
                    background: "green",
                    color: "var(--color-text)",
                    border: "none",
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  ＋
                </button>
              </div>

              {arrayValues.map((item, idx) => {
                const itemPath = `${currentPath}[${idx}]`;
                const isObject = typeof item === "object" && item !== null;

                return (
                  <div key={itemPath} style={getIndentStyle(depth + 1)}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        {isObject ? (
                          <RecursiveField
                            namePrefix={itemPath}
                            data={item}
                            placeholders={placeholders}
                            depth={depth + 1}
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
                          color: "var(--color-text)",
                          border: "none",
                          marginLeft: "10px",
                          padding: "4px 10px",
                          cursor: "pointer",
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

        // Handle Nested Objects
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
                />
              )}
            </div>
          );
        }

        // Handle Primitive Field
        return (
          <div key={currentPath} style={getIndentStyle(depth)}>
            <label style={{ fontWeight: "bold", display: "block" }}>
              <h2>{key}:</h2>
            </label>
            <Field
              name={currentPath}
              component={TextAreaWrapper}
              placeholder={placeholderVal?.toString()}
              rows="3"
              style={{ width: "calc(100% - 100px)" }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RecursiveField;
